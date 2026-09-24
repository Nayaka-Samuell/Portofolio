import { Request, Response } from 'express';
import { contactSchema } from '../schemas';
import nodemailer from 'nodemailer';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = contactSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: parseResult.error.issues });
      return;
    }

    const { name, email, message } = parseResult.data;
    
    // Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `New Portfolio Contact Message from ${name}`,
      text: `You have received a new contact message.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px; max-width: 600px;">
          <h2 style="color: #333; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #0056b3;">
            <h4 style="margin-top: 0;">Message:</h4>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error: unknown) {
    console.error('Error in contact form:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
