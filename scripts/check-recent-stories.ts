/**
 * Check recent personalized story pages in Supabase storage
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const STORAGE_BUCKET = 'lubab-images';

async function checkRecentStories() {
  console.log('Checking recent personalized story pages...\n');

  try {
    // List files in the personalized-stories folder
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('personalized-stories', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('Error listing files:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('No personalized stories found in storage.');
      return;
    }

    console.log(`Found ${data.length} personalized story pages:\n`);

    // Group by timestamp (files are named: timestamp-page-X.png)
    const storiesByTimestamp = new Map<string, any[]>();

    data.forEach(file => {
      const match = file.name.match(/^(\d+)-page-(\d+)\.png$/);
      if (match) {
        const timestamp = match[1];
        const pageNum = parseInt(match[2]);

        if (!storiesByTimestamp.has(timestamp)) {
          storiesByTimestamp.set(timestamp, []);
        }

        storiesByTimestamp.get(timestamp)!.push({
          pageNum,
          file: file.name,
          size: file.metadata?.size,
          created: file.created_at,
        });
      }
    });

    // Display stories grouped by generation
    const timestamps = Array.from(storiesByTimestamp.keys()).sort().reverse();

    console.log(`Found ${timestamps.length} story generation sessions:\n`);

    timestamps.slice(0, 5).forEach((timestamp, index) => {
      const pages = storiesByTimestamp.get(timestamp)!.sort((a, b) => a.pageNum - b.pageNum);
      const date = new Date(parseInt(timestamp));

      console.log(`\n${'='.repeat(60)}`);
      console.log(`Story #${index + 1} - Generated at: ${date.toLocaleString()}`);
      console.log(`Timestamp: ${timestamp}`);
      console.log(`Total pages: ${pages.length}`);
      console.log(`${'='.repeat(60)}\n`);

      // Check which pages were generated
      const pageNumbers = pages.map(p => p.pageNum);
      const missingPages: number[] = [];

      for (let i = 1; i <= 22; i++) {
        if (!pageNumbers.includes(i)) {
          missingPages.push(i);
        }
      }

      console.log('Pages generated:');
      pages.forEach(page => {
        const sizeKB = page.size ? (page.size / 1024).toFixed(1) : 'unknown';
        console.log(`  ✓ Page ${page.pageNum}: ${page.file} (${sizeKB} KB)`);
      });

      if (missingPages.length > 0) {
        console.log(`\n❌ Missing pages: ${missingPages.join(', ')}`);

        // Highlight if pages 19-22 are missing
        const missing19to22 = missingPages.filter(p => p >= 19 && p <= 22);
        if (missing19to22.length > 0) {
          console.log(`   ⚠️  Pages 19-22 missing: ${missing19to22.join(', ')}`);
        }
      } else {
        console.log('\n✓ All 22 pages generated successfully!');
      }

      // Get public URLs for pages 19-22
      const pages19to22 = pages.filter(p => p.pageNum >= 19 && p.pageNum <= 22);
      if (pages19to22.length > 0) {
        console.log('\nPages 19-22 URLs:');
        pages19to22.forEach(page => {
          const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(`personalized-stories/${page.file}`);
          console.log(`  Page ${page.pageNum}: ${urlData.publicUrl}`);
        });
      }
    });

    // Summary of most recent generation
    if (timestamps.length > 0) {
      const mostRecent = timestamps[0];
      const pages = storiesByTimestamp.get(mostRecent)!;
      const pages19to22 = pages.filter(p => p.pageNum >= 19 && p.pageNum <= 22);

      console.log('\n' + '='.repeat(60));
      console.log('MOST RECENT GENERATION SUMMARY:');
      console.log('='.repeat(60));
      console.log(`Total pages: ${pages.length}/22`);
      console.log(`Pages 19-22: ${pages19to22.length}/4 saved`);

      if (pages19to22.length === 4) {
        console.log('✓ All pages 19-22 were successfully saved!');
      } else {
        const missing = [19, 20, 21, 22].filter(n => !pages.some(p => p.pageNum === n));
        console.log(`❌ Missing pages from 19-22: ${missing.join(', ')}`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

checkRecentStories().catch(console.error);
