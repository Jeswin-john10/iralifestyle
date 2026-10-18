import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToStorage } from '@/lib/cloudflare-r2';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadFileToStorage(buffer, file.name, file.type || 'image/jpeg');

    return NextResponse.json({
      success: true,
      url: result.url,
      provider: result.provider,
      filename: file.name,
      message: result.provider === 'cloudflare-r2' ? 'Uploaded to Cloudflare R2' : 'Uploaded locally',
    });
  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
