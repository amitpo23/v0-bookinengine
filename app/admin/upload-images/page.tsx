'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UploadImagesPage() {
  const [hotelId, setHotelId] = useState('scarlet-hotel');
  const [roomType, setRoomType] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('אנא בחר קבצים להעלאה');
      return;
    }

    setUploading(true);
    setError('');
    const urls: string[] = [];

    try {
      for (const file of selectedFiles) {
        // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${hotelId}/${roomType || 'general'}/${fileName}`;

      // Upload directly to Supabase Storage
      const { data, error } = await supabase.storage
        .from('hotel-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(error.message || 'שגיאה בהעלאת קובץ');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('hotel-assets')
        .getPublicUrl(filePath);

      urls.push(publicUrl);
      }

      setUploadedUrls(urls);
      setSelectedFiles([]);
    } catch (err: any) {
      setError(err.message || 'שגיאה בהעלאת התמונות');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>העלאת תמונות חדרים</CardTitle>
          <CardDescription>
            העלה תמונות של חדרים למלון שיישמרו ב-Supabase Storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hotelId">מזהה מלון</Label>
            <Input
              id="hotelId"
              value={hotelId}
              onChange={(e) => setHotelId(e.target.value)}
              placeholder="scarlet-hotel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomType">סוג חדר</Label>
            <Input
              id="roomType"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              placeholder="deluxe-suite, standard-room, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="files">תמונות</Label>
            <Input
              id="files"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
            {selectedFiles.length > 0 && (
              <p className="text-sm text-gray-600">
                נבחרו {selectedFiles.length} קבצים
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="w-full"
          >
            {uploading ? 'מעלה...' : 'העלה תמונות'}
          </Button>

          {uploadedUrls.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">תמונות שהועלו בהצלחה:</h3>
              <div className="space-y-2">
                {uploadedUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <img
                      src={url}
                      alt={`Uploaded ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {url}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
