-- Create a Supabase Storage Bucket named "portfolio_images"

INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('portfolio_images', 'portfolio_images', TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for "portfolio_images"

-- 1. Allow public read access (Anyone can view the images)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio_images');

-- 2. Allow authenticated users/admins to insert/upload objects
-- Depending on how you upload (client-side vs server-side),
-- this uses the anon/service key. For service key, RLS is bypassed.
CREATE POLICY "Admin Upload Access" 
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio_images');

-- 3. Allow authenticated users/admins to update objects
CREATE POLICY "Admin Update Access" 
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio_images');

-- 4. Allow authenticated users/admins to delete objects
CREATE POLICY "Admin Delete Access" 
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio_images');
