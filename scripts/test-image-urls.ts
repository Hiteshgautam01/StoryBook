/**
 * Test that page images are accessible via public URLs
 */

import { getPageImageUrl } from '../lib/prompts/story-pages';

async function testImageUrls() {
  console.log('Testing page image URLs...\n');

  // Test first 3 pages
  for (let i = 1; i <= 3; i++) {
    const url = getPageImageUrl(i);
    console.log(`Page ${i}: ${url}`);

    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        console.log(`  ✓ Accessible (${response.status})`);
      } else {
        console.log(`  ✗ Not accessible (${response.status})`);
      }
    } catch (error) {
      console.log(`  ✗ Error:`, error instanceof Error ? error.message : error);
    }
    console.log('');
  }
}

testImageUrls().catch(console.error);
