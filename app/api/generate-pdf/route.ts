import { NextRequest, NextResponse } from "next/server";

interface ChapterData {
  slug: string;
  title: string;
  images: string[];
}

/**
 * API route to generate PDF server-side with all images in continuous pages
 * Optimized with parallel image fetching for 5x faster generation
 */
export async function POST(request: NextRequest) {
  try {
    const { series, chapters } = await request.json();

    if (!series || !chapters || chapters.length === 0) {
      return NextResponse.json({ error: "Missing series or chapters" }, { status: 400 });
    }

    // Dynamically import jsPDF and image-size
    const { jsPDF } = await import("jspdf");
    const sizeOf = (await import("image-size")).default;

    // Get total images count
    const totalImages = chapters.reduce((sum: number, ch: ChapterData) => sum + ch.images.length, 0);
    let processedImages = 0;

    // Fetch all images with parallel batching for speed
    console.log(`Fetching ${totalImages} images in parallel batches...`);
    const allImageData: Array<{
      buffer: Buffer;
      mimeType: string;
      width: number;
      height: number;
      index: number;
    }> = [];

    // Collect all image URLs first
    const allImageUrls: Array<{ url: string; index: number }> = [];
    let imageIndex = 0;
    for (const chapter of chapters) {
      const images = chapter.images || [];
      for (const imageUrl of images) {
        allImageUrls.push({ url: imageUrl, index: imageIndex });
        imageIndex++;
      }
    }

    // Fetch images in parallel batches (5 at a time)
    const batchSize = 5;
    for (let i = 0; i < allImageUrls.length; i += batchSize) {
      const batch = allImageUrls.slice(i, i + batchSize);

      const batchPromises = batch.map(async ({ url: imageUrl, index }) => {
        try {
          const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
          const imgResponse = await fetch(new URL(proxyUrl, request.url), {
            signal: AbortSignal.timeout(30000),
          });

          if (!imgResponse.ok) {
            console.warn(`Failed to fetch image ${index + 1}: ${imageUrl}`);
            return null;
          }

          const imgBlob = await imgResponse.blob();
          const arrayBuffer = await imgBlob.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const mimeType = imgBlob.type || "image/jpeg";

          // Get actual image dimensions
          let dimensions;
          try {
            dimensions = sizeOf(buffer);
          } catch (err) {
            console.warn(`Failed to get dimensions for image ${index + 1}, using defaults`);
            dimensions = { width: 800, height: 1120 };
          }

          console.log(`✓ Fetched image ${index + 1}/${totalImages} (${dimensions.width || 800}x${dimensions.height || 1120})`);

          return {
            buffer,
            mimeType,
            width: dimensions.width || 800,
            height: dimensions.height || 1120,
            index,
          };
        } catch (error) {
          console.error(`Error fetching image ${index + 1}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);

      // Add successful results
      for (const result of batchResults) {
        if (result !== null) {
          allImageData.push(result);
        }
      }
    }

    // Sort by index to maintain order
    allImageData.sort((a, b) => a.index - b.index);

    console.log(`Successfully fetched ${allImageData.length}/${totalImages} images`);

    if (allImageData.length === 0) {
      return NextResponse.json({ error: "No images could be loaded" }, { status: 400 });
    }

    // Create PDF: 1 image per page with custom height
    const pageWidth = 210; // A4 width in mm

    console.log(`Creating PDF with ${allImageData.length} pages (1 image per page)...`);

    // Create PDF with first page
    const firstImg = allImageData[0];
    const firstImgWidthMM = pageWidth;
    const firstImgHeightMM = (firstImg.height / firstImg.width) * firstImgWidthMM;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [pageWidth, firstImgHeightMM],
      compress: true,
    });

    // Add first image
    const firstBase64 = firstImg.buffer.toString("base64");
    pdf.addImage(`data:${firstImg.mimeType};base64,${firstBase64}`, firstImg.mimeType === "image/png" ? "PNG" : "JPEG", 0, 0, firstImgWidthMM, firstImgHeightMM, undefined, "FAST");

    processedImages++;
    console.log(`✓ Added image 1/${allImageData.length} to PDF`);

    // Add remaining images (each on its own page)
    for (let i = 1; i < allImageData.length; i++) {
      const imgData = allImageData[i];
      const imgWidthMM = pageWidth;
      const imgHeightMM = (imgData.height / imgData.width) * imgWidthMM;

      try {
        // Add new page with custom height for this image
        pdf.addPage([pageWidth, imgHeightMM], "portrait");

        // Add image to fill the page
        const base64String = imgData.buffer.toString("base64");
        pdf.addImage(`data:${imgData.mimeType};base64,${base64String}`, imgData.mimeType === "image/png" ? "PNG" : "JPEG", 0, 0, imgWidthMM, imgHeightMM, undefined, "FAST");

        processedImages++;

        if (processedImages % 5 === 0) {
          console.log(`✓ Added ${processedImages}/${allImageData.length} images to PDF`);
        }
      } catch (error) {
        console.error(`Error adding image ${i + 1} to PDF:`, error);
      }
    }

    const pageCount = pdf.internal.pages.length - 1;
    console.log(`PDF generated: ${pageCount} pages, ${processedImages}/${allImageData.length} images`);

    // Get PDF as blob
    const pdfBlob = pdf.output("blob");
    const pdfBuffer = await pdfBlob.arrayBuffer();

    // Sanitize filename
    const sanitizeFilename = (name: string): string => {
      let sanitized = name
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .replace(/[—–]/g, "-")
        .replace(/[…]/g, "...")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\x00-\x7F]/g, "_")
        .replace(/[<>:"/\\|?*]/g, "_")
        .replace(/[_\s]+/g, "_")
        .replace(/^[_\s]+|[_\s]+$/g, "")
        .trim();

      if (!sanitized || sanitized.length === 0) {
        sanitized = "download";
      }

      if (sanitized.length > 200) {
        sanitized = sanitized.substring(0, 200);
      }

      return sanitized;
    };

    const safeFilename = sanitizeFilename(series);
    console.log(`Original filename: "${series}" -> Sanitized: "${safeFilename}"`);
    console.log(`PDF size: ${(pdfBuffer.byteLength / 1024 / 1024).toFixed(2)} MB`);

    // Return PDF directly (works best with IDM and browsers)
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFilename}.pdf"`,
        "Content-Length": pdfBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate PDF", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
