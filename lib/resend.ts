export interface SendWaitlistEmailParams {
  email: string;
  firstName?: string | null;
}

export async function sendWaitlistConfirmationEmail({
  email,
  firstName,
}: SendWaitlistEmailParams): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Terraflow <onboarding@resend.dev>';

  if (!resendApiKey) {
    console.log(`[Terraflow Email Mock] RESEND_API_KEY not configured. Simulated confirmation sent to: ${email}`);
    return { success: true };
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(resendApiKey);
    const greeting = firstName ? `Hi ${firstName},` : 'Hi there,';

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: "You're on the Terraflow waitlist 🌱",
      text: `${greeting}

You're officially on the Terraflow early-access list.

We're building Terraflow to help real estate teams capture, qualify and follow up with every opportunity — without letting good leads slip through the cracks.

We'll keep you updated as we get closer to opening early access.

Welcome to Terraflow.

— The Terraflow Team`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 40px 20px; color: #162B1F; line-height: 1.6;">
          <div style="margin-bottom: 28px;">
            <div style="display: inline-flex; align-items: center; gap: 8px;">
              <div style="width: 28px; height: 28px; border-radius: 8px; background-color: #1A3828; color: #FFFFFF; font-weight: bold; font-size: 13px; line-height: 28px; text-align: center;">TF</div>
              <span style="font-weight: 700; font-size: 18px; letter-spacing: -0.02em; color: #14261C;">Terraflow</span>
            </div>
          </div>
          
          <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 16px; color: #14261C; letter-spacing: -0.02em;">You're on the early-access list.</h2>
          
          <p style="margin-bottom: 16px; font-size: 15px; color: #253D30;">${greeting}</p>
          
          <p style="margin-bottom: 16px; font-size: 15px; color: #253D30;">
            You're officially on the Terraflow early-access waitlist.
          </p>
          
          <p style="margin-bottom: 16px; font-size: 15px; color: #253D30;">
            We're building Terraflow to help modern real estate teams capture, qualify, and follow up with every buyer opportunity — without letting high-intent leads slip through the cracks.
          </p>
          
          <p style="margin-bottom: 24px; font-size: 15px; color: #253D30;">
            We'll keep you updated as we get closer to opening our private beta.
          </p>
          
          <div style="padding: 16px 20px; background-color: #F4F7F2; border-radius: 12px; border: 1px solid rgba(26, 56, 40, 0.08); margin-bottom: 28px;">
            <p style="margin: 0; font-size: 13px; color: #2C4D38; font-weight: 500;">
              🌱 <strong>Status:</strong> Early Access Reserved • Priority Group 1
            </p>
          </div>
          
          <p style="margin-bottom: 4px; font-size: 15px; color: #253D30;">Welcome to Terraflow.</p>
          <p style="margin: 0; font-size: 15px; font-weight: 600; color: #1A3828;">— The Terraflow Team</p>
          
          <hr style="border: none; border-top: 1px solid rgba(26, 56, 40, 0.1); margin: 36px 0 20px;" />
          <p style="font-size: 11px; color: #6E8878; margin: 0;">
            © ${new Date().getFullYear()} Terraflow Inc. Intelligent sales automation for real estate. No spam, ever.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Terraflow Email] Resend API error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('[Terraflow Email] Exception while sending email:', message);
    return { success: false, error: message };
  }
}

export interface SendContactNotificationParams {
  email: string;
  company?: string | null;
  message?: string | null;
  source?: string;
  timestamp?: string;
}

export interface SendContactVisitorParams {
  email: string;
  company?: string | null;
}

/**
 * Sends an internal notification email to the TerraFlow team when a visitor initiates a conversation
 */
