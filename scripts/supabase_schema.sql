-- ==============================================================================
-- TERRAFLOW PRE-LAUNCH WAITLIST SCHEMA
-- Database: Supabase (PostgreSQL)
-- Table: waitlist_users
-- ==============================================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.waitlist_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    first_name TEXT NULL,
    source TEXT NOT NULL DEFAULT 'terraflow-website',
    status TEXT NOT NULL DEFAULT 'joined',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    email_sent BOOLEAN NOT NULL DEFAULT false,
    email_sent_at TIMESTAMPTZ NULL,
    metadata JSONB NULL
);

-- 2. Enforce unique constraint on lowercase normalized email
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_users_lower_email_idx 
ON public.waitlist_users (LOWER(TRIM(email)));

-- 3. Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_waitlist_users_updated_at ON public.waitlist_users;
CREATE TRIGGER set_waitlist_users_updated_at
BEFORE UPDATE ON public.waitlist_users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 4. Row Level Security (RLS)
-- Server-side API uses SERVICE_ROLE_KEY to insert and query.
-- Anon users cannot read arbitrary emails from browser directly.
ALTER TABLE public.waitlist_users ENABLE ROW LEVEL SECURITY;

-- Allow insert via service role or controlled policy
CREATE POLICY "Enable service role full access" 
ON public.waitlist_users 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- 5. Admin / Future-Readiness Analytics View
CREATE OR REPLACE VIEW public.waitlist_analytics AS
SELECT 
    COUNT(*) AS total_signups,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) AS signups_today,
    COUNT(*) FILTER (WHERE created_at >= date_trunc('week', CURRENT_DATE)) AS signups_this_week,
    COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE)) AS signups_this_month,
    COUNT(*) FILTER (WHERE email_sent = true) AS emails_delivered,
    COUNT(*) FILTER (WHERE email_sent = false) AS emails_pending_or_failed
FROM public.waitlist_users;


-- ==============================================================================
-- TERRAFLOW HIGH-INTENT CONVERSATIONS SCHEMA
-- Table: contact_inquiries
-- ==============================================================================

-- 6. Create contact_inquiries table
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    company TEXT NULL,
    message TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'new',
    source TEXT NOT NULL DEFAULT 'website-contact'
);

-- Index for searching and status tracking
CREATE INDEX IF NOT EXISTS contact_inquiries_email_idx ON public.contact_inquiries(email);
CREATE INDEX IF NOT EXISTS contact_inquiries_created_at_idx ON public.contact_inquiries(created_at DESC);

-- 7. Row Level Security (RLS) for contact_inquiries
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous users to INSERT inquiries only
CREATE POLICY "Allow public insert contact inquiries"
ON public.contact_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Disallow public read/update/delete (service_role full access only)
CREATE POLICY "Enable service role full access for contact inquiries"
ON public.contact_inquiries
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

