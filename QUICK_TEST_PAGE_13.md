# Quick Guide: Test Page 13 Only

Follow these steps to quickly test if the eye quality improvements fixed page 13:

## Step 1: Get Your Photo URL

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open the app**: http://localhost:3000

3. **Upload a child photo**:
   - Drag & drop or click to upload
   - Enter child's name (e.g., "محمد")
   - **Wait for upload to complete** (green checkmark appears)

4. **Copy the photo URL**:
   - Look below the uploaded photo
   - You'll see a text box with the URL
   - **Click the text box** - it will select all
   - **Copy the URL** (Ctrl+C or Cmd+C)

   OR

   - Open browser console (F12)
   - Look for: `📸 PHOTO URL: https://...`
   - Copy the URL

## Step 2: Test Page 13 in Browser Console

1. **Open browser console** (F12 or right-click → Inspect → Console)

2. **Paste this code** and update the values:

```javascript
// 👇 REPLACE THIS with your actual photo URL from Step 1
const photoUrl = "https://jfrwfxjvxpttyumgsfvz.supabase.co/storage/v1/object/public/lubab-images/...";

// 👇 REPLACE THIS with your child's name
const childName = "محمد";

// 👇 Which page to test (13 for testing eyes on profile view)
const pageToTest = 13;

// Don't modify below this line
fetch("/api/generate-story", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    childName: childName,
    childPhotoUrl: photoUrl,
    pageNumbers: [pageToTest]
  })
}).then(async response => {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  console.log(`🚀 Generating page ${pageToTest}...`);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = JSON.parse(line.slice(6));

        if (data.type === "portraits_start") {
          console.log(`🎨 Stage 1: Generating ${data.totalPoses} portrait poses...`);
        }

        if (data.type === "portrait_complete") {
          console.log(`  ✓ ${data.pose} portrait (${data.completedCount}/${data.totalPoses})`);
        }

        if (data.type === "portraits_complete") {
          console.log(`✅ Portraits complete! Now processing page ${pageToTest}...`);
        }

        if (data.type === "image") {
          console.log(`\n🎉 PAGE ${data.pageNumber} COMPLETE!`);
          console.log(`📷 View image at: ${data.imageUrl}`);
          console.log(`Method used: ${data.method}`);

          // Automatically open in new tab
          window.open(data.imageUrl, '_blank');
        }

        if (data.type === "complete") {
          console.log(`\n✅ Generation finished in ${data.totalTime}ms`);
        }
      }
    }
  }

  console.log("✨ Done! Check the new tab to see page 13");
});
```

3. **Press Enter** to run

4. **Wait ~30 seconds** for:
   - Stage 1: Portrait generation (7 poses)
   - Stage 2: Page 13 processing

5. **Check the result**:
   - New tab will auto-open with page 13
   - Check if the eyes look good!

## Expected Results

With the eye improvements, page 13 should now have:
- ✅ **Clear, well-shaped eyes** matching the child's photo
- ✅ **Proper eye color** (accurate iris)
- ✅ **No distortion** or blurriness in the eye
- ✅ **Illustration's hair style** preserved (no bleeding from portrait)
- ✅ **Smooth face blending** without harsh edges

## Tips

- **Testing multiple pages**: Change `pageNumbers: [13]` to `pageNumbers: [7, 13, 14]`
- **Console is your friend**: All progress logs appear in the console
- **Save the photo URL**: You can reuse it for multiple tests
- **Check the image**: Look specifically at the eye details in profile view

## Troubleshooting

**Photo URL not showing?**
- Make sure photo upload completed (green checkmark)
- Check browser console for the URL
- Refresh the page and try again

**Error in console?**
- Make sure dev server is running
- Check that you replaced the photoUrl with your actual URL
- Verify the URL is valid (starts with https://)

**Page takes too long?**
- Normal time: ~30 seconds for 1 page
- Stage 1 (portraits) still generates all 7 poses
- Stage 2 (page processing) only does page 13
