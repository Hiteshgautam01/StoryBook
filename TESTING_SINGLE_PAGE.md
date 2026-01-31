# Testing Single Page Generation

You can now generate specific pages instead of all 22 pages. This is useful for quickly testing improvements.

## Getting Your Photo URL

After uploading a photo, you'll see the URL in **TWO places**:

### 1. In the Browser Console (F12)
Look for: `📸 PHOTO URL: https://...`

### 2. Below the uploaded photo
A text box will appear showing the URL - **click it to select all**, then copy (Ctrl+C / Cmd+C)

---

## Method 1: Browser Console (Easiest)

1. Open your app in the browser: `http://localhost:3000`
2. Upload a child photo and enter a name
3. **Copy the photo URL** from below the photo (click the text box)
4. Open browser Developer Tools (F12)
5. Go to the Console tab
6. Paste this code and modify it:

```javascript
// Replace these with your actual values
const childName = "محمد";
const childPhotoUrl = "YOUR_SUPABASE_PHOTO_URL"; // The URL after you upload the photo
const pagesToTest = [13]; // Array of page numbers to generate

// Make the API call
fetch("/api/generate-story", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    childName,
    childPhotoUrl,
    pageNumbers: pagesToTest
  })
}).then(async response => {
  const reader = response.body.getReader();
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
        console.log(data.type, data);

        if (data.type === "image") {
          console.log(`✅ Page ${data.pageNumber} complete!`);
          console.log(`📷 Image URL: ${data.imageUrl}`);
        }
      }
    }
  }
});
```

## Method 2: Node.js Script

1. Update the script with your values:

```bash
# Edit the script
code scripts/test-single-page.ts

# Update these values:
# - CHILD_NAME
# - CHILD_PHOTO_URL
# - PAGE_TO_TEST
```

2. Run the script:

```bash
npx tsx scripts/test-single-page.ts
```

## Method 3: Modify Frontend Hook Call

If you want to add a UI button for single page testing, you can modify your component to call:

```typescript
startGeneration(childName, childPhotoUrl, gender, [13]); // Last parameter is page numbers
```

## Examples

### Generate only page 13
```javascript
pageNumbers: [13]
```

### Generate pages with profile poses (7, 13)
```javascript
pageNumbers: [7, 13]
```

### Generate the problematic pages
```javascript
pageNumbers: [7, 12, 13, 14, 15, 17]
```

### Generate all pages (default behavior)
```javascript
// Don't pass pageNumbers, or pass undefined/null
pageNumbers: undefined
```

## Benefits

- **Faster testing**: ~30 seconds for 1 page vs ~6 minutes for all 22 pages
- **Focused debugging**: Test specific problematic pages
- **Cost effective**: Uses fewer API credits during testing
- **Quick iteration**: Make changes and test immediately

## Notes

- The pipeline still generates ALL 7 portrait poses (Stage 1), but only processes the specified pages (Stage 2)
- This is because portraits are reused across multiple pages with the same pose
- Page 13 uses the "profile-left" portrait, which will still be generated even if you only request page 13
