// app/api/contact/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();
    
    // Save to database
    const contact = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });
    
    // Send email notification
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background: #f9f9f9; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #555; }
              .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>New Contact Message</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name:</div>
                  <div>${name}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div>${email}</div>
                </div>
                <div class="field">
                  <div class="label">Subject:</div>
                  <div>${subject}</div>
                </div>
                <div class="field">
                  <div class="label">Message:</div>
                  <div>${message}</div>
                </div>
              </div>
              <div class="footer">
                <p>Sent from your portfolio website</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      
      // Send auto-reply
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Thank you for contacting me!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #8b5cf6, #ec4899); color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Thank You for Reaching Out!</h2>
              </div>
              <div class="content">
                <p>Dear ${name},</p>
                <p>Thank you for contacting me. I have received your message and will get back to you within 24-48 hours.</p>
                <p>In the meantime, feel free to:</p>
                <ul>
                  <li>Check out my latest projects on <a href="https://github.com/yourusername">GitHub</a></li>
                  <li>Connect with me on <a href="https://linkedin.com/in/yourusername">LinkedIn</a></li>
                  <li>Read my latest <a href="https://yourportfolio.com/blog">blog posts</a></li>
                </ul>
                <p>Best regards,<br>John Doe</p>
              </div>
              <div class="footer">
                <p>© 2024 John Doe. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.log('Email not configured, message saved to database only');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}