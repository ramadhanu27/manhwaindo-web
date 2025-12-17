/**
 * Frontend-based file generation utilities
 * Generates PDF, CBZ, and ZIP files in the browser
 */

import JSZip from "jszip";

interface ChapterData {
  slug: string;
  title: string;
  images: string[];
}

interface DownloadProgress {
  current: number;
  total: number;
  status: string;
}

type ProgressCallback = (progress: DownloadProgress) => void;

/**
 * Create a placeholder image blob
 */
function createPlaceholderBlob(): Blob {
  // Create a simple gray placeholder image (1x1 pixel PNG)
  const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;

  if (canvas) {
    canvas.width = 100;
    canvas.height = 150;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#e5e7eb";
      ctx.fillRect(0, 0, 100, 150);
      ctx.fillStyle = "#9ca3af";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Image", 50, 70);
      ctx.fillText("Unavailable", 50, 85);
    }
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob || new Blob()), "image/png");
    }) as any;
  }

  // Fallback: return empty blob
  return new Blob();
}

/**
 * Fetch image as blob using backend proxy with retry logic
 */
async function fetchImageBlob(url: string, retries = 3): Promise<Blob> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Fetching image (attempt ${attempt}/${retries}): ${url}`);

      // Try backend proxy first (recommended)
      try {
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
        console.log(`  Trying proxy: ${proxyUrl}`);

        const response = await fetch(proxyUrl, {
          method: "GET",
          signal: AbortSignal.timeout(30000), // 30 second timeout
        });

        if (response.ok) {
          const blob = await response.blob();
          if (blob.size > 0) {
            console.log(`✓ Image fetched (proxy, attempt ${attempt}): ${blob.size} bytes`);
            return blob;
          }
        } else {
          console.warn(`Proxy returned status ${response.status}`);
        }
      } catch (proxyError) {
        console.log(`Proxy fetch failed (attempt ${attempt}):`, proxyError instanceof Error ? proxyError.message : proxyError);
      }

      // Fallback: Try direct fetch with CORS
      try {
        const response = await fetch(url, {
          method: "GET",
          mode: "cors",
          credentials: "omit",
          headers: {
            Accept: "image/*",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
          signal: AbortSignal.timeout(20000), // 20 second timeout
        });

        if (response.ok) {
          const blob = await response.blob();
          if (blob.size > 0) {
            console.log(`✓ Image fetched (direct, attempt ${attempt}): ${blob.size} bytes`);
            return blob;
          }
        }
      } catch (directError) {
        console.log(`Direct fetch failed (attempt ${attempt}):`, directError instanceof Error ? directError.message : directError);
      }

      // Fallback: Try with no-cors mode
      try {
        const noCorsResponse = await fetch(url, {
          method: "GET",
          mode: "no-cors",
          credentials: "omit",
          signal: AbortSignal.timeout(20000),
        });

        if (noCorsResponse.status === 0 || noCorsResponse.ok) {
          const blob = await noCorsResponse.blob();
          if (blob.size > 0) {
            console.log(`✓ Image fetched (no-cors, attempt ${attempt}): ${blob.size} bytes`);
            return blob;
          }
        }
      } catch (noCorsError) {
        lastError = noCorsError instanceof Error ? noCorsError : new Error(String(noCorsError));
        console.log(`No-cors fetch failed (attempt ${attempt}):`, lastError.message);
      }

      // Wait before retry (exponential backoff)
      if (attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Error in attempt ${attempt}:`, lastError.message);

      if (attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Last resort: Use placeholder image
  console.warn(`⚠ All attempts failed for: ${url}. Using placeholder.`);
  if (lastError) {
    console.error(`Last error:`, lastError);
  }
  return createPlaceholderBlob();
}

/**
 * Download all images in parallel with progress tracking
 */
async function downloadAllImages(chapters: ChapterData[], onProgress?: ProgressCallback): Promise<Map<string, Blob[]>> {
  const imageMap = new Map<string, Blob[]>();
  let completed = 0;
  const total = chapters.reduce((sum, ch) => sum + ch.images.length, 0) || 1;

  if (total === 0) {
    onProgress?.({
      current: 100,
      total: 100,
      status: "No images to download",
    });
    return imageMap;
  }

  for (const chapter of chapters) {
    const blobs: (Blob | null)[] = new Array(chapter.images.length).fill(null);

    if (chapter.images.length === 0) {
      console.warn(`Chapter ${chapter.title} has no images`);
      imageMap.set(chapter.slug, []);
      continue;
    }

    // Download images in parallel but maintain order
    const imagePromises = chapter.images.map(async (imageUrl, index) => {
      try {
        const blob = await fetchImageBlob(imageUrl);
        blobs[index] = blob; // Maintain order by index
        completed++;
        onProgress?.({
          current: completed,
          total,
          status: `Downloading images... ${completed}/${total}`,
        });
        return blob;
      } catch (error) {
        console.error(`Error downloading image ${index + 1}:`, error);
        blobs[index] = null; // Keep null at correct index
        completed++;
        onProgress?.({
          current: completed,
          total,
          status: `Downloading images... ${completed}/${total}`,
        });
        return null;
      }
    });

    await Promise.all(imagePromises);
    const successfulBlobs = blobs.filter((blob): blob is Blob => blob !== null);

    console.log(`Chapter ${chapter.title}: Downloaded ${successfulBlobs.length}/${chapter.images.length} images (order maintained)`);
    imageMap.set(chapter.slug, successfulBlobs);
  }

  return imageMap;
}

