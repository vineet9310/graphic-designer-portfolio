import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please enter both email and password' },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'designer@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'StrongPassword123';

    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password using bcrypt
    let isMatch = false;
    try {
      if (adminPassword.startsWith('$2a$') || adminPassword.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, adminPassword);
      } else {
        // Create a temporary hash of the plain-text credentials to compare against using bcrypt
        const tempHash = await bcrypt.hash(adminPassword, 10);
        isMatch = await bcrypt.compare(password, tempHash);
      }
    } catch (err) {
      console.error('Bcrypt comparison error:', err.message);
      isMatch = false;
    }

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: adminEmail },
      process.env.JWT_SECRET || 'super_secret_designer_portfolio_key_987654321',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return NextResponse.json({
      success: true,
      data: {
        email: adminEmail,
        token
      }
    });
  } catch (error) {
    console.error('Login API Error:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}
