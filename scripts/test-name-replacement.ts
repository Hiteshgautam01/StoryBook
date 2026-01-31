/**
 * Test script to verify Arabic name replacement works correctly
 */

import { personalizeArabicText, STORY_PAGES } from '../lib/prompts/story-pages';

console.log('Testing Arabic name personalization...\n');

// Test cases
const testCases = [
  { name: 'محمد', desc: 'Arabic name' },
  { name: 'Ahmed', desc: 'English name' },
  { name: 'سارة', desc: 'Arabic girl name' },
  { name: 'عمر', desc: 'Short Arabic name' },
  { name: '  علي  ', desc: 'Name with spaces (should be trimmed)' },
];

// Test the function with sample text
const sampleText = 'كان فيصل يقف عند نافذته… قال الصقر: "يا فيصل، انظر!"';
console.log(`Original text: ${sampleText}\n`);

testCases.forEach(({ name, desc }) => {
  const result = personalizeArabicText(sampleText, name);
  const containsFaisal = result.includes('فيصل');
  const success = !containsFaisal || name === 'فيصل';

  console.log(`✓ Test: ${desc}`);
  console.log(`  Input name: "${name}"`);
  console.log(`  Result: ${result}`);
  console.log(`  Contains "فيصل": ${containsFaisal ? 'YES ❌' : 'NO ✓'}`);
  console.log(`  Status: ${success ? 'PASS ✓' : 'FAIL ❌'}\n`);
});

// Test with actual story pages
console.log('Testing with actual story pages that contain فيصل:\n');

const pagesWithName = STORY_PAGES.filter(p => p.arabicText.includes('فيصل'));
console.log(`Found ${pagesWithName.length} pages containing "فيصل":`);

pagesWithName.forEach(page => {
  console.log(`  - Page ${page.pageNumber}: "${page.arabicText.substring(0, 50)}..."`);
});

// Test personalization on actual pages
console.log('\nTesting personalization on page 1:');
const testName = 'محمد';
const page1 = STORY_PAGES[0];
const original = page1.arabicText;
const personalized = personalizeArabicText(original, testName);

console.log(`Original: ${original}`);
console.log(`Personalized with "${testName}": ${personalized}`);
console.log(`Success: ${!personalized.includes('فيصل') ? 'YES ✓' : 'NO ❌'}`);
