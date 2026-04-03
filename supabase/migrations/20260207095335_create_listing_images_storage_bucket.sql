-- Create Listing Images Storage Bucket
-- Creates bucket for storing listing photos with public access
-- Adds RLS policies for upload, read, and delete operations

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-images',
  'listing-images',
  true,
  12582912,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

CREATE POLICY "Authenticated users can upload listing images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'listing-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view listing images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'listing-images');

CREATE POLICY "Users can delete their own listing images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'listing-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);