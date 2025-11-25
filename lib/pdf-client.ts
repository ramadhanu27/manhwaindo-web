/**
 * Client-side PDF generation utilities
 * Generates PDF in the browser to avoid serverless function timeouts
 */

export async function generatePDFInBrowser(images: string[], onProgress?: (current: number, total: number, status: string) => void): Promise<Blob> {
  // Dynamically import jsPDF
  const { jsPDF } = await import("jspdf");

  const totalImages = images.length;
  const pageWidth = 210; // A4 width in mm

  // Fetch and process images in parallel batches
  const allImageData: Array<{
    data: string;
    width: number;
    height: number;
    index: number;
  }> = [];

  const batchSize = 5;
  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);

    const batchPromises = batch.map(async (imageUrl: string, batchIndex: number) => {
      const index = i + batchIndex;
      try {
        const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(imageUrl)}`);
        if (!response.ok) return null;

        const blob = await response.blob();

        // Convert blob to base64 and get dimensions
        return new Promise<{ data: string; width: number; height: number; index: number } | null>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const img = new Image();
            img.onload = () => {
              resolve({
                data: reader.result as string,
                width: img.width,
                height: img.height,
                index,
              });
            };
            img.onerror = () => resolve(null);
            img.src = reader.result as string;
          };
          reader.readAsDataURL(blob);
        });
      } catch {
        return null;
      }
    });

    const results = await Promise.all(batchPromises);
    for (const result of results) {
      if (result) allImageData.push(result);
    }

    if (onProgress) {
      onProgress(i + batch.length, totalImages, `Downloaded ${Math.min(i + batchSize, totalImages)}/${totalImages} images...`);
    }
  }

  // Sort by index to maintain order
  allImageData.sort((a, b) => a.index - b.index);

  if (allImageData.length === 0) {
    throw new Error("No images could be loaded");
  }

  if (onProgress) {
    onProgress(totalImages, totalImages, "Creating PDF...");
  }

  // Create PDF with first page
  const firstImg = allImageData[0];
  const firstImgHeight = (firstImg.height / firstImg.width) * pageWidth;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [pageWidth, firstImgHeight],
    compress: true,
  });

  // Add first image
  pdf.addImage(firstImg.data, "JPEG", 0, 0, pageWidth, firstImgHeight, undefined, "FAST");

  // Add remaining images (each on its own page)
  for (let i = 1; i < allImageData.length; i++) {
    const imgData = allImageData[i];
    const imgHeight = (imgData.height / imgData.width) * pageWidth;

    pdf.addPage([pageWidth, imgHeight], "portrait");
    pdf.addImage(imgData.data, "JPEG", 0, 0, pageWidth, imgHeight, undefined, "FAST");

    if (i % 5 === 0 && onProgress) {
      onProgress(i, allImageData.length, `Adding image ${i + 1}/${allImageData.length} to PDF...`);
    }
  }

  if (onProgress) {
    onProgress(allImageData.length, allImageData.length, "Finalizing PDF...");
  }

  // Return PDF as blob
  return pdf.output("blob");
}
