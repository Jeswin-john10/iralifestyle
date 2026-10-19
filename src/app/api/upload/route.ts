import { NextResponse } from 'next/server';
import { uploadToStorage } from '@/lib/cloudflareR2';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadToStorage(buffer, file.name, file.type || 'image/jpeg');

    return NextResponse.json({
      success: true,
      url: result.url,
      provider: result.provider,
      filename: file.name,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
