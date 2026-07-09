import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

export const isCloudinaryConfigured =
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

export { cloudinary };

/**
 * Handles errors during local writes, throwing a descriptive message if the filesystem is read-only.
 * @param {Error} error The original error
 */
export function handleLocalUploadError(error) {
  const message = error.message || '';
  if (error.code === 'EROFS' || message.includes('EROFS') || message.includes('read-only')) {
    throw new Error(
      'Upload failed: The server environment has a read-only file system (e.g., Vercel). ' +
      'To enable uploads, you must configure Cloudinary in your environment variables ' +
      '(CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).'
    );
  }
  throw error;
}

/**
 * Uploads a file to local disk (fallback), handling write errors.
 * @param {File} file The file to upload
 * @param {string} prefix The prefix for the filename
 * @returns {Promise<string>} The local file URL path
 */
export async function uploadToLocal(file, prefix = 'file') {
  try {
    const localUploadsDir = path.join(process.cwd(), 'public/uploads');
    if (!fs.existsSync(localUploadsDir)) {
      fs.mkdirSync(localUploadsDir, { recursive: true });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.name || '.jpg')}`;
    const filepath = path.join(localUploadsDir, filename);
    await fs.promises.writeFile(filepath, buffer);
    return `/uploads/${filename}`;
  } catch (error) {
    handleLocalUploadError(error);
  }
}
