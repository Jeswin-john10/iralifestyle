import { NextResponse } from 'next/server';
import { uploadToStorage } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Check if multiple files were uploaded
    const allFiles = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;
    
    const filesToProcess: File[] = [];
    if (allFiles && allFiles.length > 0 && allFiles[0].size > 0) {
      filesToProcess.push(...allFiles);
    } else if (singleFile && singleFile.size > 0) {
      filesToProcess.push(singleFile);
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json({ success: false, message: 'No valid file provided for upload' }, { status: 400 });
    }

    const uploadedResults = [];

    for (const file of filesToProcess) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await uploadToStorage(buffer, file.name, file.type || 'image/jpeg');
      uploadedResults.push({
        url: result.url,
        publicId: result.publicId,
        provider: result.provider,
        filename: file.name,
      });
    }

    // Single file response for backward compatibility
    if (uploadedResults.length === 1) {
      return NextResponse.json({
        success: true,
        url: uploadedResults[0].url,
        publicId: uploadedResults[0].publicId,
        provider: uploadedResults[0].provider,
        filename: uploadedResults[0].filename,
      });
    }

    // Multiple files response
    return NextResponse.json({
      success: true,
      files: uploadedResults,
      urls: uploadedResults.map(r => r.url),
      provider: uploadedResults[0]?.provider || 'cloudinary',
    });
  } catch (error) {
    console.error('Upload API route error:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message || 'Image upload processing failed' 
    }, { status: 500 });
  }
}