/**
 * Generate PDF file with all images merged into 1 page
 */
export async function generatePDF(series: string, chapters: ChapterData[], onProgress?: ProgressCallback): Promise<Blob> {
  onProgress?.({
    current: 0,
    total: 100,
    status: "Downloading images...",
  });

  // Download all images
  const imageMap = await downloadAllImages(chapters, onProgress);

  onProgress?.({
    current: 50,
    total: 100,
    status: "Generating PDF...",
  });

  // Dynamic import for jsPDF
  const { jsPDF } = await import("jspdf");

  // Get total images count
  const totalImages = Array.from(imageMap.values()).reduce((sum, blobs) => sum + blobs.length, 0);
  let processedImages = 0;

  // Create PDF with A4 size and automatic page breaks
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const minBottomMargin = 15; // Minimum space at bottom before page break

  let yPosition = pageHeight - margin;

  // Add all images with automatic page breaks (no titles)
  for (const chapter of chapters) {
    const blobs = imageMap.get(chapter.slug) || [];
    if (blobs.length === 0) continue;

    // Add images
    for (const blob of blobs) {
      try {
        // Get image dimensions
        const img = new Image();
        const url = URL.createObjectURL(blob);

        await new Promise<void>((resolve) => {
          img.onload = () => {
            try {
              // Calculate image height based on content width
              const imgHeight = (img.height / img.width) * contentWidth;

              // Check if image fits on current page (with buffer)
              if (yPosition - imgHeight < margin + minBottomMargin) {
                pdf.addPage();
                yPosition = pageHeight - margin;
              }

              // Add image to PDF
              pdf.addImage(url, "JPEG", margin, yPosition - imgHeight, contentWidth, imgHeight);
              yPosition -= imgHeight + 2;

              URL.revokeObjectURL(url);
              console.log(`✓ Added image ${processedImages + 1}/${totalImages} at y=${yPosition}`);
              resolve();
            } catch (error) {
              console.error("Error adding image:", error);
              resolve();
            }
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            console.error("Error loading image");
            resolve();
          };
          img.src = url;
        });

        processedImages++;
        onProgress?.({
          current: 50 + (processedImages / totalImages) * 50,
          total: 100,
          status: `Adding images... ${processedImages}/${totalImages}`,
        });
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }

    yPosition -= 8; // Gap between chapters
  }

  const pageCount = pdf.internal.pages.length - 1;
  onProgress?.({
    current: 100,
    total: 100,
    status: `PDF ready! (${pageCount} pages, ${processedImages} images)`,
  });

  console.log(`PDF generated: ${pageCount} pages, Total images: ${processedImages}/${totalImages}`);

  return pdf.output("blob");
}

/**
 * Generate CBZ (Comic Book ZIP) file
 */
export async function generateCBZ(series: string, chapters: ChapterData[], onProgress?: ProgressCallback): Promise<Blob> {
  onProgress?.({
    current: 0,
    total: 100,
    status: "Downloading images...",
  });

  // Download all images
  const imageMap = await downloadAllImages(chapters, onProgress);

  onProgress?.({
    current: 50,
    total: 100,
    status: "Creating CBZ file...",
  });

  const zip = new JSZip();
  let imageIndex = 1;
  let processedImages = 0;
  const totalImages = Array.from(imageMap.values()).reduce((sum, blobs) => sum + blobs.length, 0);

  for (const chapter of chapters) {
    const chapterFolder = zip.folder(chapter.title);
    if (!chapterFolder) continue;

    const blobs = imageMap.get(chapter.slug) || [];

    for (const blob of blobs) {
      const filename = `${String(imageIndex).padStart(4, "0")}.jpg`;
      chapterFolder.file(filename, blob);
      imageIndex++;

      processedImages++;
      onProgress?.({
        current: 50 + (processedImages / totalImages) * 50,
        total: 100,
        status: `Creating CBZ... ${processedImages}/${totalImages}`,
      });
    }
  }

  // Add ComicInfo.xml metadata
  const comicInfo = generateComicInfoXML(series, chapters);
  zip.file("ComicInfo.xml", comicInfo);

  onProgress?.({
    current: 95,
    total: 100,
    status: "Finalizing CBZ...",
  });

  const blob = await zip.generateAsync({ type: "blob" });

  onProgress?.({
    current: 100,
    total: 100,
    status: "CBZ ready!",
  });

  return blob;
}

/**
 * Generate ZIP file with organized folder structure
 */
export async function generateZIP(series: string, chapters: ChapterData[], onProgress?: ProgressCallback): Promise<Blob> {
  onProgress?.({
    current: 0,
    total: 100,
    status: "Downloading images...",
  });

  // Download all images
  const imageMap = await downloadAllImages(chapters, onProgress);

  onProgress?.({
    current: 50,
    total: 100,
    status: "Creating ZIP file...",
  });

  const zip = new JSZip();
  let processedImages = 0;
  const totalImages = Array.from(imageMap.values()).reduce((sum, blobs) => sum + blobs.length, 0);

  for (const chapter of chapters) {
    const chapterFolder = zip.folder(chapter.title);
    if (!chapterFolder) continue;

    const blobs = imageMap.get(chapter.slug) || [];

    for (let i = 0; i < blobs.length; i++) {
      const filename = `${String(i + 1).padStart(3, "0")}.jpg`;
      chapterFolder.file(filename, blobs[i]);

      processedImages++;
      onProgress?.({
        current: 50 + (processedImages / totalImages) * 50,
        total: 100,
        status: `Creating ZIP... ${processedImages}/${totalImages}`,
      });
    }
  }

  // Add metadata file
  const metadata = {
    series,
    chapters: chapters.map((ch) => ({
      title: ch.title,
      images: (imageMap.get(ch.slug) || []).length,
    })),
    downloadedAt: new Date().toISOString(),
  };
  zip.file("metadata.json", JSON.stringify(metadata, null, 2));

  onProgress?.({
    current: 95,
    total: 100,
    status: "Finalizing ZIP...",
  });

  const blob = await zip.generateAsync({ type: "blob" });

  onProgress?.({
    current: 100,
    total: 100,
    status: "ZIP ready!",
  });

  return blob;
}

/**
 * Sanitize filename to handle Unicode and special characters
 */
function sanitizeFilename(name: string): string {
  let sanitized = name
    // Replace smart quotes with regular quotes
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    // Replace em/en dashes with hyphens
    .replace(/[—–]/g, "-")
    // Replace other common Unicode characters
    .replace(/[…]/g, "...")
    // Normalize Unicode characters (NFD = decompose, then remove combining marks)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    // Replace remaining non-ASCII characters with underscores
    .replace(/[^\x00-\x7F]/g, "_")
    // Replace invalid filename characters with underscores
    .replace(/[<>:"/\\|?*]/g, "_")
    // Replace multiple underscores/spaces with single ones
    .replace(/[_\s]+/g, "_")
    // Remove leading/trailing underscores and spaces
    .replace(/^[_\s]+|[_\s]+$/g, "")
    .trim();

  // Ensure filename is not empty
  if (!sanitized || sanitized.length === 0) {
    sanitized = "download";
  }

  // Limit filename length (max 200 chars to be safe)
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200);
  }

  return sanitized;
}

/**
 * Trigger file download
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const safeFilename = sanitizeFilename(filename);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate ComicInfo.xml for CBZ format
 */
function generateComicInfoXML(series: string, chapters: ChapterData[]): string {
  const totalImages = chapters.reduce((sum, ch) => sum + ch.images.length, 0);

  return `<?xml version="1.0" encoding="utf-8"?>
<ComicInfo xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Title>${escapeXML(series)}</Title>
  <Series>${escapeXML(series)}</Series>
  <Number>${chapters.length}</Number>
  <Count>${totalImages}</Count>
  <Summary>Downloaded from ManhwaIndo</Summary>
  <Year>${new Date().getFullYear()}</Year>
  <Month>${new Date().getMonth() + 1}</Month>
  <Day>${new Date().getDate()}</Day>
  <Publisher>ManhwaIndo</Publisher>
  <Genre>Manga</Genre>
  <Web>https://manhwaindo.com</Web>
  <PageCount>${totalImages}</PageCount>
  <LanguageISO>id</LanguageISO>
  <Format>Webtoon</Format>
  <BlackAndWhite>No</BlackAndWhite>
  <Manga>YesAndRightToLeft</Manga>
  <ScanInformation>Downloaded from ManhwaIndo</ScanInformation>
  <AgeRating>Unknown</AgeRating>
</ComicInfo>`;
}

/**
 * Escape XML special characters
 */
function escapeXML(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
