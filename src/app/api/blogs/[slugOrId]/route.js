import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// GET a single blog by slug or ID (Public / Admin)
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slugOrId } = await params;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      query = { _id: slugOrId };
    } else {
      query = { slug: slugOrId };
    }

    const blog = await Blog.findOne(query);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('GET single blog API error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Server error loading blog post' },
      { status: 500 }
    );
  }
}

// PUT update a blog post (Admin only)
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { slugOrId } = await params;

    // Admin Auth check
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Not authorized, admin verification failed' },
        { status: 401 }
      );
    }

    let query = {};
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      query = { _id: slugOrId };
    } else {
      query = { slug: slugOrId };
    }

    const body = await req.json();
    
    // We update fields directly
    const blog = await Blog.findOneAndUpdate(
      query,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('PUT blog API error:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error updating blog post' },
      { status: 500 }
    );
  }
}

// DELETE a blog post (Admin only)
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { slugOrId } = await params;

    // Admin Auth check
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Not authorized, admin verification failed' },
        { status: 401 }
      );
    }

    let query = {};
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      query = { _id: slugOrId };
    } else {
      query = { slug: slugOrId };
    }

    const blog = await Blog.findOneAndDelete(query);

    if (!blog) {
      return NextResponse.json(
        { success: false, message: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('DELETE blog API error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Server error deleting blog post' },
      { status: 500 }
    );
  }
}
