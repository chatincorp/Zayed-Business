/**
 * Email Hook Abstraction Layer
 *
 * This module provides a unified interface for sending emails.
 * In development (Freebuff), it uses the Freebuff auth email service.
 * In production, it can be swapped to use SendGrid, Resend, Amazon SES, etc.
 *
 * To switch providers in production:
 * 1. Set EMAIL_PROVIDER env var to "sendgrid" | "resend" | "ses" | "freebuff"
 * 2. Set the corresponding API key env vars
 * 3. The hook will automatically use the configured provider
 */

import { action } from "./_generated/server";

// ─── Provider Configuration ────────────────────────────────────────

type EmailProvider = "freebuff" | "sendgrid" | "resend" | "ses";

interface EmailConfig {
  provider: EmailProvider;
  freebuff: {
    apiUrl: string;
    apiKey: string;
    appName: string;
  };
  sendgrid: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  resend: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  ses: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    fromEmail: string;
    fromName: string;
  };
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  fromName?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}

interface SendEmailResult {
  success: boolean;
  provider: EmailProvider;
  messageId?: string;
  error?: string;
}

// ─── Default Configuration ─────────────────────────────────────────

function getEmailConfig(): EmailConfig {
  const provider = (process.env.EMAIL_PROVIDER as EmailProvider) || "freebuff";

  return {
    provider,
    freebuff: {
      apiUrl: process.env.FREEBUFF_AUTH_URL || "https://auth.freebuff.app",
      apiKey: process.env.FREEBUFF_EMAIL_API_KEY || "fb_email_2crN1hqIArZP2bEfvjp5Qik4",
      appName: process.env.VLY_APP_NAME || "Yasir Zayed",
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY || "",
      fromEmail: process.env.SENDGRID_FROM_EMAIL || "noreply@yasirzayed.com",
      fromName: process.env.SENDGRID_FROM_NAME || "Yasir Zayed",
    },
    resend: {
      apiKey: process.env.RESEND_API_KEY || "",
      fromEmail: process.env.RESEND_FROM_EMAIL || "noreply@yasirzayed.com",
      fromName: process.env.RESEND_FROM_NAME || "Yasir Zayed",
    },
    ses: {
      region: process.env.AWS_SES_REGION || "us-east-1",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      fromEmail: process.env.SES_FROM_EMAIL || "noreply@yasirzayed.com",
      fromName: process.env.SES_FROM_NAME || "Yasir Zayed",
    },
  };
}

// ─── Freebuff Provider ─────────────────────────────────────────────

