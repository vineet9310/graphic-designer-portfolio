import connectDB from '@/lib/db';
import Contact from '@/models/Contact';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Helper to send email notification to designer
const sendEmailNotification = async (contact) => {
  const isEmailConfigured =
    process.env.EMAIL_USER &&
    process.env.EMAIL_USER !== 'your_gmail@gmail.com' &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_PASS !== 'your_gmail_app_password';

  if (!isEmailConfigured) {
    console.log('Nodemailer credentials not fully configured. Logging email to console:');
    console.log('================ CONTACT MESSAGE ===============');
    console.log(`From: ${contact.name} (${contact.email})`);
    console.log(`Subject: ${contact.subject}`);
    console.log(`Message: ${contact.message}`);
    console.log('================================================');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"${contact.name}" <${process.env.EMAIL_USER}>`, // Send on behalf of user
      to: process.env.ADMIN_EMAIL || 'designer@example.com', // Admin receives it
      replyTo: contact.email,
      subject: `Portfolio Contact: ${contact.subject || 'No Subject'}`,
      html: `
        <h3>New Contact Message Received</h3>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Subject:</strong> ${contact.subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; padding: 10px; background-color: #f5f5f5; border-left: 4px solid #e63946;">${contact.message}</p>
        <br>
        <p>This message has been logged in your Portfolio Admin Panel.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email notification sent: ${info.messageId}`);
  } catch (error) {
    console.error('Nodemailer error: Failed to send email notification:', error.message);
  }
};

// GET all contact messages (Admin only)
export async function GET(req) {
  try {
    await connectDB();
    
    // Auth check
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Not authorized, admin verification failed' },
        { status: 401 }
      );
    }

    const messages = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('GET messages API error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Server error loading messages' },
      { status: 500 }
    );
  }
}

// POST submit contact form (Public)
export async function POST(req) {
  try {
    await connectDB();
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Please include all required fields: name, email, message' },
        { status: 400 }
      );
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    // Send email notification in background (non-blocking)
    sendEmailNotification(contact);

    return NextResponse.json({
      success: true,
      data: contact
    }, { status: 201 });

  } catch (error) {
    console.error('POST contact form API error:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error submitting form' },
      { status: 500 }
    );
  }
}
