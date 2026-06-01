import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { idOrSlug } = await params;

    // Auth check
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Not authorized, admin verification failed' },
        { status: 401 }
      );
    }

    const project = await Project.findById(idOrSlug);
    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    project.featured = !project.featured;
    const updatedProject = await project.save();

    return NextResponse.json({
      success: true,
      data: updatedProject
    });
  } catch (error) {
    console.error('PUT featured toggle API error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Server error toggling featured status' },
      { status: 500 }
    );
  }
}
