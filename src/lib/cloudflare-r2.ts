import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'iralifestyle';
const publicDomain = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN;

let s3Client: S3Client | null = null;

if (accountId && accessKeyId && secretAccessKey) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Upload an image file buffer to Cloudflare R2.
 * If credentials are not set, smoothly falls back to local storage in /public/uploads/
 */
export async function uploadFileToStorage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<{ url: string; provider: 'cloudflare-r2' | 'local' }> {
  const sanitizedFileName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  // If Cloudflare R2 is configured, upload to R2
  if (s3Client && bucketName) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `products/${sanitizedFileName}`,
        Body: fileBuffer,
        ContentType: contentType,
      });

      await s3Client.send(command);

      const url = publicDomain
        ? `${publicDomain.replace(/\/$/, '')}/products/${sanitizedFileName}`
        : `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/products/${sanitizedFileName}`;

      return { url, provider: 'cloudflare-r2' };
    } catch (error) {
      console.warn('Cloudflare R2 upload error, falling back to local storage:', error);
    }
  }

  // Local fallback: save to public/uploads
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, sanitizedFileName);
  fs.writeFileSync(filePath, fileBuffer);

  return {
    url: `/uploads/${sanitizedFileName}`,
    provider: 'local',
  };
}