export async function sendContactNotificationEmail({
  email,
  company,
  message,
  source = 'website-contact',
  timestamp = new Date().toISOString(),
}: SendContactNotificationParams): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const teamEmail = process.env.TEAM_NOTIFICATION_EMAIL || process.env.RESEND_FROM_EMAIL || 'team@terraflow.ai';
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Terraflow Inquiries <onboarding@resend.dev>';

  if (!resendApiKey) {
    console.log(
      `[Terraflow Email Mock] RESEND_API_KEY not configured. Simulated internal team notification:`,
      { email, company, message, source, timestamp }
    );
    return { success: true };
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(resendApiKey);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [teamEmail],
      subject: 'New TerraFlow Conversation',
      text: `New conversation initiated on TerraFlow AI:
      
Email: ${email}
Company / Team: ${company || 'Not specified'}
Message: ${message || 'No additional message'}
Timestamp: ${timestamp}
Source: ${source}
`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #0B0E14; color: #E5EAF3; border-radius: 16px; border: 1px solid rgba(229, 234, 243, 0.1);">
          <div style="margin-bottom: 24px; border-bottom: 1px solid rgba(229, 234, 243, 0.1); padding-bottom: 16px;">
            <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.15em; color: #2DD4BF; text-transform: uppercase;">ACT VI / High-Intent Inquiry</span>
            <h2 style="font-size: 20px; font-weight: 700; color: #E5EAF3; margin: 8px 0 0;">New TerraFlow Conversation</h2>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; color: #94A3B8; width: 140px; font-weight: 500;">Work Email:</td>
              <td style="padding: 10px 0; color: #2DD4BF; font-weight: 600;"><a href="mailto:${email}" style="color: #2DD4BF; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #94A3B8; font-weight: 500;">Company / Team:</td>
              <td style="padding: 10px 0; color: #E5EAF3; font-weight: 500;">${company || '<em style="color: #64748B;">Not specified</em>'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #94A3B8; font-weight: 500;">Timestamp:</td>
              <td style="padding: 10px 0; color: #E5EAF3; font-weight: 500;">${timestamp}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #94A3B8; font-weight: 500;">Source:</td>
              <td style="padding: 10px 0; color: #94A3B8; font-family: monospace; font-size: 12px;">${source}</td>
            </tr>
          </table>

          <div style="background-color: #151A23; border: 1px solid rgba(45, 212, 191, 0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #2DD4BF;">What they are trying to improve:</p>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #E5EAF3; white-space: pre-wrap;">${message || '<em style="color: #64748B;">No custom message provided.</em>'}</p>
          </div>

          <div style="border-top: 1px solid rgba(229, 234, 243, 0.08); padding-top: 16px; font-size: 11px; color: #64748B;">
            TerraFlow AI Unified Real Estate Intelligence • High-Intent Visitor Pipeline
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('[Terraflow Contact Email] Resend API error (Team):', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown team notification error';
    console.error('[Terraflow Contact Email] Exception while sending team notification:', msg);
    return { success: false, error: msg };
  }
}

/**
 * Sends a visitor confirmation email reassuring them that TerraFlow received their message
 */
export async function sendContactVisitorConfirmationEmail({
  email,
  company,
}: SendContactVisitorParams): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Terraflow <conversations@resend.dev>';

  if (!resendApiKey) {
    console.log(
      `[Terraflow Email Mock] RESEND_API_KEY not configured. Simulated visitor confirmation sent to: ${email}`
    );
    return { success: true };
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(resendApiKey);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: 'Thanks for reaching out to TerraFlow',
      text: `Hi there,

Thank you for reaching out to TerraFlow.

We received your note${company ? ` regarding ${company}` : ''}. Our team reviews every inquiry individually to understand where autonomous workflows can turn fragmented lead flow into a unified system.

We will review your context and be in touch soon.

Best regards,
The TerraFlow Team
https://terraflow.ai
`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 40px 24px; background-color: #0B0E14; color: #E5EAF3; border-radius: 16px; border: 1px solid rgba(229, 234, 243, 0.1); line-height: 1.6;">
          <div style="margin-bottom: 28px;">
            <div style="display: inline-flex; align-items: center; gap: 10px;">
              <div style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #2DD4BF, #3B82F6); color: #0B0E14; font-weight: 900; font-size: 14px; line-height: 32px; text-align: center;">TF</div>
              <span style="font-weight: 800; font-size: 18px; letter-spacing: -0.01em; color: #E5EAF3;">TerraFlow AI</span>
            </div>
          </div>

          <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 16px; color: #E5EAF3; letter-spacing: -0.02em;">Thanks for reaching out.</h2>

          <p style="margin-bottom: 16px; font-size: 15px; color: rgba(229, 234, 243, 0.85);">
            We have received your message${company ? ` regarding <strong>${company}</strong>` : ''}.
          </p>

          <p style="margin-bottom: 16px; font-size: 15px; color: rgba(229, 234, 243, 0.85);">
            Our team reviews every inquiry directly. Rather than pushing a generic sales deck, we look closely at where autonomous multichannel intelligence can create real flow across your lead lifecycle.
          </p>

          <p style="margin-bottom: 24px; font-size: 15px; color: rgba(229, 234, 243, 0.85);">
            We'll be in touch soon with specific observations.
          </p>

          <div style="padding: 16px 20px; background-color: #151A23; border-radius: 12px; border: 1px solid rgba(45, 212, 191, 0.2); margin-bottom: 28px;">
            <p style="margin: 0; font-size: 13px; color: #2DD4BF; font-weight: 600;">
              ✓ Status: Direct Conversation Request Received
            </p>
          </div>

          <p style="margin-bottom: 4px; font-size: 15px; color: rgba(229, 234, 243, 0.85);">Warm regards,</p>
          <p style="margin: 0; font-size: 15px; font-weight: 700; color: #E5EAF3;">The TerraFlow Team</p>

          <hr style="border: none; border-top: 1px solid rgba(229, 234, 243, 0.1); margin: 36px 0 20px;" />
          <p style="font-size: 11px; color: #64748B; margin: 0;">
            © ${new Date().getFullYear()} TerraFlow AI, Inc. Unified Real Estate Intelligence.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Terraflow Contact Email] Resend API error (Visitor):', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown visitor confirmation error';
    console.error('[Terraflow Contact Email] Exception while sending visitor email:', msg);
    return { success: false, error: msg };
  }
}
