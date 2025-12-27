import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const hotelId = formData.get('hotelId') as string;
    const roomType = formData.get('roomType') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!hotelId) {
      return NextResponse.json(
        { error: 'Hotel ID is required' },
        { status: 400 }
      );
    }

    // Convert file to ArrayBuffer (CRITICAL for proper upload)
    const bytes = await file.arrayBuffer();
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${hotelId}/${roomType || 'general'}/${Date.now()}.${fileExt}`;
    const filePath = `hotel-images/${fileName}`;

    // Upload to Supabase Storage with proper contentType
    const { data, error } = await supabaseAdmin.storage
      .from('hotel-assets')
      .upload(filePath, bytes, {
        contentType: file.type, // CRITICAL: Must specify contentType!
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json(
        { error: 'Failed to upload image', details: error.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('hotel-assets')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: filePath
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
