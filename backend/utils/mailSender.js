import nodemailer from 'nodemailer';

const SITE_NAME = 'FITOFARM-2024';

  const COLOR = {
  pageBg: '#eff8f1',
  cardBg: '#ffffff',
  darkCard: '#1d5734',
  ink: '#131418',
  inkDim: 'rgba(19, 20, 24, 0.64)',
  inkFaint: 'rgba(19, 20, 24, 0.45)',
  gold: '#fbbc05',
  green: '#2f8a4f',
  greenDark: '#188038',
  greenTint: '#a9d9b6',
  hairline: 'rgba(19, 20, 24, 0.1)',
  fieldBg: 'rgba(19, 20, 24, 0.025)',
};

const FONT_HEAD = "'TBCContracticaCAPS-Black', Arial, Helvetica, sans-serif";
const FONT_BODY = "'TBCContractica-Regular', Arial, Helvetica, sans-serif";

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_SENDER_EMAIL,
      pass: process.env.MAIL_SENDER_PASS,
    },
  });

const wrapEmail = ({ eyebrow, bodyHtml, footerNote }) => `
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    ${eyebrow}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLOR.pageBg};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- header -->
          <tr>
            <td style="background-color:${COLOR.darkCard}; border-radius: 22px 22px 6px 6px; padding: 26px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:${FONT_HEAD}; font-size:20px; font-weight:900; letter-spacing:0.02em; color:#ffffff; text-transform:uppercase;">
                    FITOFARM<span style="color:${COLOR.greenTint};">-2024</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:10px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:22px; height:3px; background-color:${COLOR.gold}; border-radius:10px; font-size:0; line-height:0;">&nbsp;</td>
                        <td style="padding-left:10px; font-family:${FONT_BODY}; font-size:11px; font-weight:800; letter-spacing:0.06em; text-transform:uppercase; color:${COLOR.greenTint};">
                          ${eyebrow}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- body card -->
          <tr>
            <td style="background-color:${COLOR.cardBg}; border:1px solid ${COLOR.hairline}; border-top:none; border-radius: 0 0 6px 6px; padding: 32px 32px 28px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="padding: 26px 12px 8px; text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 14px;">
                <tr><td style="width:120px; height:3px; background-color:${COLOR.gold}; border-radius:10px; font-size:0; line-height:0;">&nbsp;</td></tr>
              </table>
              <p style="margin:0 0 4px; font-family:${FONT_BODY}; font-size:12px; letter-spacing:0.01em; color:${COLOR.inkFaint};">
                ${SITE_NAME} &mdash; sent from the contact form
              </p>
              ${footerNote ? `<p style="margin:0; font-family:${FONT_BODY}; font-size:11px; color:${COLOR.inkFaint};">${footerNote}</p>` : ''}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
`;

const fieldRow = (label, valueHtml) => `
  <tr>
    <td style="padding-bottom:14px;">
      <div style="font-family:${FONT_BODY}; font-size:11px; font-weight:800; letter-spacing:0.05em; text-transform:uppercase; color:${COLOR.green}; margin-bottom:5px;">
        ${label}
      </div>
      <div style="font-family:${FONT_BODY}; font-size:15px; color:${COLOR.ink}; background-color:${COLOR.fieldBg}; border:1px solid ${COLOR.hairline}; border-radius:8px; padding:10px 14px;">
        ${valueHtml}
      </div>
    </td>
  </tr>
`;

const messageBlock = (label, message) => `
  <div style="font-family:${FONT_BODY}; font-size:11px; font-weight:800; letter-spacing:0.05em; text-transform:uppercase; color:${COLOR.green}; margin-bottom:6px;">
    ${label}
  </div>
  <div style="font-family:${FONT_BODY}; font-size:15px; line-height:1.7; color:${COLOR.ink}; background-color:${COLOR.pageBg}; border:1px solid ${COLOR.hairline}; border-left:3px solid ${COLOR.gold}; border-radius:8px; padding:16px 18px; white-space:pre-wrap;">
    ${message}
  </div>
`;

const sendContactMail = async (name, email, subject, message) => {
  const transporter = createTransporter();

  const adminBody = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:6px;">
      ${fieldRow('Name', name)}
      ${fieldRow('Email', `<a href="mailto:${email}" style="color:${COLOR.ink}; text-decoration:none; border-bottom:1px solid ${COLOR.greenDark};">${email}</a>`)}
      ${fieldRow('Subject', subject)}
    </table>
    ${messageBlock('Message', message)}
  `;

  await transporter.sendMail({
    from: process.env.MAIL_SENDER_EMAIL,
    to: process.env.MAIL_SENDER_EMAIL,
    replyTo: email,
    subject: `[${SITE_NAME}] New contact form message: ${subject}`,
    html: wrapEmail({
      eyebrow: 'New Contact Message',
      bodyHtml: adminBody,
    }),
  });

  const userBody = `
    <p style="margin:0 0 16px; font-family:${FONT_BODY}; font-size:16px; color:${COLOR.ink};">
      Hi ${name},
    </p>
    <p style="margin:0 0 24px; font-family:${FONT_BODY}; font-size:15px; line-height:1.7; color:${COLOR.inkDim};">
      Thanks for reaching out. We've got your message, and someone from the team will follow up soon.
    </p>
    ${messageBlock('Your Message', message)}
  `;

  await transporter.sendMail({
    from: process.env.MAIL_SENDER_EMAIL,
    to: email,
    subject: `[${SITE_NAME}] Got your message`,
    html: wrapEmail({
      eyebrow: 'Message Received',
      bodyHtml: userBody,
      footerNote: "Didn't send this? You can ignore this email.",
    }),
  });
};

export { sendContactMail };