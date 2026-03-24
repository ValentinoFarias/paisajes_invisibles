/**
 * upload-to-cloudinary.mjs
 * Paisajes Invisibles — Cloudinary Uploader
 *
 * Uploads all optimized images to Cloudinary, keeping the same folder structure.
 *
 * Usage:
 *   node upload-to-cloudinary.mjs           → uploads everything
 *   node upload-to-cloudinary.mjs familias  → uploads one folder only
 */

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

// Load credentials from .env file
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

// Root folder where your optimized images live (output from optimize-images.mjs)
const OPTIMIZED_ROOT = "/Users/valentinofarias/Desktop/optimized";

// This is the top-level folder name that will appear in your Cloudinary media library
const CLOUDINARY_BASE_FOLDER = "paisajes-invisibles";

// ─────────────────────────────────────────────
// SETUP — Connect to Cloudinary using .env credentials
// ─────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const SUPPORTED_EXTENSIONS = [".webp", ".jpg", ".jpeg", ".png"];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

// Recursively collect all image file paths inside a directory
function getAllImageFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllImageFiles(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

// Upload a single image to Cloudinary.
// The public_id mirrors the local folder structure so it stays organised in Cloudinary.
async function uploadImage(filePath) {
  // e.g. /Desktop/optimized/familias/CESAR MALLEA/photo.webp
  //   → relative: familias/CESAR MALLEA/photo.webp
  //   → public_id: paisajes-invisibles/familias/CESAR MALLEA/photo
  const relativePath = path.relative(OPTIMIZED_ROOT, filePath);
  const withoutExt = relativePath.replace(/\.[^/.]+$/, ""); // remove file extension
  const publicId = `${CLOUDINARY_BASE_FOLDER}/${withoutExt}`;

  const result = await cloudinary.uploader.upload(filePath, {
    public_id: publicId,
    // use_filename: keeps the original file name
    use_filename: true,
    // overwrite: false means it will skip if the image already exists in Cloudinary
    overwrite: false,
    // resource_type: auto detects image/video/raw automatically
    resource_type: "auto",
  });

  return result;
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  // Check that credentials are loaded — fail early with a clear message if not
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    console.error("\n❌ Cloudinary credentials not found.");
    console.error("   Make sure your .env file has CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.\n");
    process.exit(1);
  }

  const args = process.argv.slice(2);
  // Optional: pass a folder name to upload only that one (e.g. "familias")
  const filterFolder = args[0] || null;

  // Determine which folders to process
  const allFolders = fs.readdirSync(OPTIMIZED_ROOT).filter((f) => {
    const fullPath = path.join(OPTIMIZED_ROOT, f);
    return fs.statSync(fullPath).isDirectory();
  });

  const foldersToProcess = filterFolder
    ? allFolders.filter((f) => f.toLowerCase() === filterFolder.toLowerCase())
    : allFolders;

  if (foldersToProcess.length === 0) {
    console.error(`\n❌ No folders found${filterFolder ? ` matching "${filterFolder}"` : ""} in ${OPTIMIZED_ROOT}\n`);
    process.exit(1);
  }

  console.log("\n☁️  Paisajes Invisibles — Cloudinary Uploader");
  console.log("==============================================");
  console.log(`   Uploading to: ${CLOUDINARY_BASE_FOLDER}/`);
  console.log(`   Folders: ${foldersToProcess.join(", ")}\n`);

  let totalUploaded = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const folder of foldersToProcess) {
    const folderPath = path.join(OPTIMIZED_ROOT, folder);
    const files = getAllImageFiles(folderPath);

    console.log(`\n${"─".repeat(50)}`);
    console.log(`  📁 ${folder.toUpperCase()} — ${files.length} images`);
    console.log(`${"─".repeat(50)}`);

    for (const filePath of files) {
      const relativePath = path.relative(OPTIMIZED_ROOT, filePath);
      const shortName = relativePath.slice(0, 55).padEnd(55);

      try {
        const result = await uploadImage(filePath);

        // Cloudinary returns "uploading" if new, or existing url if overwrite:false skipped it
        if (result.existing) {
          console.log(`  ~ ${shortName} already exists — skipped`);
          totalSkipped++;
        } else {
          console.log(`  ✓ ${shortName} → ${result.secure_url}`);
          totalUploaded++;
        }
      } catch (err) {
        console.error(`  ✗ ${shortName} FAILED — ${err.message}`);
        totalFailed++;
      }
    }
  }

  console.log(`\n${"═".repeat(50)}`);
  console.log(`  🎉 UPLOAD COMPLETE`);
  console.log(`     Uploaded : ${totalUploaded}`);
  console.log(`     Skipped  : ${totalSkipped} (already on Cloudinary)`);
  console.log(`     Failed   : ${totalFailed}`);
  console.log(`${"═".repeat(50)}\n`);
}

main().catch((err) => {
  console.error("\n❌ Unexpected error:", err.message);
  process.exit(1);
});
