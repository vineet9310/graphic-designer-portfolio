import connectDB from '@/lib/db';
import Project from '@/models/Project';
import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
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

// Helper to delete image from storage (Cloudinary or local)
const deleteImageFromStorage = async (imageUrl) => {
  if (!imageUrl) return;

  if (isCloudinaryConfigured && imageUrl.includes('cloudinary.com')) {
    try {
      const parts = imageUrl.split('/');
      const uploadIndex = parts.indexOf('upload');
      if (uploadIndex !== -1) {
        // Skip 'upload' and version (e.g. 'v1234567')
        let publicIdParts = parts.slice(uploadIndex + 2);
        if (parts[uploadIndex + 1] && !parts[uploadIndex + 1].startsWith('v')) {
          publicIdParts = parts.slice(uploadIndex + 1);
        }
        const publicIdWithExt = publicIdParts.join('/');
        const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
        
        await cloudinary.uploader.destroy(publicId);
        console.log(`Successfully deleted Cloudinary image: ${publicId}`);
      }
    } catch (error) {
      console.error(`Failed to delete Cloudinary image: ${imageUrl}`, error.message);
    }
  } else {
    // If it's a local file, try to delete it
    try {
      if (imageUrl.includes('/uploads/')) {
        const filename = imageUrl.split('/uploads/')[1];
        const filepath = path.join(process.cwd(), 'public/uploads', filename);
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
          console.log(`Successfully deleted local image: ${filename}`);
        }
      }
    } catch (error) {
      console.error(`Failed to delete local file: ${imageUrl}`, error.message);
    }
  }
};

