import cloudinaryPkg from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const cloudinary = cloudinaryPkg.v2;

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'b42ux0eb';
  const apiKey = process.env.CLOUDINARY_API_KEY || '797866542691347';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || 'Ch4eyFY6_qahUwkebSWGG_s6sRM';

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName.trim(),
      api_key: apiKey.trim(),
      api_secret: apiSecret.trim(),
      secure: true,
    });
    return true;
  }
  return false;
}

export interface UploadResult {
  url: string;
  publicId?: string;
  provider: 'cloudinary' | 'local';
  format?: string;
  bytes?: number;
}

/**
 * Upload an image buffer to Cloudinary (with fallback to local public/uploads)
 */
export async function uploadToStorage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string = 'image/jpeg',
  folder: string = 'iralifestyle/products'
): Promise<UploadResult> {
  const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const isReady = configureCloudinary();

  if (isReady) {
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            use_filename: true,
            unique_filename: true,
            overwrite: false,
          },
          (error, res) => {
            if (error || !res) {
              return reject(error || new Error('Cloudinary upload returned empty response'));
            }
            resolve(res);
          }
        );
        stream.end(fileBuffer);
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        provider: 'cloudinary',
        format: result.format,
        bytes: result.bytes,
      };
    } catch (error) {
      console.warn('Cloudinary upload failed, falling back to local storage:', error);
    }
  }

  // Fallback to local storage in /public/uploads
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, safeName);
    fs.writeFileSync(filePath, fileBuffer);
    return {
      url: `/uploads/${safeName}`,
      provider: 'local',
    };
  } catch (err) {
    console.error('Local upload fallback failed:', err);
    throw new Error('Failed to store uploaded file');
  }
}

/**
 * Delete an image by public_id from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  const isReady = configureCloudinary();
  if (!isReady || !publicId) return false;
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === 'ok';
  } catch (err) {
    console.warn('Failed to delete from Cloudinary:', err);
    return false;
  }
}

export { cloudinary };
