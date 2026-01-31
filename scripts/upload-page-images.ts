/**
 * Upload all page images to Supabase storage
 *
 * This ensures FAL API can access the images via public URLs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'present' : 'missing');
  console.error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY:', process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? 'present' : 'missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'present' : 'missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const STORAGE_BUCKET = 'lubab-images';

async function uploadPageImages() {
  const pagesDir = path.join(process.cwd(), 'public', 'pagesimages');
  const files = fs.readdirSync(pagesDir);
  const pageFiles = files.filter(f => f.startsWith('page-') && f.endsWith('.png'));

  console.log(`Found ${pageFiles.length} page images to upload`);

  for (const filename of pageFiles) {
    const filePath = path.join(pagesDir, filename);
    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = `pagesimages/${filename}`;

    console.log(`Uploading ${filename}...`);

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (error) {
      console.error(`Error uploading ${filename}:`, error);
      continue;
    }

    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    console.log(`✓ ${filename} -> ${urlData.publicUrl}`);
  }

  console.log('\nAll page images uploaded successfully!');
}

uploadPageImages().catch(console.error);
