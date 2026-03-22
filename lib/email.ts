import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  await resend.emails.send({
    from: "Westernize <hello@westernize.dev>",
    to: email,
    subject: "Welcome to Westernize",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="font-size: 24px; color: #1a1a1a;">Welcome${name ? `, ${name}` : ""}!</h1>
        <p style="color: #666; line-height: 1.6;">
          You've got 3 free CV optimizations ready to go. Upload your CV and a job description,
          and we'll show you exactly what Western tech companies want to see.
        </p>
        <a href="https://westernize.dev/optimize"
           style="display: inline-block; background: #ff4422; color: #fff; padding: 12px 24px;
                  border-radius: 4px; text-decoration: none; font-weight: 600; margin-top: 16px;">
          Optimize my CV
        </a>
        <p style="color: #999; font-size: 13px; margin-top: 32px;">
          — The Westernize team
        </p>
      </div>
    `,
  });
}
