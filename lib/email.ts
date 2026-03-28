import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Westernize <hello@westernize.dev>";

function wrap(content: string) {
  return `<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">${content}</div>`;
}

function button(href: string, label: string) {
  return `<a href="${href}" style="display: inline-block; background: #ff4422; color: #fff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: 600; margin-top: 16px;">${label}</a>`;
}

export async function sendVerificationEmail(email: string, url: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your email",
    html: wrap(`
      <h1 style="font-size: 24px; color: #1a1a1a;">Verify your email</h1>
      <p style="color: #666; line-height: 1.6;">
        Click the button below to verify your email address and activate your account.
      </p>
      ${button(url, "Verify email")}
      <p style="color: #999; font-size: 13px; margin-top: 32px;">
        If you didn't create an account, you can safely ignore this email.
      </p>
    `),
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Welcome to Westernize",
    html: wrap(`
      <h1 style="font-size: 24px; color: #1a1a1a;">Welcome${name ? `, ${name}` : ""}!</h1>
      <p style="color: #666; line-height: 1.6;">
        You've got 3 free CV optimizations ready to go. Upload your CV and a job description,
        and we'll show you exactly what Western tech companies want to see.
      </p>
      ${button("https://www.westernize.dev/optimize", "Optimize my CV")}
      <p style="color: #999; font-size: 13px; margin-top: 32px;">
        — The Westernize team
      </p>
    `),
  });
}

export async function sendResetPasswordEmail(email: string, url: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your password",
    html: wrap(`
      <h1 style="font-size: 24px; color: #1a1a1a;">Reset your password</h1>
      <p style="color: #666; line-height: 1.6;">
        Click the link below to reset your password. This link expires in 1 hour.
      </p>
      ${button(url, "Reset password")}
      <p style="color: #999; font-size: 13px; margin-top: 32px;">
        If you didn't request this, you can safely ignore this email.
      </p>
    `),
  });
}
