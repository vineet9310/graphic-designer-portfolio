import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({ featured: true }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('GET featured projects API error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Server error loading featured projects' },
      { status: 500 }
    );
  }
}
