import connectDB from '@/lib/db';
import Blog from '@/models/Blog';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

// GET all blogs (Public / Admin)
export async function GET(req) {
  try {
    await connectDB();
    
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const limitStr = searchParams.get('limit');
    const featuredStr = searchParams.get('featured');
    const category = searchParams.get('category');
    const adminMode = searchParams.get('adminMode') === 'true';
    
    // Build query
    const query = {};
    
    if (adminMode) {
      // Authenticate admin to allow viewing drafts
      const admin = await verifyAdmin(req);
      if (!admin) {
        return NextResponse.json(
          { success: false, message: 'Not authorized for admin mode' },
          { status: 401 }
        );
      }
    } else {
      // Public only gets published blogs
      query.published = true;
    }

    if (featuredStr === 'true') {
      query.featured = true;
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    let blogsQuery = Blog.find(query).sort({ createdAt: -1 });

    if (limitStr) {
      const limit = parseInt(limitStr, 10);
      if (!isNaN(limit)) {
        blogsQuery = blogsQuery.limit(limit);
      }
    }

    const blogs = await blogsQuery.exec();

    return NextResponse.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    console.error('GET blogs API error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Server error loading blogs' },
      { status: 500 }
    );
  }
}

// POST a new blog post (Admin only)
export async function POST(req) {
  try {
    await connectDB();

    // Admin Auth check
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Not authorized, admin verification failed' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, content, excerpt, category, tags, coverImage, readingTime, featured, published } = body;

    if (!title || !content || !excerpt || !category) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: title, content, excerpt, category' },
        { status: 400 }
      );
    }

    const blog = await Blog.create({
      title,
      content,
      excerpt,
      category,
      tags: tags || [],
      coverImage: coverImage || undefined,
      readingTime: readingTime || undefined,
      featured: featured === true,
      published: published !== false
    });

    return NextResponse.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('POST blog API error:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error creating blog post' },
      { status: 500 }
    );
  }
}
