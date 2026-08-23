import nodemailer from 'nodemailer';

const SITE_NAME = 'FITOFARM';

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_SENDER_EMAIL,
      pass: process.env.MAIL_SENDER_PASS,
    },
  });

const sendContactMail = async (name, email, subject, message) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.MAIL_SENDER_EMAIL,
    to: process.env.MAIL_SENDER_EMAIL,
    replyTo: email,
    subject: `[${SITE_NAME}] New Contact Form Submission: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5;">
          <tr>
            <td style="background-color: #1a1a1a; padding: 24px 32px;">
              <p style="color: #ffffff; font-size: 18px; margin: 0; letter-spacing: 0.5px;">${SITE_NAME}</p>
              <p style="color: #aaaaaa; font-size: 12px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">New Contact Message</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 8px;">
                    <span style="color: #888; font-size: 12px; text-transform: uppercase;">Name</span><br/>
                    <span style="color: #1a1a1a; font-size: 15px;">${name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <span style="color: #888; font-size: 12px; text-transform: uppercase;">Email</span><br/>
                    <a href="mailto:${email}" style="color: #1a1a1a; font-size: 15px; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 8px;">
                    <span style="color: #888; font-size: 12px; text-transform: uppercase;">Subject</span><br/>
                    <span style="color: #1a1a1a; font-size: 15px;">${subject}</span>
                  </td>
                </tr>
              </table>
              <div style="border-top: 1px solid #eee; padding-top: 20px;">
                <span style="color: #888; font-size: 12px; text-transform: uppercase;">Message</span>
                <p style="color: #1a1a1a; font-size: 15px; line-height: 1.7; margin-top: 8px; white-space: pre-wrap;">${message}</p>
              </div>
            </td>
          </tr>
        </table>
      </div>
    `,
  });

  await transporter.sendMail({
    from: process.env.MAIL_SENDER_EMAIL,
    to: email,
    subject: `[${SITE_NAME}] We received your message`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5;">
          <tr>
            <td style="background-color: #1a1a1a; padding: 24px 32px;">
              <p style="color: #ffffff; font-size: 18px; margin: 0; letter-spacing: 0.5px;">${SITE_NAME}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="color: #1a1a1a; font-size: 16px; margin: 0 0 12px 0;">Hi ${name},</p>
              <p style="color: #444; font-size: 15px; line-height: 1.7; margin: 0 0 24px 0;">
                Thanks for reaching out. We've received your message and will get back to you as soon as possible.
              </p>
              <div style="border-top: 1px solid #eee; padding-top: 20px;">
                <span style="color: #888; font-size: 12px; text-transform: uppercase;">Your Message</span>
                <p style="color: #1a1a1a; font-size: 15px; line-height: 1.7; margin-top: 8px; white-space: pre-wrap;">${message}</p>
              </div>
              <p style="color: #999; font-size: 12px; margin-top: 32px;">
                If you didn't send this message, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </div>
    `,
  });
};

export { sendContactMail };
