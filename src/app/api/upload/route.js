import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

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

const uploadToLocal = async (file) => {
  const localUploadsDir = path.join(process.cwd(), 'public/uploads');
  if (!fs.existsSync(localUploadsDir)) {
    fs.mkdirSync(localUploadsDir, { recursive: true });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const prefix = file.type === 'application/pdf' ? 'document' : 'portrait';
  const filename = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.name || '.jpg')}`;
  const filepath = path.join(localUploadsDir, filename);
  await fs.promises.writeFile(filepath, buffer);
  return `/uploads/${filename}`;
};

const uploadToCloudinary = async (file) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  
  return new Promise((resolve, reject) => {
    const options = {
      folder: 'designer-portfolio/settings'
    };

    if (file.type === 'application/pdf') {
      options.resource_type = 'image'; // PDF is uploaded as 'image' resource type in Cloudinary so it serves as application/pdf
      options.format = 'pdf';
      const originalName = file.name || 'resume.pdf';
      const cleanName = path.parse(originalName).name.replace(/[^a-zA-Z0-9-_]/g, '_');
      options.public_id = `${cleanName}-${Date.now()}`;
    } else {
      options.transformation = [{ width: 800, crop: 'limit', quality: 85 }];
    }

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result.secure_url);
    });

    uploadStream.end(buffer);
  });
};

export async function POST(req) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    let url;

    if (isCloudinaryConfigured) {
      try {
        url = await uploadToCloudinary(file);
      } catch (cloudinaryError) {
        console.warn('Cloudinary upload failed, falling back to local storage:', cloudinaryError.message);
        url = await uploadToLocal(file);
      }
    } else {
      url = await uploadToLocal(file);
    }

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Upload API error:', error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
