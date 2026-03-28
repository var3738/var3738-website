import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUDE_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary configuration is missing.' }, { status: 500 });
    }

    // Convert file to base64 for Cloudinary REST API
    const defaultBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(defaultBuffer).toString('base64');
    const fileUri = `data:${file.type};base64,${base64Data}`;

    // Cloudinary expects a signature for secure uploads without an upload preset.
    // However, we can use the unsigned upload if we create an upload preset.
    // Since we have the API_SECRET and want to keep it simple without relying on the crypto module to sign it manually,
    // we can use the official Cloudinary approach via HTTP:
    // Actually, uploading base64 via signed POST requires sha1 hashing.
    // Let's implement the sha1 string generator:
    
    const timestamp = Math.round((new Date()).getTime() / 1000).toString();
    const strToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    
    // We will use standard crypto built into NextJS edge/node runtime
    const crypto = await import('crypto');
    const signature = crypto.createHash('sha1').update(strToSign).digest('hex');

    const cloudFormData = new FormData();
    cloudFormData.append('file', fileUri);
    cloudFormData.append('folder', folder);
    cloudFormData.append('api_key', apiKey);
    cloudFormData.append('timestamp', timestamp);
    cloudFormData.append('signature', signature);

    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: cloudFormData,
    });

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
      throw new Error(uploadData.error?.message || 'Failed to upload to Cloudinary');
    }

    return NextResponse.json({ url: uploadData.secure_url }, { status: 200 });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
