export interface WaitlistRecord {
  id?: string;
  email: string;
  first_name?: string | null;
  source?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  email_sent?: boolean;
  email_sent_at?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface ContactInquiryRecord {
  id?: string;
  email: string;
  company?: string | null;
  message?: string | null;
  status?: string;
  source?: string;
  created_at?: string;
}

export async function getSupabaseServerClient(): Promise<any | null> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// In-memory fallback for local development when Supabase credentials aren't yet populated in .env.local
const devWaitlistMemoryStore = new Set<string>();

export async function insertWaitlistUser(record: WaitlistRecord): Promise<{
  success: boolean;
  isDuplicate: boolean;
  error?: string;
  data?: WaitlistRecord;
}> {
  const normalizedEmail = record.email.trim().toLowerCase();
  const client = await getSupabaseServerClient();

  if (!client) {
    // Development fallback without credentials
    console.warn('[Terraflow Waitlist] SUPABASE_URL or keys not configured. Simulating storage in memory.');
    if (devWaitlistMemoryStore.has(normalizedEmail)) {
      return { success: true, isDuplicate: true };
    }
    devWaitlistMemoryStore.add(normalizedEmail);
    return {
      success: true,
      isDuplicate: false,
      data: {
        ...record,
        id: 'mock-' + Math.random().toString(36).substring(2, 9),
        email: normalizedEmail,
        created_at: new Date().toISOString(),
      },
    };
  }

  try {
    // Check for existing duplicate first
    const { data: existing, error: checkError } = await client
      .from('waitlist_users')
      .select('id, email, status')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('[Terraflow Waitlist] Query error:', checkError);
    }

    if (existing) {
      return { success: true, isDuplicate: true, data: existing };
    }

    // Insert new waitlist user
    const { data: inserted, error: insertError } = await client
      .from('waitlist_users')
      .insert([
        {
          email: normalizedEmail,
          first_name: record.first_name || null,
          source: record.source || 'terraflow-website',
          status: 'joined',
          email_sent: false,
          metadata: record.metadata || null,
        },
      ])
      .select()
      .single();

    if (insertError) {
      // Handle race condition on unique constraint error code 23505
      if (insertError.code === '23505') {
        return { success: true, isDuplicate: true };
      }
      console.error('[Terraflow Waitlist] Insert error:', insertError);
      return { success: false, isDuplicate: false, error: insertError.message };
    }

    return { success: true, isDuplicate: false, data: inserted };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown database error';
    console.error('[Terraflow Waitlist] Exception:', errorMsg);
    return { success: false, isDuplicate: false, error: errorMsg };
  }
}

export async function updateWaitlistEmailStatus(
  email: string,
  sent: boolean
): Promise<void> {
  const client = await getSupabaseServerClient();
  if (!client) return;

  try {
    await client
      .from('waitlist_users')
      .update({
        email_sent: sent,
        email_sent_at: sent ? new Date().toISOString() : null,
      })
      .eq('email', email.trim().toLowerCase());
  } catch (err) {
    console.error('[Terraflow Waitlist] Failed to update email_sent status:', err);
  }
}

// In-memory fallback for contact inquiries in local dev
const devContactInquiriesMemoryStore: ContactInquiryRecord[] = [];

export async function insertContactInquiry(record: ContactInquiryRecord): Promise<{
  success: boolean;
  data?: ContactInquiryRecord;
  error?: string;
}> {
  const normalizedEmail = record.email.trim().toLowerCase();
  const client = await getSupabaseServerClient();

  if (!client) {
    console.warn('[Terraflow Contact] SUPABASE_URL or keys not configured. Simulating storage in memory.');
    const mockRecord: ContactInquiryRecord = {
      id: 'mock-inquiry-' + Math.random().toString(36).substring(2, 9),
      email: normalizedEmail,
      company: record.company?.trim() || null,
      message: record.message?.trim() || null,
      status: 'new',
      source: record.source || 'website-contact',
      created_at: new Date().toISOString(),
    };
    devContactInquiriesMemoryStore.push(mockRecord);
    return {
      success: true,
      data: mockRecord,
    };
  }

  try {
    const { data, error } = await client
      .from('contact_inquiries')
      .insert([
        {
          email: normalizedEmail,
          company: record.company?.trim() || null,
          message: record.message?.trim() || null,
          status: 'new',
          source: record.source || 'website-contact',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[Terraflow Contact] Insert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown database error';
    console.error('[Terraflow Contact] Exception:', errorMsg);
    return { success: false, error: errorMsg };
  }
}
