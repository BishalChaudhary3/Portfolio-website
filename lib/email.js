// lib/email.js
import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify email configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Email service configured successfully');
    return true;
  } catch (error) {
    console.error('❌ Email service configuration failed:', error);
    return false;
  }
}

// Send email
export async function sendEmail({ to, subject, html, text, from = process.env.EMAIL_USER }) {
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || '',
      html,
    });
    
    console.log(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

// Send contact notification email (to admin)
export async function sendContactNotification({ name, email, subject, message }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; margin-bottom: 5px; }
        .value { color: #333; background: white; padding: 10px; border-radius: 5px; border: 1px solid #e0e0e0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Contact Form Submission</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${email}</div>
          </div>
          <div class="field">
            <div class="label">Subject:</div>
            <div class="value">${subject}</div>
          </div>
          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${message.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        <div class="footer">
          <p>Sent from your portfolio website</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({
    to: process.env.EMAIL_USER,
    subject: `Portfolio Contact: ${subject}`,
    html,
  });
}

// Send auto-reply to user
export async function sendAutoReply({ to, name }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 10px 20px; background: #8b5cf6; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Thank You for Contacting Me!</h2>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to me. I have received your message and will get back to you within 24-48 hours.</p>
          <p>In the meantime, feel free to:</p>
          <ul>
            <li>Check out my latest projects on <a href="${process.env.NEXT_PUBLIC_SITE_URL}/projects">my portfolio</a></li>
            <li>Read my latest <a href="${process.env.NEXT_PUBLIC_SITE_URL}/blog">blog posts</a></li>
            <li>Connect with me on <a href="https://linkedin.com/in/yourusername">LinkedIn</a></li>
          </ul>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="button">Visit My Portfolio</a>
          <p>Best regards,<br>John Doe</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} John Doe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({
    to,
    subject: 'Thank You for Contacting Me!',
    html,
  });
}

// Send newsletter email
export async function sendNewsletter({ to, subject, content }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { padding: 20px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; border-top: 1px solid #e0e0e0; }
        .unsubscribe { color: #999; text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${subject}</h2>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>You're receiving this email because you subscribed to my newsletter.</p>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email=${encodeURIComponent(to)}" class="unsubscribe">Unsubscribe</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail({ to, subject, html });
}

// Send welcome email for newsletter subscription
export async function sendWelcomeNewsletter({ to, name }) {
  return await sendNewsletter({
    to,
    subject: 'Welcome to My Newsletter!',
    content: `
      <p>Hi ${name || 'there'}!</p>
      <p>Thank you for subscribing to my newsletter. I'm excited to share my latest projects, blog posts, and development insights with you.</p>
      <p>You'll receive updates about:</p>
      <ul>
        <li>New projects I've built</li>
        <li>Latest blog posts and tutorials</li>
        <li>Development tips and resources</li>
        <li>Occasional special announcements</li>
      </ul>
      <p>I promise not to spam you, and you can unsubscribe at any time.</p>
      <p>Best regards,<br>John Doe</p>
    `,
  });
}