// GET single project
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { idOrSlug } = await params;
    
    let project = null;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);

    if (isValidObjectId) {
      project = await Project.findById(idOrSlug);
    } else {
      project = await Project.findOne({ slug: idOrSlug });
    }

    if (!project) {
      return NextResponse.json(
        { success: false, message: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('GET single project API error:', error.message);
    return NextResponse.json(
      { success: false, message: 'Server error loading project details' },
      { status: 500 }
    );
  }
}

// PUT update project (Admin only)
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

    // Parse form data
    const formData = await req.formData();
    const title = formData.get('title');
    const category = formData.get('category');
    const description = formData.get('description');
    const toolsStr = formData.get('tools');
    const featuredStr = formData.get('featured');
    const orderStr = formData.get('order');
    const metadataStr = formData.get('imagesMetadata');

    // Process hero image
    const heroFile = formData.get('heroImage');
    const existingHeroImage = formData.get('existingHeroImage');
    let coverImage = project.coverImage || '';

    if (heroFile && typeof heroFile !== 'string') {
      // Delete old cover image first
      if (project.coverImage) {
        await deleteImageFromStorage(project.coverImage);
      }
      
      // Upload new hero image
      if (isCloudinaryConfigured) {
        const buffer = Buffer.from(await heroFile.arrayBuffer());
        const base64Image = `data:${heroFile.type};base64,${buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(base64Image, {
          folder: 'designer-portfolio/projects',
          transformation: [{ width: 1200, crop: 'limit', quality: 85 }]
        });
        coverImage = result.secure_url;
      } else {
        const localUploadsDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(localUploadsDir)) {
          fs.mkdirSync(localUploadsDir, { recursive: true });
        }
        const buffer = Buffer.from(await heroFile.arrayBuffer());
        const filename = `hero-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(heroFile.name || '.jpg')}`;
        const filepath = path.join(localUploadsDir, filename);
        await fs.promises.writeFile(filepath, buffer);
        coverImage = `/uploads/${filename}`;
      }
    } else if (!existingHeroImage && !heroFile) {
      // Cover image was deleted
      if (project.coverImage) {
        await deleteImageFromStorage(project.coverImage);
      }
      coverImage = '';
    }

    let finalImages = [];
    
    if (metadataStr) {
      let metadata = [];
      try {
        metadata = JSON.parse(metadataStr);
      } catch (e) {
        console.error('Error parsing imagesMetadata in PUT:', e);
      }

      // 1. Identify which existing images are kept vs deleted.
      const keptUrls = metadata
        .filter(item => item.type === 'existing')
        .map(item => item.url);

      const originalUrls = project.images.map(img => typeof img === 'string' ? img : img.url);
      const imagesToDelete = originalUrls.filter(url => !keptUrls.includes(url));

      for (const imgUrl of imagesToDelete) {
        await deleteImageFromStorage(imgUrl);
      }

      // 2. Build finalImages in the specified order.
      for (const item of metadata) {
        if (item.type === 'existing') {
          finalImages.push({
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
              const localUploadsDir = path.join(process.cwd(), 'public/uploads');
              if (!fs.existsSync(localUploadsDir)) {
                fs.mkdirSync(localUploadsDir, { recursive: true });
              }
              const buffer = Buffer.from(await file.arrayBuffer());
              const filename = `images-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.name || '.jpg')}`;
              const filepath = path.join(localUploadsDir, filename);
              await fs.promises.writeFile(filepath, buffer);
              imageUrl = `/uploads/${filename}`;
            }
            finalImages.push({
              url: imageUrl,
              title: item.title || '',
              description: item.description || ''
            });
          }
        }
      }
    } else {
      // Fallback if no imagesMetadata is sent (old client behavior)
      const existingImagesStr = formData.get('existingImages');
      let keptImages = [];
      if (existingImagesStr) {
        try {
          keptImages = JSON.parse(existingImagesStr);
        } catch (e) {
          keptImages = [existingImagesStr];
        }
      }

      // Convert keptImages string URLs back to objects or keep them as is
      const originalUrls = project.images.map(img => typeof img === 'string' ? img : img.url);
      const imagesToDelete = originalUrls.filter(img => !keptImages.includes(img));
      for (const img of imagesToDelete) {
        await deleteImageFromStorage(img);
      }

      // Upload new files
      const files = formData.getAll('images');
      let newImages = [];
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
          const localUploadsDir = path.join(process.cwd(), 'public/uploads');
          if (!fs.existsSync(localUploadsDir)) {
            fs.mkdirSync(localUploadsDir, { recursive: true });
          }
          const buffer = Buffer.from(await file.arrayBuffer());
          const filename = `images-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.name || '.jpg')}`;
          const filepath = path.join(localUploadsDir, filename);
          await fs.promises.writeFile(filepath, buffer);
          imageUrl = `/uploads/${filename}`;
        }
        newImages.push({
          url: imageUrl,
          title: '',
          description: ''
        });
      }

      // Map kept images back to objects
      const mappedKeptImages = keptImages.map(url => {
        const matchingOriginal = project.images.find(img => (typeof img === 'string' ? img : img.url) === url);
        return {
          url: url,
          title: matchingOriginal && typeof matchingOriginal !== 'string' ? (matchingOriginal.title || '') : '',
          description: matchingOriginal && typeof matchingOriginal !== 'string' ? (matchingOriginal.description || '') : ''
        };
      });

      finalImages = [...mappedKeptImages, ...newImages];
    }

    // Parse tools
    let parsedTools = project.tools;
    if (toolsStr !== null) {
      try {
        parsedTools = JSON.parse(toolsStr);
      } catch (e) {
        parsedTools = toolsStr.split(',').map(t => t.trim()).filter(t => t);
      }
    }

    // Update fields
    project.title = title || project.title;
    project.description = description || project.description;
    project.category = category || project.category;
    project.tools = parsedTools;
    project.images = finalImages;
    project.coverImage = coverImage;
    
    if (featuredStr !== null) {
      project.featured = featuredStr === 'true' || featuredStr === true;
    }
    if (orderStr !== null) {
      project.order = Number(orderStr);
    }

    const updatedProject = await project.save();

    return NextResponse.json({
      success: true,
      data: updatedProject
    });

  } catch (error) {
    console.error('PUT project API error:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error updating project' },
      { status: 500 }
    );
  }
}

// DELETE project (Admin only)
export async function DELETE(req, { params }) {
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

    // Delete all images associated with this project
    for (const img of project.images) {
      await deleteImageFromStorage(typeof img === 'string' ? img : img.url);
    }

    await Project.deleteOne({ _id: idOrSlug });

    return NextResponse.json({
      success: true,
      message: 'Project and all associated images deleted'
    });

  } catch (error) {
    console.error('DELETE project API error:', error.message);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error deleting project' },
      { status: 500 }
    );
  }
}
