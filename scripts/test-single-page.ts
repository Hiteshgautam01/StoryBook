/**
 * Test script to generate a single page (e.g., page 13)
 * Useful for quickly testing improvements without generating all 22 pages
 */

const CHILD_NAME = "محمد"; // Replace with your test name
const CHILD_PHOTO_URL = "YOUR_PHOTO_URL_HERE"; // Replace with actual photo URL
const PAGE_TO_TEST = 13; // The page you want to test

async function testSinglePage() {
  console.log(`Testing page ${PAGE_TO_TEST} generation...\n`);
  console.log(`Child name: ${CHILD_NAME}`);
  console.log(`Photo URL: ${CHILD_PHOTO_URL.substring(0, 50)}...\n`);

  try {
    const response = await fetch("http://localhost:3000/api/generate-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childName: CHILD_NAME,
        childPhotoUrl: CHILD_PHOTO_URL,
        pageNumbers: [PAGE_TO_TEST], // Generate only this page
      }),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    console.log("Starting to receive page generation updates...\n");

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response stream");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = JSON.parse(line.slice(6));

          switch (data.type) {
            case "start":
              console.log(`📋 Starting: ${data.totalPages} page(s), ${data.pagesNeedingSwap} need face swap`);
              break;

            case "portraits_start":
              console.log(`\n🎨 Stage 1: Generating ${data.totalPoses} portraits...`);
              break;

            case "portrait_complete":
              console.log(`  ✓ ${data.pose} portrait complete (${data.completedCount}/${data.totalPoses})`);
              break;

            case "portraits_complete":
              console.log(`\n✅ Stage 1 Complete: ${data.successCount}/${data.totalPoses} portraits in ${data.totalTime}ms\n`);
              break;

            case "page_start":
              console.log(`📄 Processing page ${data.pageNumber}...`);
              break;

            case "image":
              console.log(`  ✓ Page ${data.pageNumber} complete using ${data.method}`);
              console.log(`  URL: ${data.imageUrl.substring(0, 80)}...`);
              break;

            case "complete":
              console.log(`\n🎉 Generation Complete!`);
              console.log(`   Total time: ${data.totalTime}ms`);
              console.log(`   Portrait time: ${data.portraitTime}ms`);
              console.log(`   Page time: ${data.pageTime}ms`);
              console.log(`   Success: ${data.successCount}/${data.totalPages}`);
              console.log(`   Methods:`, data.methodBreakdown);
              break;

            case "error":
              console.error(`❌ Error on page ${data.pageNumber || 'unknown'}:`, data.message);
              break;
          }
        }
      }
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testSinglePage().catch(console.error);