async function sendViaFreebuff(
  config: EmailConfig["freebuff"],
  params: SendEmailParams
): Promise<SendEmailResult> {
  try {
    const response = await fetch(`${config.apiUrl}/send_otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
      },
      body: JSON.stringify({
        to: params.to,
        otp: extractCodeFromHtml(params.html),
        appName: config.appName,
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        provider: "freebuff",
        error: `HTTP ${response.status}: ${errorText}`,
      };
    }

    return {
      success: true,
      provider: "freebuff",
      messageId: `freebuff_${Date.now()}`,
    };
  } catch (error) {
    return {
      success: false,
      provider: "freebuff",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ─── SendGrid Provider ─────────────────────────────────────────────

async function sendViaSendGrid(
  config: EmailConfig["sendgrid"],
  params: SendEmailParams
): Promise<SendEmailResult> {
  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: params.to }],
            ...(params.cc && { cc: params.cc.map((e) => ({ email: e })) }),
            ...(params.bcc && { bcc: params.bcc.map((e) => ({ email: e })) }),
          },
        ],
        from: {
          email: params.from || config.fromEmail,
          name: params.fromName || config.fromName,
        },
        reply_to: params.replyTo ? { email: params.replyTo } : undefined,
        subject: params.subject,
        content: [
          { type: "text/html", value: params.html },
          ...(params.text
            ? [{ type: "text/plain", value: params.text }]
            : []),
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      return {
        success: false,
        provider: "sendgrid",
        error: JSON.stringify(errorBody.errors || errorBody),
      };
    }

    const messageId = response.headers.get("x-message-id") || undefined;
    return {
      success: true,
      provider: "sendgrid",
      messageId,
    };
  } catch (error) {
    return {
      success: false,
      provider: "sendgrid",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ─── Resend Provider ───────────────────────────────────────────────

async function sendViaResend(
  config: EmailConfig["resend"],
  params: SendEmailParams
): Promise<SendEmailResult> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${params.fromName || config.fromName} <${params.from || config.fromEmail}>`,
        to: [params.to],
        subject: params.subject,
        html: params.html,
        text: params.text,
        reply_to: params.replyTo,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        provider: "resend",
        error: data.message || JSON.stringify(data),
      };
    }

    return {
      success: true,
      provider: "resend",
      messageId: data.id,
    };
  } catch (error) {
    return {
      success: false,
      provider: "resend",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ─── Amazon SES Provider (via API) ─────────────────────────────────

async function sendViaSES(
  config: EmailConfig["ses"],
  params: SendEmailParams
): Promise<SendEmailResult> {
  // For SES, you would typically use the AWS SDK.
  // This is a placeholder for the API-based approach.
  // In production, import @aws-sdk/client-ses and use SendEmailCommand.
  try {
    // Placeholder - implement with AWS SDK in production
    console.log("SES provider configured but not yet implemented:", {
      to: params.to,
      subject: params.subject,
      region: config.region,
    });
    return {
      success: false,
      provider: "ses",
      error: "SES provider not yet implemented. Use SendGrid or Resend instead.",
    };
  } catch (error) {
    return {
      success: false,
      provider: "ses",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ─── Utility Functions ─────────────────────────────────────────────

function extractCodeFromHtml(html: string): string {
  // Try to extract a 6-digit code from the HTML content
  const codeMatch = html.match(/\b(\d{6})\b/);
  return codeMatch ? codeMatch[1] : "";
}

// ─── Main Send Function ────────────────────────────────────────────

export async function sendEmail(
  params: SendEmailParams
): Promise<SendEmailResult> {
  const config = getEmailConfig();

  switch (config.provider) {
    case "freebuff":
      return sendViaFreebuff(config.freebuff, params);
    case "sendgrid":
      return sendViaSendGrid(config.sendgrid, params);
    case "resend":
      return sendViaResend(config.resend, params);
    case "ses":
      return sendViaSES(config.ses, params);
    default:
      return {
        success: false,
        provider: config.provider,
        error: `Unknown email provider: ${config.provider}`,
      };
  }
}

// ─── Email Templates ───────────────────────────────────────────────

export function buildVerificationEmailHtml(
  code: string,
  appName: string,
  purpose: string
): string {
  const purposeLabel =
    purpose === "login"
      ? "sign in"
      : purpose === "signup"
        ? "create your account"
        : purpose === "password_reset"
          ? "reset your password"
          : "verify your email";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
</head>
<body style="margin:0;padding:0;background-color:#0a1628;font-family:'Inter',system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a1628;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#111d32;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;text-align:center;">
              <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#0ea5e9,#0284c7);margin:0 auto 16px;line-height:48px;text-align:center;">
                <span style="color:white;font-weight:bold;font-size:18px;">YZ</span>
              </div>
              <h1 style="color:#f1f5f9;font-size:22px;font-weight:700;margin:0 0 8px;letter-spacing:-0.02em;">
                ${appName}
              </h1>
              <p style="color:#94a3b8;font-size:14px;margin:0;">Verification Code</p>
            </td>
          </tr>
          <!-- Code -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <div style="background-color:#0a1628;border:1px solid rgba(14,165,233,0.2);border-radius:12px;padding:20px 24px;margin-bottom:24px;">
                <p style="color:#94a3b8;font-size:13px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.1em;">
                  Your 6-digit code
                </p>
                <p style="color:#f1f5f9;font-size:36px;font-weight:800;letter-spacing:0.15em;margin:0;font-family:'Courier New',monospace;">
                  ${code}
                </p>
              </div>
              <p style="color:#94a3b8;font-size:13px;margin:0 0 8px;">
                Use this code to ${purposeLabel}.
              </p>
              <p style="color:#64748b;font-size:12px;margin:0;">
                This code expires in 15 minutes. If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
              <p style="color:#475569;font-size:11px;margin:0;">
                © ${new Date().getFullYear()} ${appName}. All rights reserved.
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

export function buildVerificationEmailText(
  code: string,
  appName: string,
  purpose: string
): string {
  const purposeLabel =
    purpose === "login"
      ? "sign in"
      : purpose === "signup"
        ? "create your account"
        : purpose === "password_reset"
          ? "reset your password"
          : "verify your email";

  return `
Your verification code for ${appName}:

${code}

Use this code to ${purposeLabel}.

This code expires in 15 minutes. If you didn't request this, you can safely ignore this email.

© ${new Date().getFullYear()} ${appName}. All rights reserved.
`.trim();
}

// ─── Convex Action: Send Verification Email ────────────────────────

export const sendVerificationEmail = action({
  args: {
    to: v.string(),
    code: v.string(),
    purpose: v.string(),
    appName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const appName = args.appName || "Yasir Zayed";
    const html = buildVerificationEmailHtml(args.code, appName, args.purpose);
    const text = buildVerificationEmailText(args.code, appName, args.purpose);

    const result = await sendEmail({
      to: args.to,
      subject: `Your ${appName} verification code: ${args.code}`,
      html,
      text,
    });

    // Log the email attempt
    await ctx.runMutation("emailLogs:create" as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      {
      to: args.to,
      subject: `Your ${appName} verification code: ${args.code}`,
      body: html,
      provider: result.provider,
      status: result.success ? "sent" : "failed",
      error: result.error,
      sentAt: Date.now(),
    });

    return result;
  },
});

// ─── Imports for action ────────────────────────────────────────────

import { v } from "convex/values";
