// Dispatches the refined product messaging email templates to terraflow78@gmail.com via Resend API
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

const COLOR = {
  lightBg: '#F4F7FA',
  lightCard: '#FFFFFF',
  lightTextPrimary: '#1A202C',
  lightTextSecondary: '#4A5568',
  lightTextMuted: '#718096',
  lightBorder: '#E2E8F0',
  brandGreen: '#00B36E',
  brandGreenLight: '#E8F8F0',
  brandGreenBorder: '#A7F3D0',

  darkBg: '#080A0F',
  darkCard: '#0B0E14',
  darkCardInner: '#151A23',
  darkTextPrimary: '#E5EAF3',
  darkTextSecondary: '#94A3B8',
  darkTextMuted: '#64748B',
  darkBorder: 'rgba(229, 234, 243, 0.1)',
  mintAccent: '#2DD4BF',
  mintAccentBg: 'rgba(45, 212, 191, 0.1)',
  mintAccentBorder: 'rgba(45, 212, 191, 0.3)',
};

function renderWaitlistConfirmationHtml({ email, firstName, siteUrl = 'https://terraflow.ai' }) {
  const greeting = firstName ? `Hi ${firstName},` : 'Hi there,';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're on the TerraFlow early-access list</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLOR.lightBg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: ${COLOR.lightTextPrimary};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${COLOR.lightBg}; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: ${COLOR.lightCard}; border-radius: 20px; border: 1px solid ${COLOR.lightBorder}; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); overflow: hidden;">
          <tr>
            <td style="padding: 28px 36px 20px; border-bottom: 1px solid ${COLOR.lightBorder};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="width: 34px; height: 34px; border-radius: 9px; background-color: #0F172A; text-align: center; vertical-align: middle; color: ${COLOR.brandGreen}; font-weight: 800; font-size: 14px; letter-spacing: -0.02em;">
                          TF
                        </td>
                        <td style="padding-left: 12px; font-weight: 800; font-size: 19px; letter-spacing: -0.02em; color: ${COLOR.lightTextPrimary};">
                          TerraFlow <span style="font-weight: 500; color: ${COLOR.brandGreen}; font-size: 14px; margin-left: 2px;">AI</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: ${COLOR.brandGreen}; background-color: ${COLOR.brandGreenLight}; border: 1px solid ${COLOR.brandGreenBorder}; padding: 5px 12px; border-radius: 999px;">
                      ● Early Access
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 36px 0;">
              <div style="border-radius: 12px; overflow: hidden; border: 1px solid ${COLOR.lightBorder}; line-height: 0;">
                <img src="${BANNER_GIF_URL}" alt="TerraFlow Kinetic Environment" width="508" style="width: 100%; max-width: 508px; height: auto; display: block; border: 0;" />
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 36px 36px;">
              <h1 style="font-size: 26px; line-height: 1.25; font-weight: 800; color: ${COLOR.lightTextPrimary}; margin: 0 0 16px; letter-spacing: -0.02em;">
                You're on the early-access list.
              </h1>
              <p style="font-size: 15px; line-height: 1.65; color: ${COLOR.lightTextSecondary}; margin: 0 0 16px;">
                ${greeting}
              </p>
              <p style="font-size: 15px; line-height: 1.65; color: ${COLOR.lightTextSecondary}; margin: 0 0 16px;">
                Thanks for joining the TerraFlow AI early-access list. You're now among the first to hear when TerraFlow is ready for its next wave of users.
              </p>
              <p style="font-size: 15px; line-height: 1.65; color: ${COLOR.lightTextSecondary}; margin: 0 0 24px;">
                We're building a unified intelligence layer for modern real estate sales teams — bringing fragmented leads, conversations, and follow-ups into one continuous workflow.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${COLOR.brandGreenLight}; border: 1px solid ${COLOR.brandGreenBorder}; border-radius: 12px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: ${COLOR.brandGreen};">EARLY ACCESS</span>
                    <p style="margin: 4px 0 0; font-size: 14px; font-weight: 600; color: ${COLOR.lightTextPrimary};">
                      Your request has been successfully recorded for <strong style="color: #0F172A;">${email}</strong>.
                    </p>
                  </td>
                </tr>
              </table>
              <h3 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: ${COLOR.lightTextPrimary}; margin: 0 0 14px;">
                What TerraFlow is being built to help you do:
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="padding: 8px 0; vertical-align: top; width: 22px; color: ${COLOR.brandGreen}; font-weight: bold; font-size: 15px;">✓</td>
                  <td style="padding: 8px 0 8px 6px; font-size: 14px; color: ${COLOR.lightTextSecondary}; line-height: 1.55;">
                    <strong style="color: ${COLOR.lightTextPrimary};">Unified Lead Flow:</strong> Bring leads from portals, WhatsApp, websites, ads, and other channels into one intelligent workspace.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top; width: 22px; color: ${COLOR.brandGreen}; font-weight: bold; font-size: 15px;">✓</td>
                  <td style="padding: 8px 0 8px 6px; font-size: 14px; color: ${COLOR.lightTextSecondary}; line-height: 1.55;">
                    <strong style="color: ${COLOR.lightTextPrimary};">AI Lead Qualification:</strong> Automatically identify high-intent prospects and prioritize the conversations that need attention first.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top; width: 22px; color: ${COLOR.brandGreen}; font-weight: bold; font-size: 15px;">✓</td>
                  <td style="padding: 8px 0 8px 6px; font-size: 14px; color: ${COLOR.lightTextSecondary}; line-height: 1.55;">
                    <strong style="color: ${COLOR.lightTextPrimary};">Automated Follow-Up:</strong> Keep every conversation moving with intelligent follow-ups, reminders, and next-step actions.
                  </td>
                </tr>
              </table>
              <p style="font-size: 14px; line-height: 1.6; color: ${COLOR.lightTextSecondary}; margin: 0 0 24px;">
                We'll let you know when early access opens.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="border-radius: 10px; background-color: #0F172A;">
                    <a href="${siteUrl}" target="_blank" style="font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; padding: 13px 26px; display: inline-block; border-radius: 10px;">
                      Explore TerraFlow AI →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 14px; color: ${COLOR.lightTextMuted};">
                Best regards,<br>
                <strong style="color: ${COLOR.lightTextPrimary};">The TerraFlow AI Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 36px; background-color: #FAFCFE; border-top: 1px solid ${COLOR.lightBorder}; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; color: ${COLOR.lightTextMuted};">
                TerraFlow AI • Unified Real Estate Intelligence
              </p>
              <p style="margin: 0; font-size: 11px; color: #A0AEC0;">
                © 2026 TerraFlow AI. You received this because you requested early access.
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

function renderContactVisitorConfirmationHtml({ email, company, message, siteUrl = 'https://terraflow.ai' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We received your inquiry — TerraFlow AI</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLOR.lightBg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: ${COLOR.lightTextPrimary};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${COLOR.lightBg}; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 580px; background-color: ${COLOR.lightCard}; border-radius: 20px; border: 1px solid ${COLOR.lightBorder}; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); overflow: hidden;">
          <tr>
            <td style="padding: 28px 36px 20px; border-bottom: 1px solid ${COLOR.lightBorder};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="width: 34px; height: 34px; border-radius: 9px; background-color: #0F172A; text-align: center; vertical-align: middle; color: ${COLOR.brandGreen}; font-weight: 800; font-size: 14px; letter-spacing: -0.02em;">
                          TF
                        </td>
                        <td style="padding-left: 12px; font-weight: 800; font-size: 19px; letter-spacing: -0.02em; color: ${COLOR.lightTextPrimary};">
                          TerraFlow <span style="font-weight: 500; color: ${COLOR.brandGreen}; font-size: 14px; margin-left: 2px;">AI</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: ${COLOR.brandGreen}; background-color: ${COLOR.brandGreenLight}; border: 1px solid ${COLOR.brandGreenBorder}; padding: 5px 12px; border-radius: 999px;">
                      Inquiry Receipt
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 36px 0;">
              <div style="border-radius: 12px; overflow: hidden; border: 1px solid ${COLOR.lightBorder}; line-height: 0;">
                <img src="${BANNER_GIF_URL}" alt="TerraFlow Kinetic Environment" width="508" style="width: 100%; max-width: 508px; height: auto; display: block; border: 0;" />
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 36px 36px;">
              <h1 style="font-size: 26px; line-height: 1.25; font-weight: 800; color: ${COLOR.lightTextPrimary}; margin: 0 0 16px; letter-spacing: -0.02em;">
                We received your inquiry.
              </h1>
              <p style="font-size: 15px; line-height: 1.65; color: ${COLOR.lightTextSecondary}; margin: 0 0 16px;">
                Thanks for reaching out to TerraFlow. We've received your workflow details and will review the context you've shared with us.
              </p>
              <p style="font-size: 15px; line-height: 1.65; color: ${COLOR.lightTextSecondary}; margin: 0 0 24px;">
                Every inquiry is reviewed based on the workflow, team, and lead-management challenges you've shared with us.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; border: 1px solid ${COLOR.lightBorder}; border-radius: 14px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: ${COLOR.brandGreen}; display: block; margin-bottom: 12px;">
                      Your Inquiry Details
                    </span>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 14px;">
                      <tr>
                        <td style="padding: 6px 0; color: ${COLOR.lightTextMuted}; width: 140px; font-weight: 500;">Work Email:</td>
                        <td style="padding: 6px 0; color: ${COLOR.lightTextPrimary}; font-weight: 700;">${email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; color: ${COLOR.lightTextMuted}; font-weight: 500;">Organization:</td>
                        <td style="padding: 6px 0; color: ${COLOR.lightTextPrimary}; font-weight: 600;">${company || 'Private Practice / Portfolio'}</td>
                      </tr>
                      ${message ? `
                      <tr>
                        <td colspan="2" style="padding-top: 14px;">
                          <div style="padding: 12px 14px; background-color: #FFFFFF; border: 1px solid ${COLOR.lightBorder}; border-radius: 8px; font-size: 13px; color: ${COLOR.lightTextSecondary}; line-height: 1.5; font-style: italic;">
                            "${message}"
                          </div>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
              <h3 style="font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: ${COLOR.lightTextPrimary}; margin: 0 0 10px;">
                What happens next
              </h3>
              <p style="font-size: 14px; line-height: 1.6; color: ${COLOR.lightTextSecondary}; margin: 0 0 28px;">
                A member of the TerraFlow advisory team will review your workflow and follow up with a tailored blueprint.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="border-radius: 10px; background-color: #0F172A;">
                    <a href="${siteUrl}" target="_blank" style="font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; padding: 13px 26px; display: inline-block; border-radius: 10px;">
                      Visit TerraFlow AI →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 14px; color: ${COLOR.lightTextMuted};">
                Best regards,<br>
                <strong style="color: ${COLOR.lightTextPrimary};">The TerraFlow Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 36px; background-color: #FAFCFE; border-top: 1px solid ${COLOR.lightBorder}; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; color: ${COLOR.lightTextMuted};">
                TerraFlow AI • Unified Real Estate Intelligence
              </p>
              <p style="margin: 0; font-size: 11px; color: #A0AEC0;">
                © 2026 TerraFlow AI. All rights reserved.
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

function renderContactNotificationHtml({
  email,
  company,
  message,
  source = 'Website — ACT VI Conversation',
  leadType = 'Architecture & Workflow Inquiry',
  timestamp = new Date().toISOString(),
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales Operations Alert: Inbound Conversation</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLOR.darkBg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: ${COLOR.darkTextPrimary};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${COLOR.darkBg}; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: ${COLOR.darkCard}; border-radius: 20px; border: 1px solid ${COLOR.mintAccentBorder}; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6); overflow: hidden;">
          <tr>
            <td style="padding: 28px 36px 20px; border-bottom: 1px solid ${COLOR.darkBorder}; background: linear-gradient(180deg, #10151E 0%, #0B0E14 100%);">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td style="width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #2DD4BF, #00B36E); text-align: center; vertical-align: middle; color: #080A0F; font-weight: 900; font-size: 15px; letter-spacing: -0.02em;">
                          TF
                        </td>
                        <td style="padding-left: 12px; font-weight: 800; font-size: 19px; letter-spacing: -0.02em; color: #FFFFFF;">
                          TerraFlow <span style="font-weight: 500; color: ${COLOR.mintAccent}; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; margin-left: 6px;">SALES OPS ALERT</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: ${COLOR.mintAccent}; background-color: ${COLOR.mintAccentBg}; border: 1px solid ${COLOR.mintAccentBorder}; padding: 5px 12px; border-radius: 999px;">
                      🔥 HIGH PRIORITY
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 36px 0;">
              <div style="border-radius: 12px; overflow: hidden; border: 1px solid ${COLOR.mintAccentBorder}; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5); line-height: 0;">
                <img src="${BANNER_GIF_URL}" alt="TerraFlow Kinetic Environment" width="528" style="width: 100%; max-width: 528px; height: auto; display: block; border: 0;" />
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 36px 36px;">
              <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: ${COLOR.mintAccent}; display: block; margin-bottom: 6px;">
                ACT VI / INBOUND PIPELINE
              </span>
              <h1 style="font-size: 24px; line-height: 1.3; font-weight: 800; color: #FFFFFF; margin: 0 0 16px; letter-spacing: -0.02em;">
                New High-Intent Inbound Conversation
              </h1>
              <p style="font-size: 14px; line-height: 1.6; color: ${COLOR.darkTextSecondary}; margin: 0 0 24px;">
                A new inquiry has been recorded on the TerraFlow landing page. Context and operational scorecard below:
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: ${COLOR.darkCardInner}; border: 1px solid ${COLOR.darkBorder}; border-radius: 14px; margin-bottom: 24px; overflow: hidden;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px;">
                      <tr>
                        <td style="padding: 7px 0; color: ${COLOR.darkTextMuted}; width: 150px; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">Prospect Email:</td>
                        <td style="padding: 7px 0; color: ${COLOR.mintAccent}; font-weight: 700; font-size: 14px;">
                          <a href="mailto:${email}" style="color: ${COLOR.mintAccent}; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 7px 0; color: ${COLOR.darkTextMuted}; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">Company / Team:</td>
                        <td style="padding: 7px 0; color: #FFFFFF; font-weight: 600;">${company || '<em style="color: #64748B;">Not specified</em>'}</td>
                      </tr>
                      <tr>
                        <td style="padding: 7px 0; color: ${COLOR.darkTextMuted}; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">Lead Type:</td>
                        <td style="padding: 7px 0; color: #FFFFFF; font-weight: 500;">${leadType}</td>
                      </tr>
                      <tr>
                        <td style="padding: 7px 0; color: ${COLOR.darkTextMuted}; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">Lead Source:</td>
                        <td style="padding: 7px 0; color: ${COLOR.darkTextSecondary}; font-family: monospace; font-size: 12px;">${source}</td>
                      </tr>
                      <tr>
                        <td style="padding: 7px 0; color: ${COLOR.darkTextMuted}; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">Received At:</td>
                        <td style="padding: 7px 0; color: #CBD5E1; font-family: monospace; font-size: 12px;">${timestamp}</td>
                      </tr>
                      <tr>
                        <td style="padding: 7px 0; color: ${COLOR.darkTextMuted}; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">Recommended Action:</td>
                        <td style="padding: 7px 0; color: #34D399; font-weight: 700;">Contact within 24 hours</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <div style="background-color: ${COLOR.darkCardInner}; border: 1px solid ${COLOR.mintAccentBorder}; border-left: 4px solid ${COLOR.mintAccent}; border-radius: 10px; padding: 18px 20px; margin-bottom: 28px;">
                <span style="display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: ${COLOR.mintAccent}; margin-bottom: 8px;">
                  Submitted Challenge / Focus:
                </span>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #E2E8F0; white-space: pre-wrap;">
                  ${message || '<em style="color: #64748B;">No custom note entered — requested direct conversation follow-up.</em>'}
                </p>
              </div>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="border-radius: 10px; background: linear-gradient(135deg, #2DD4BF, #00B36E);">
                    <a href="mailto:${email}?subject=TerraFlow%20AI%20%E2%80%94%20Inquiry%20Follow-up" target="_blank" style="font-size: 14px; font-weight: 800; color: #080A0F; text-decoration: none; padding: 13px 26px; display: inline-block; border-radius: 10px; letter-spacing: -0.01em;">
                      ⚡ Reply to ${email}
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 12px; color: ${COLOR.darkTextMuted};">
                TerraFlow Automated Lead Routing Engine • Supabase Persisted
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 36px; background-color: #080A0F; border-top: 1px solid rgba(229, 234, 243, 0.05); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #475569;">
                TerraFlow AI Internal Alert • Sales Operations • Confidential
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
  console.log(`DISPATCHING REFINED MESSAGING TEMPLATES TO: ${targetEmail}`);
  console.log(`========================================\n`);

  // 1. Template 1 (White Theme)
  console.log('Dispatching Refined Template 1: Early Access Confirmation (White Theme)...');
  const t1 = await sendEmail({
    to: targetEmail,
    subject: "You're on the TerraFlow early-access list.",
    html: renderWaitlistConfirmationHtml({
      email: targetEmail,
      firstName: 'Shamanth',
    })
  });
  console.log('Template 1 Result:', t1.status, JSON.stringify(t1.data));

  await new Promise(r => setTimeout(r, 1200));

  // 2. Template 2 (White Theme)
  console.log('\nDispatching Refined Template 2: Inquiry Confirmation Receipt (White Theme)...');
  const t2 = await sendEmail({
    to: targetEmail,
    subject: "We received your inquiry — TerraFlow AI",
    html: renderContactVisitorConfirmationHtml({
      email: targetEmail,
      company: 'Apex Residential Realty Group',
      message: 'Looking to unify leads coming through Zillow, Facebook Ads, and WhatsApp into one streamlined inbox for our 35 agents.',
    })
  });
  console.log('Template 2 Result:', t2.status, JSON.stringify(t2.data));

  await new Promise(r => setTimeout(r, 1200));

  // 3. Template 3 (Dark Theme)
  console.log('\nDispatching Refined Template 3: Sales Operations Alert (Dark Theme)...');
  const t3 = await sendEmail({
    to: targetEmail,
    subject: "🔥 High-Intent Inbound: Apex Residential Realty Group",
    html: renderContactNotificationHtml({
      email: 'lead.alex@apexrealty.com',
      company: 'Apex Residential Realty Group',
      leadType: 'Architecture & Workflow Inquiry',
      source: 'Website — ACT VI Conversation',
      message: 'Looking to unify leads coming through Zillow, Facebook Ads, and WhatsApp into one streamlined inbox for our 35 agents.',
      timestamp: new Date().toISOString(),
    })
  });
  console.log('Template 3 Result:', t3.status, JSON.stringify(t3.data));

  console.log('\n========================================');
  console.log('ALL 3 REFINED TEMPLATES DISPATCHED SUCCESSFULLY!');
  console.log('========================================\n');
}

main().catch(console.error);
