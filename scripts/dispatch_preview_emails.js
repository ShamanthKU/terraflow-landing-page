// Dispatches all 3 TerraFlow email templates to terraflow78@gmail.com via Resend API
const fs = require('fs');
const path = require('path');

// Read .env.local for RESEND_API_KEY
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
let apiKey = '';
for (const line of envContent.split('\n')) {
  if (line.startsWith('RESEND_API_KEY=')) {
    apiKey = line.split('=')[1].trim();
  }
}
if (!apiKey) {
  apiKey = process.env.RESEND_API_KEY || '';
}
if (!apiKey) {
  console.error('Error: RESEND_API_KEY not found in .env.local or environment');
  process.exit(1);
}

const CDN_BASE = 'https://raw.githubusercontent.com/ShamanthKU/terraflow-landing-page/main/public';
const BANNER_GIF_URL = `${CDN_BASE}/images/terraflow-email-banner.gif`;

function renderWaitlistConfirmationHtml({ email, firstName }) {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to TerraFlow Early Access</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #15241C;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAF7; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E4EBE5; box-shadow: 0 10px 30px rgba(22, 43, 31, 0.04); overflow: hidden;">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 28px 36px 20px; border-bottom: 1px solid #F0F4F1;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="width: 34px; height: 34px; border-radius: 10px; background-color: #122B1E; text-align: center; vertical-align: middle; color: #5EEAD4; font-weight: 800; font-size: 14px; letter-spacing: -0.02em;">
                          TF
                        </td>
                        <td style="padding-left: 12px; font-weight: 800; font-size: 19px; letter-spacing: -0.02em; color: #122B1E;">
                          TerraFlow <span style="font-weight: 400; color: #059669; font-size: 14px; margin-left: 4px;">AI</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #059669; background-color: #ECFDF5; border: 1px solid #A7F3D0; padding: 5px 12px; border-radius: 999px;">
                      ● Early Access
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Cinematic Animated Cinemagraph Banner -->
          <tr>
            <td style="padding: 24px 36px 0;">
              <div style="border-radius: 14px; overflow: hidden; border: 1px solid #E6ECE8; line-height: 0;">
                <img src="${BANNER_GIF_URL}" alt="TerraFlow Kinetic Environment" width="508" style="width: 100%; max-width: 508px; height: auto; display: block; border: 0;" />
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 28px 36px 36px;">
              <span style="font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #059669; display: block; margin-bottom: 8px;">
                01 / CONFIRMATION
              </span>
              <h1 style="font-size: 26px; line-height: 1.25; font-weight: 800; color: #122B1E; margin: 0 0 16px; letter-spacing: -0.03em;">
                You're on the early-access list.
              </h1>
              
              <p style="font-size: 15px; line-height: 1.65; color: #2D4235; margin: 0 0 16px;">
                ${greeting}
              </p>
              
              <p style="font-size: 15px; line-height: 1.65; color: #2D4235; margin: 0 0 20px;">
                Thank you for joining the TerraFlow AI private beta queue with <strong style="color: #122B1E;">${email}</strong>. We are engineering the first unified intelligence platform where multichannel real estate chaos converts into continuous kinetic momentum.
              </p>

              <!-- Queue Badge Box (White Theme) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F6FAF7; border: 1px solid #DFEBE3; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td>
                          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #047857;">Access Status</span>
                          <p style="margin: 4px 0 0; font-size: 15px; font-weight: 700; color: #122B1E;">Priority Group Alpha • Queue Reserved</p>
                        </td>
                        <td align="right" style="vertical-align: middle;">
                          <span style="font-size: 22px;">🌱</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <h3 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #122B1E; margin: 0 0 12px;">
                What you will unlock with TerraFlow:
              </h3>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #2D4235; line-height: 1.5;">
                    <strong style="color: #059669;">✓ Unified Ingestion:</strong> Zero lead leakage across portal, WhatsApp, phone, and ad channels.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #2D4235; line-height: 1.5;">
                    <strong style="color: #059669;">✓ Autonomous Scoring:</strong> Sub-second intent qualification before an agent even picks up the phone.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #2D4235; line-height: 1.5;">
                    <strong style="color: #059669;">✓ Kinetic Momentum:</strong> Automated high-touch nurturing that turns cold leads into scheduled showings.
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="border-radius: 10px; background-color: #122B1E;">
                    <a href="https://github.com/ShamanthKU/terraflow-landing-page" target="_blank" style="font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; padding: 13px 26px; display: inline-block; border-radius: 10px;">
                      Explore TerraFlow AI →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 14px; color: #526B5C;">
                Warmly,<br>
                <strong style="color: #122B1E;">The TerraFlow AI Core Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #FAFCFA; border-top: 1px solid #EEF3EF; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #738A7D;">
                TerraFlow AI • Unified Real Estate Intelligence
              </p>
              <p style="margin: 0; font-size: 11px; color: #9AB0A4;">
                © ${new Date().getFullYear()} TerraFlow Inc. You received this because you requested early access.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderContactVisitorConfirmationHtml({ email, company, message }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TerraFlow Inquiry Acknowledgment</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAF7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #15241C;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAF7; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: #FFFFFF; border-radius: 20px; border: 1px solid #E4EBE5; box-shadow: 0 10px 30px rgba(22, 43, 31, 0.04); overflow: hidden;">
          
          <!-- Header Bar -->
          <tr>
            <td style="padding: 28px 36px 20px; border-bottom: 1px solid #F0F4F1;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="width: 34px; height: 34px; border-radius: 10px; background-color: #122B1E; text-align: center; vertical-align: middle; color: #5EEAD4; font-weight: 800; font-size: 14px; letter-spacing: -0.02em;">
                          TF
                        </td>
                        <td style="padding-left: 12px; font-weight: 800; font-size: 19px; letter-spacing: -0.02em; color: #122B1E;">
                          TerraFlow <span style="font-weight: 400; color: #059669; font-size: 14px; margin-left: 4px;">AI</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #059669; background-color: #ECFDF5; border: 1px solid #A7F3D0; padding: 5px 12px; border-radius: 999px;">
                      ACT VI / Advisory Receipt
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Cinematic Animated Cinemagraph Banner -->
          <tr>
            <td style="padding: 24px 36px 0;">
              <div style="border-radius: 14px; overflow: hidden; border: 1px solid #E6ECE8; line-height: 0;">
                <img src="${BANNER_GIF_URL}" alt="TerraFlow Kinetic Environment" width="508" style="width: 100%; max-width: 508px; height: auto; display: block; border: 0;" />
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 28px 36px 36px;">
              <span style="font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #059669; display: block; margin-bottom: 8px;">
                CONFIRMATION OF RECEIPT
              </span>
              <h1 style="font-size: 26px; line-height: 1.25; font-weight: 800; color: #122B1E; margin: 0 0 16px; letter-spacing: -0.03em;">
                We have received your direct inquiry.
              </h1>
              
              <p style="font-size: 15px; line-height: 1.65; color: #2D4235; margin: 0 0 20px;">
                Thank you for reaching out to TerraFlow. Rather than sending an automated generic slide deck, our systems engineering team personally analyzes every submission to identify where autonomous intelligence can streamline your lead flow.
              </p>

              <!-- Tailored Summary Card (White Theme) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAF7; border: 1px solid #E0E9E2; border-radius: 14px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #047857; display: block; margin-bottom: 12px;">
                      Submitted Context Summary
                    </span>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 14px;">
                      <tr>
                        <td style="padding: 6px 0; color: #526B5C; width: 140px; font-weight: 500;">Work Email:</td>
                        <td style="padding: 6px 0; color: #122B1E; font-weight: 700;">${email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #526B5C; font-weight: 500;">Organization / Team:</td>
                        <td style="padding: 6px 0; color: #122B1E; font-weight: 600;">${company || 'Private Real Estate Practice'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: #526B5C; font-weight: 500;">Turnaround SLA:</td>
                        <td style="padding: 6px 0; color: #059669; font-weight: 700;">Within 24 Hours</td>
                      </tr>
                      ${message ? `
                      <tr>
                        <td colspan="2" style="padding-top: 14px;">
                          <div style="padding: 12px 14px; background-color: #FFFFFF; border: 1px solid #E2EBE4; border-radius: 8px; font-size: 13px; color: #2D4235; line-height: 1.5; font-style: italic;">
                            "${message}"
                          </div>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <h3 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #122B1E; margin: 0 0 10px;">
                What happens next:
              </h3>
              <p style="font-size: 14px; line-height: 1.6; color: #2D4235; margin: 0 0 24px;">
                A solutions architect will review your workflow parameters and follow up directly with a tailored blueprint showing how TerraFlow’s kinetic intelligence integrates with your current CRM and marketing stack.
              </p>

              <p style="margin: 0; font-size: 14px; color: #526B5C;">
                Best regards,<br>
                <strong style="color: #122B1E;">The TerraFlow Advisory Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #FAFCFA; border-top: 1px solid #EEF3EF; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #738A7D;">
                TerraFlow AI • High-Intent Advisory Response
              </p>
              <p style="margin: 0; font-size: 11px; color: #9AB0A4;">
                © ${new Date().getFullYear()} TerraFlow Inc. Real-time autonomous real estate intelligence.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderContactNotificationHtml({ email, company, message, source, timestamp }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ACT VI High-Intent Lead Alert</title>
</head>
<body style="margin: 0; padding: 0; background-color: #06080C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #E5EAF3;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #06080C; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #0B0E14; border-radius: 20px; border: 1px solid rgba(45, 212, 191, 0.2); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6); overflow: hidden;">
          
          <!-- Header Bar (Dark Obsidian + Emerald Monogram) -->
          <tr>
            <td style="padding: 28px 36px 20px; border-bottom: 1px solid rgba(229, 234, 243, 0.08); background: linear-gradient(180deg, #10151E 0%, #0B0E14 100%);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #2DD4BF, #10B981); text-align: center; vertical-align: middle; color: #06080C; font-weight: 900; font-size: 15px; letter-spacing: -0.02em;">
                          TF
                        </td>
                        <td style="padding-left: 12px; font-weight: 800; font-size: 19px; letter-spacing: -0.02em; color: #FFFFFF;">
                          TerraFlow <span style="font-weight: 400; color: #2DD4BF; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; margin-left: 6px;">INTERNAL ALERT</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #2DD4BF; background-color: rgba(45, 212, 191, 0.1); border: 1px solid rgba(45, 212, 191, 0.3); padding: 5px 12px; border-radius: 999px;">
                      🔥 HIGH PRIORITY LEAD
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Cropped Hero Video Cinemagraph Banner (Embedded in Dark Frame) -->
          <tr>
            <td style="padding: 20px 36px 0;">
              <div style="border-radius: 12px; overflow: hidden; border: 1px solid rgba(45, 212, 191, 0.25); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5); line-height: 0;">
                <img src="${BANNER_GIF_URL}" alt="TerraFlow Kinetic Environment" width="528" style="width: 100%; max-width: 528px; height: auto; display: block; border: 0;" />
              </div>
            </td>
          </tr>

          <!-- Notification Body -->
          <tr>
            <td style="padding: 28px 36px 36px;">
              <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: #2DD4BF; display: block; margin-bottom: 6px;">
                ACT VI / ARCHITECTURE INBOUND
              </span>
              <h1 style="font-size: 24px; line-height: 1.3; font-weight: 800; color: #FFFFFF; margin: 0 0 16px; letter-spacing: -0.02em;">
                New High-Intent Inbound Conversation
              </h1>
              
              <p style="font-size: 14px; line-height: 1.6; color: #94A3B8; margin: 0 0 24px;">
                A prospective client has submitted an architecture conversation request via the TerraFlow landing page. Detailed dossier below:
              </p>

              <!-- Lead Matrix Table (Dark Obsidian Theme) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #121722; border: 1px solid rgba(229, 234, 243, 0.1); border-radius: 14px; margin-bottom: 24px; overflow: hidden;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 14px;">
                      <tr>
                        <td style="padding: 8px 0; color: #64748B; width: 140px; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">Prospect Email:</td>
                        <td style="padding: 8px 0; color: #2DD4BF; font-weight: 700;">
                          <a href="mailto:${email}" style="color: #2DD4BF; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748B; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">Company / Team:</td>
                        <td style="padding: 8px 0; color: #FFFFFF; font-weight: 600;">${company || '<em style="color: #64748B;">Not specified</em>'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748B; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">Received At:</td>
                        <td style="padding: 8px 0; color: #CBD5E1; font-family: monospace; font-size: 13px;">${timestamp}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748B; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">Pipeline Source:</td>
                        <td style="padding: 8px 0; color: #94A3B8; font-family: monospace; font-size: 12px;">${source}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Prospect Problem / Note Box -->
              <div style="background-color: #121722; border: 1px solid rgba(45, 212, 191, 0.25); border-left: 4px solid #2DD4BF; border-radius: 10px; padding: 18px 20px; margin-bottom: 28px;">
                <span style="display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #2DD4BF; margin-bottom: 8px;">
                  Submitted Challenge / Context:
                </span>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #E2E8F0; white-space: pre-wrap;">
                  ${message || '<em style="color: #64748B;">No custom note provided — requested direct architecture walkthrough.</em>'}
                </p>
              </div>

              <!-- Quick Action Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="border-radius: 10px; background: linear-gradient(135deg, #2DD4BF, #10B981);">
                    <a href="mailto:${email}?subject=TerraFlow%20AI%20%E2%80%94%20Architecture%20Follow-up" target="_blank" style="font-size: 14px; font-weight: 800; color: #06080C; text-decoration: none; padding: 13px 26px; display: inline-block; border-radius: 10px; letter-spacing: -0.01em;">
                      ⚡ Reply to ${email}
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 12px; color: #64748B;">
                TerraFlow Automated Lead Routing Engine • Supabase Persisted
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 36px; background-color: #080A0F; border-top: 1px solid rgba(229, 234, 243, 0.05); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #475569;">
                TerraFlow AI Internal Notification • Confidential • Sent via Resend API
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function sendEmail({ to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Terraflow <onboarding@resend.dev>',
      to: [to],
      subject,
      html
    })
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function main() {
  const targetEmail = 'terraflow78@gmail.com';
  console.log(`\n========================================`);
  console.log(`DISPATCHING ALL 3 TEMPLATES TO: ${targetEmail}`);
  console.log(`========================================\n`);

  // 1. Template 1 (White Theme)
  console.log('Dispatching Template 1: Waitlist Confirmation (White Theme)...');
  const t1 = await sendEmail({
    to: targetEmail,
    subject: "🌱 You're on the TerraFlow waitlist [Template 1 — White Theme]",
    html: renderWaitlistConfirmationHtml({
      email: targetEmail,
      firstName: 'Shamanth',
    })
  });
  console.log('Template 1 Result:', t1.status, JSON.stringify(t1.data));

  // Small delay between sends to respect rate limits
  await new Promise(r => setTimeout(r, 1200));

  // 2. Template 2 (White Theme)
  console.log('\nDispatching Template 2: Consultation & Architecture Inquiry Receipt (White Theme)...');
  const t2 = await sendEmail({
    to: targetEmail,
    subject: "🏛️ Inquiry Received — TerraFlow Architecture Advisory [Template 2 — White Theme]",
    html: renderContactVisitorConfirmationHtml({
      email: targetEmail,
      company: 'Apex Residential Realty',
      message: 'Looking to integrate autonomous lead qualification across our 45 brokerage agents and connect directly with our CRM.',
    })
  });
  console.log('Template 2 Result:', t2.status, JSON.stringify(t2.data));

  await new Promise(r => setTimeout(r, 1200));

  // 3. Template 3 (Dark Theme)
  console.log('\nDispatching Template 3: High-Value Inbound Team Notification (Dark Theme)...');
  const t3 = await sendEmail({
    to: targetEmail,
    subject: "🔥 High-Intent Inbound: Apex Residential Realty [Template 3 — Dark Theme]",
    html: renderContactNotificationHtml({
      email: 'lead.alex@apexrealty.com',
      company: 'Apex Residential Realty Group',
      message: 'Managing 120+ property inquiries daily. Need instant AI lead scoring, WhatsApp integration, and automated calendar routing for high-ticket buyers.',
      source: 'website-act-vi-conversation',
      timestamp: new Date().toISOString(),
    })
  });
  console.log('Template 3 Result:', t3.status, JSON.stringify(t3.data));

  console.log('\n========================================');
  console.log('ALL 3 TEMPLATES DISPATCHED SUCCESSFULLY!');
  console.log('========================================\n');
}

main().catch(console.error);
