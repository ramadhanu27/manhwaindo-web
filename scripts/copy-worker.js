const fs = require("fs");
const path = require("path");

// Function to copy file
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
  console.log(`Copied: ${src} -> ${dest}`);
}

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  console.log(`Copied directory: ${src} -> ${dest}`);
}

// Main execution
try {
  console.log("Copying OpenNext files for Cloudflare Pages deployment...");

  // Copy worker.js to functions directory
  copyFile(".open-next/worker.js", "functions/_worker.js");

  // Copy cloudflare directory to functions
  copyDir(".open-next/cloudflare", "functions/cloudflare");

  // Copy server functions to functions directory
  if (fs.existsSync(".open-next/server-functions")) {
    copyDir(".open-next/server-functions", "functions/server-functions");
  }

  console.log("✅ Worker files copied successfully!");
} catch (error) {
  console.error("❌ Error copying files:", error.message);
  process.exit(1);
}
