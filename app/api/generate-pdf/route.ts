import { NextRequest, NextResponse } from "next/server";

interface ChapterData {
  slug: string;
  title: string;
  images: string[];
}

/**
 * API route to generate PDF server-side and stream directly to browser
 * This allows true direct download without waiting on client
 */
export async function POST(request: NextRequest) {
  try {
    const { series, chapters } = await request.json();

    if (!series || !chapters || chapters.length === 0) {
      return NextResponse.json({ error: "Missing series or chapters" }, { status: 400 });
    }

    // Dynamically import jsPDF
    const { jsPDF } = await import("jspdf");

    // Get total images count
    const totalImages = chapters.reduce((sum: number, ch: ChapterData) => sum + ch.images.length, 0);
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
    const minBottomMargin = 15;

    let yPosition = pageHeight - margin;

    // Add all images with automatic page breaks (no titles)
    for (const chapter of chapters) {
      const images = chapter.images || [];
      if (images.length === 0) continue;

      // Fetch all images in parallel first
      const imageDataPromises = images.map(async (imageUrl: string) => {
        try {
          const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
          const imgResponse = await fetch(new URL(proxyUrl, request.url), {
            signal: AbortSignal.timeout(30000),
          });

          if (!imgResponse.ok) {
            console.warn(`Failed to fetch image: ${imageUrl}`);
            return null;
          }

          const imgBlob = await imgResponse.blob();
          const arrayBuffer = await imgBlob.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const mimeType = imgBlob.type || "image/jpeg";
          return { buffer, mimeType };
        } catch (error) {
          console.error("Error fetching image:", error);
          return null;
        }
      });

      const imageData = await Promise.all(imageDataPromises);

      // Add images to PDF with fixed dimensions
      for (const imgData of imageData) {
        if (!imgData) continue;

        try {
          // Use fixed image height (standard manga page aspect ratio)
          const imgHeight = 250; // Fixed height in mm

          // Check if image fits on current page
          if (yPosition - imgHeight < margin + minBottomMargin) {
            pdf.addPage();
            yPosition = pageHeight - margin;
          }

          // Add image to PDF with fixed dimensions using buffer directly
          const base64String = imgData.buffer.toString("base64");
          pdf.addImage(`data:${imgData.mimeType};base64,${base64String}`, imgData.mimeType === "image/png" ? "PNG" : "JPEG", margin, yPosition - imgHeight, contentWidth, imgHeight);
          yPosition -= imgHeight + 2;

          processedImages++;
          console.log(`✓ Added image ${processedImages}/${totalImages}`);
        } catch (error) {
          console.error("Error adding image:", error);
        }
      }

      yPosition -= 8; // Gap between chapters
    }

    const pageCount = pdf.internal.pages.length - 1;
    console.log(`PDF generated: ${pageCount} pages, Total images: ${processedImages}/${totalImages}`);

    // Get PDF as blob
    const pdfBlob = pdf.output("blob");
    const pdfBuffer = await pdfBlob.arrayBuffer();

    // Sanitize filename to handle Unicode and special characters
    const sanitizeFilename = (name: string): string => {
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
    };

    const safeFilename = sanitizeFilename(series);
    console.log(`Original filename: "${series}" -> Sanitized: "${safeFilename}"`);

    // Return PDF with proper headers for direct download
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
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
