import connectDB from '@/lib/db';
import Contact from '@/models/Contact';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // Auth check
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Not authorized, admin verification failed' },
        { status: 401 }
      );
    }

    const message = await Contact.findById(id);
    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      );
    }

    message.isRead = true;
    const updatedMessage = await message.save();

    return NextResponse.json({
      success: true,
      data: updatedMessage
    });
  } catch (error) {
    console.error('PUT mark message read API error:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error updating message status' },
      { status: 500 }
    );
  }
}
