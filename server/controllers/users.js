import { sendContactMail } from '../utils/mailSender.js';

export const contact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await sendContactMail(name, email, subject, message);
    return res.status(200).json({ data: 'Message sent successfully' });
  } catch (err) {
    return res.status(500).json({ err: 'Something went wrong' });
  }
};
