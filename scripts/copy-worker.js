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
  console.log("Copying OpenNext worker to functions directory...");

  // Copy worker.js
  copyFile(".open-next/worker.js", "functions/_worker.js");

  // Copy cloudflare directory
  copyDir(".open-next/cloudflare", "functions/cloudflare");

  console.log("✅ Copy complete!");
} catch (error) {
  console.error("❌ Error copying files:", error.message);
  process.exit(1);
}
