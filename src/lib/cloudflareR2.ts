import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'ira-lifestyle';
const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || '';

let r2Client: S3Client | null = null;

if (accountId && accessKeyId && secretAccessKey) {
  r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function uploadToStorage(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<{ url: string; provider: 'cloudflare' | 'local' }> {
  const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  // If Cloudflare R2 credentials are valid, upload to R2
  if (r2Client) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `products/${safeName}`,
        Body: fileBuffer,
        ContentType: contentType,
      });

      await r2Client.send(command);

      const fileUrl = publicUrl
        ? `${publicUrl.replace(/\/$/, '')}/products/${safeName}`
        : `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/products/${safeName}`;

      return { url: fileUrl, provider: 'cloudflare' };
    } catch (error) {
      console.warn('Cloudflare R2 upload encountered an error, falling back to local:', error);
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
    return { url: `/uploads/${safeName}`, provider: 'local' };
  } catch (err) {
    console.error('Local upload fallback failed:', err);
    throw new Error('Failed to store uploaded file');
  }
}
