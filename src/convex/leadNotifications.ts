/**
 * Lead notifications.
 *
 * Public intake (contact form, FMCG enquiry, supplier registration, wholesale
 * booking) writes into Convex and is otherwise only visible to someone who
 * opens the admin panel. This module emails the business inbox as soon as a
 * lead arrives, so nothing waits for a person to log in.
 *
 * Delivery reuses the provider already configured for `emailHook.sendEmail`
 * (`EMAIL_PROVIDER` = resend | sendgrid, plus that provider's API key), so no
 * extra dependency is involved. Recipients come from `LEAD_NOTIFY_EMAIL`, a
 * comma-separated list. When it is unset the action is a no-op: a deployment
 * without a configured inbox still accepts leads instead of failing.
 *
 * Mutations schedule this action and never await it, so a mail outage can
 * never reject a lead at the form.
 */

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { sendEmail } from "./emailHook";

const APP_NAME = "Yasir Zayed";
const SITE = "https://yasirzayed.com";

/** Split, normalise and de-duplicate the configured notification recipients. */
export function leadRecipients(
  raw: string | undefined = process.env.LEAD_NOTIFY_EMAIL,
): string[] {
  const seen = new Set<string>();
  for (const part of (raw ?? "").split(/[,;\s]+/)) {
    const email = part.trim().toLowerCase();
    if (email.includes("@")) seen.add(email);
  }
  return [...seen];
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Plain-text and HTML bodies for one notification, kept pure for tests. */
export function buildLeadNotification(
  kind: string,
  subject: string,
  lines: string[],
  replyTo?: string,
) {
  const subjectLine = `${kind}: ${subject || "new submission"}`.slice(0, 180);

  const text = [
    kind,
    "",
    ...lines,
    ...(replyTo ? ["", `Reply directly to: ${replyTo}`] : []),
    "",
    `${APP_NAME} · ${SITE}`,
  ].join("\n");

  const rows = lines
    .map(
      (line) =>
        `<tr><td style="padding:5px 0;color:#334155;font-size:14px;line-height:1.55">${escapeHtml(line)}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${escapeHtml(subjectLine)}</title></head>
<body style="margin:0;padding:24px;background-color:#f1f5f9;font-family:'Inter',system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background-color:#ffffff;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;">
    <tr>
      <td style="padding:24px 28px 8px;">
        <p style="margin:0 0 6px;color:#0ea5e9;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">${escapeHtml(kind)}</p>
        <h1 style="margin:0;color:#0f172a;font-size:20px;line-height:1.3;">${escapeHtml(subject || "New submission")}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:12px 28px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px;border-top:1px solid #e2e8f0;">
        <p style="margin:0;color:#64748b;font-size:12px;">
          ${replyTo ? `Reply directly to <a href="mailto:${escapeHtml(replyTo)}" style="color:#0ea5e9;">${escapeHtml(replyTo)}</a>. ` : ""}Sent automatically by ${APP_NAME}.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject: subjectLine, html, text };
}

/** Schedule from a mutation: `ctx.scheduler.runAfter(0, internal.leadNotifications.sendLeadNotification, {…})`. */
export const sendLeadNotification = internalAction({
  args: {
    kind: v.string(),
    subject: v.string(),
    lines: v.array(v.string()),
    replyTo: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const recipients = leadRecipients();
    if (recipients.length === 0) {
      return { skipped: true, sent: 0, failures: [] as string[] };
    }

    const { subject, html, text } = buildLeadNotification(
      args.kind,
      args.subject,
      args.lines,
      args.replyTo,
    );

    const failures: string[] = [];
    let sent = 0;
    for (const to of recipients) {
      const result = await sendEmail({ to, subject, html, text, replyTo: args.replyTo });
      if (result.success) sent += 1;
      else failures.push(`${to}: ${result.error ?? "unknown error"}`);
    }

    // Surface total failure in the Convex logs instead of losing it silently.
    if (sent === 0) {
      throw new Error(`Lead notification could not be sent — ${failures.join("; ")}`);
    }

    return { skipped: false, sent, failures };
  },
});
