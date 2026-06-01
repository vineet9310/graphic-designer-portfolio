import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary if credentials are set
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
  process.env.CLOUDINARY_API_SECRET && 
  process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// GET all projects
export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('GET projects API error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Server error loading projects' },
      { status: 500 }
    );
  }
}

// POST new project (Admin only)
export async function POST(req) {
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

    // Parse form data
    const formData = await req.formData();
    const title = formData.get('title');
    const category = formData.get('category');
    const description = formData.get('description');
    const toolsStr = formData.get('tools');
    const featuredStr = formData.get('featured');
    const orderStr = formData.get('order');

    if (!title || !description || !category) {
      return NextResponse.json(
        { success: false, message: 'Please include all required fields: title, description, category' },
        { status: 400 }
      );
    }

    // Process tools
    let parsedTools = [];
    if (toolsStr) {
      try {
        parsedTools = JSON.parse(toolsStr);
      } catch (e) {
        parsedTools = toolsStr.split(',').map(t => t.trim()).filter(t => t);
      }
    }

    // Process image uploads
    const files = formData.getAll('images');
    let images = [];

    for (const file of files) {
      if (!file || typeof file === 'string') continue;
      
      if (isCloudinaryConfigured) {
        // Upload to Cloudinary
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
        
        console.log(`Uploading ${file.name} to Cloudinary...`);
        const result = await cloudinary.uploader.upload(base64Image, {
          folder: 'designer-portfolio/projects',
          transformation: [{ width: 1200, crop: 'limit', quality: 85 }]
        });
        images.push(result.secure_url);
      } else {
        // Local upload fallback
        const localUploadsDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(localUploadsDir)) {
          fs.mkdirSync(localUploadsDir, { recursive: true });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `images-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.name || '.jpg')}`;
        const filepath = path.join(localUploadsDir, filename);
        
        console.log(`Saving ${file.name} locally to public/uploads...`);
        await fs.promises.writeFile(filepath, buffer);
        images.push(`/uploads/${filename}`);
      }
    }

    const coverImage = images.length > 0 ? images[0] : '';
    
    // Create Project
    const project = await Project.create({
      title,
      description,
      category,
      tools: parsedTools,
      images,
      coverImage,
      featured: featuredStr === 'true' || featuredStr === true,
      order: Number(orderStr) || 0
    });

    return NextResponse.json({
      success: true,
      data: project
    }, { status: 201 });

  } catch (error) {
    console.error('POST project API error:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error creating project' },
      { status: 500 }
    );
  }
}
