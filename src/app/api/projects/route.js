import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cloudinary, isCloudinaryConfigured, uploadToLocal } from '@/lib/cloudinary';

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

    // Process hero image upload
    let coverImage = '';
    const heroFile = formData.get('heroImage');
    if (heroFile && typeof heroFile !== 'string') {
      if (isCloudinaryConfigured) {
        const buffer = Buffer.from(await heroFile.arrayBuffer());
        const base64Image = `data:${heroFile.type};base64,${buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(base64Image, {
          folder: 'designer-portfolio/projects',
          transformation: [{ width: 1200, crop: 'limit', quality: 85 }]
        });
        coverImage = result.secure_url;
      } else {
        coverImage = await uploadToLocal(heroFile, 'hero');
      }
    }

    // Process image uploads
    const metadataStr = formData.get('imagesMetadata');
    let images = [];

    if (metadataStr) {
      let metadata = [];
      try {
        metadata = JSON.parse(metadataStr);
      } catch (e) {
        console.error('Error parsing imagesMetadata:', e);
      }

      for (const item of metadata) {
        if (item.type === 'existing') {
          images.push({
            url: item.url,
            title: item.title || '',
            description: item.description || ''
          });
        } else if (item.type === 'new') {
          const file = formData.get(item.fileKey);
          if (file && typeof file !== 'string') {
            let imageUrl = '';
            if (isCloudinaryConfigured) {
              const buffer = Buffer.from(await file.arrayBuffer());
              const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
              const result = await cloudinary.uploader.upload(base64Image, {
                folder: 'designer-portfolio/projects',
                transformation: [{ width: 1200, crop: 'limit', quality: 85 }]
              });
              imageUrl = result.secure_url;
            } else {
              imageUrl = await uploadToLocal(file, 'images');
            }
            images.push({
              url: imageUrl,
              title: item.title || '',
              description: item.description || ''
            });
          }
        }
      }
    } else {
      // Fallback if no metadata is sent
      const files = formData.getAll('images');
      for (const file of files) {
        if (!file || typeof file === 'string') continue;
        
        let imageUrl = '';
        if (isCloudinaryConfigured) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
          const result = await cloudinary.uploader.upload(base64Image, {
            folder: 'designer-portfolio/projects',
            transformation: [{ width: 1200, crop: 'limit', quality: 85 }]
          });
          imageUrl = result.secure_url;
        } else {
          imageUrl = await uploadToLocal(file, 'images');
        }
        images.push({
          url: imageUrl,
          title: '',
          description: ''
        });
      }
    }
    
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
