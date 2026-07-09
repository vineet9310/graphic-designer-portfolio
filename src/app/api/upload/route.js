import { verifyAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cloudinary, isCloudinaryConfigured, uploadToLocal } from '@/lib/cloudinary';
import path from 'path';

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
      url = await uploadToCloudinary(file);
    } else {
      const prefix = file.type === 'application/pdf' ? 'document' : 'portrait';
      url = await uploadToLocal(file, prefix);
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
