/**
 * optimize-images.mjs
 * Paisajes Invisibles — Batch Image Optimizer
 *
 * Usage:
 *   node optimize-images.mjs --type portraits   --input ./raw/victims   --output ./optimized/victims
 *   node optimize-images.mjs --type fullscreen  --input ./raw/protests  --output ./optimized/protests
 *   node optimize-images.mjs --type thumbnails  --input ./raw/places    --output ./optimized/places
 *
 * Or process all folders at once using the BATCH CONFIG below.
 * Run: node optimize-images.mjs --all
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─────────────────────────────────────────────
// CONFIG — Edit these paths to match your folder structure
// ─────────────────────────────────────────────
const BATCH_CONFIG = [
  {
    name: "familias",
    input: "/Users/valentinofarias/Desktop/RAW/FAMILIAS",
    output: "/Users/valentinofarias/Desktop/optimized/familias",
    width: 1200, // raised from 800 — portraits need more resolution to keep face detail sharp
    quality: 87, // raised from 82 — reduces WebP artifacts on skin, hair, fine textures
    targetKB: 250,
    recursive: true, // FAMILIAS has subfolders (one per family) — scan inside them too
  },
  {
    name: "grafica",
    input: "/Users/valentinofarias/Desktop/RAW/GRAFICA",
    output: "/Users/valentinofarias/Desktop/optimized/grafica",
    width: 1920,
    quality: 85, // raised from 80 — safer for detailed graphic/text images
    targetKB: 500,
  },
  {
    name: "paisajes",
    input: "/Users/valentinofarias/Desktop/RAW/PAISAJES",
    output: "/Users/valentinofarias/Desktop/optimized/paisajes",
    width: 1920,
    quality: 85, // raised from 80
    targetKB: 500,
  },
  {
    name: "protestas",
    input: "/Users/valentinofarias/Desktop/RAW/PROTESTAS",
    output: "/Users/valentinofarias/Desktop/optimized/protestas",
    width: 1920,
    quality: 85, // raised from 80
    targetKB: 500,
  },
];

const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif", ".avif"];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

function getImageFiles(dir, recursive = false) {
  if (!fs.existsSync(dir)) {
    console.error(`  ✗ Input folder not found: ${dir}`);
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && recursive) {
      // Go inside subfolders when recursive mode is on
      results = results.concat(getImageFiles(fullPath, true));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.includes(ext)) {
        // Return the full path so we know which subfolder it came from
        results.push(fullPath);
      }
    }
  }

  return results;
}

async function processImage(inputPath, outputPath, { width, quality }) {
  const before = fs.statSync(inputPath).size;

  await sharp(inputPath)
    .resize({ width, withoutEnlargement: true }) // never upscale
    .webp({ quality })
    .toFile(outputPath);

  const after = fs.statSync(outputPath).size;
  const saved = (((before - after) / before) * 100).toFixed(1);

  return { before, after, saved };
}

// ─────────────────────────────────────────────
// MAIN PROCESSOR
// ─────────────────────────────────────────────
async function processFolder({ name, input, output, width, quality, targetKB, recursive = false }) {
  console.log(`\n${"─".repeat(50)}`);
  console.log(`  📁 ${name.toUpperCase()} — ${input}`);
  console.log(`     Target: ${width}px wide · WebP quality ${quality} · ~${targetKB}KB`);
  console.log(`${"─".repeat(50)}`);

  // Pass recursive flag — FAMILIAS needs it because images live inside subfolders
  const files = getImageFiles(input, recursive);
  if (files.length === 0) {
    console.log("  No images found. Skipping.\n");
    return { processed: 0, totalBefore: 0, totalAfter: 0 };
  }

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output, { recursive: true });
  }

  let processed = 0;
  let totalBefore = 0;
  let totalAfter = 0;
  const warnings = [];

  for (const inputPath of files) {
    // Compute the relative path from the input root so we can mirror the folder structure.
    // e.g. RAW/FAMILIAS/CESAR MALLEA/photo.jpg → optimized/familias/CESAR MALLEA/photo.webp
    const relativePath = path.relative(input, inputPath);
    const relativeDir = path.dirname(relativePath);
    const baseName = path.basename(inputPath, path.extname(inputPath));

    // Create the matching subfolder inside output if it doesn't exist yet
    const outputDir = path.join(output, relativeDir);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, `${baseName}.webp`);

    try {
      const { before, after, saved } = await processImage(inputPath, outputPath, { width, quality });

      totalBefore += before;
      totalAfter += after;
      processed++;

      const afterKB = after / 1024;
      const overTarget = afterKB > targetKB * 1.2; // warn if 20% over target

      const status = overTarget ? "⚠" : "✓";
      console.log(
        `  ${status} ${baseName.slice(0, 35).padEnd(35)} ${formatBytes(before).padStart(8)} → ${formatBytes(after).padStart(8)}  (−${saved}%)`
      );

      if (overTarget) {
        warnings.push({ file: baseName, sizeKB: afterKB.toFixed(0) });
      }
    } catch (err) {
      console.error(`  ✗ Failed: ${inputPath} — ${err.message}`);
    }
  }

  const totalSaved = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1);
  console.log(`\n  ✅ Done: ${processed} files · ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)} (−${totalSaved}% total)`);

  if (warnings.length > 0) {
    console.log(`\n  ⚠  ${warnings.length} file(s) exceeded target size — consider lowering quality or width:`);
    warnings.forEach((w) => console.log(`     • ${w.file} (${w.sizeKB}KB)`));
  }

  return { processed, totalBefore, totalAfter };
}

// ─────────────────────────────────────────────
// CLI ENTRY POINT
// ─────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  console.log("\n🖼  Paisajes Invisibles — Image Optimizer");
  console.log("==========================================");

  let configs = [];

  if (args.includes("--all")) {
    // Process all folders defined in BATCH_CONFIG
    configs = BATCH_CONFIG;
  } else {
    // Parse individual flags: --type --input --output
    const type = args[args.indexOf("--type") + 1];
    const input = args[args.indexOf("--input") + 1];
    const output = args[args.indexOf("--output") + 1];

    if (!type || !input || !output) {
      console.log("\nUsage:");
      console.log("  node optimize-images.mjs --all");
      console.log("  node optimize-images.mjs --type portraits --input ./raw/victims --output ./optimized/victims");
      console.log("\nAvailable types: portraits, fullscreen, thumbnails");
      process.exit(1);
    }

    const preset = BATCH_CONFIG.find((c) => c.name === type);
    if (!preset) {
      console.error(`Unknown type "${type}". Use: portraits, fullscreen, or thumbnails`);
      process.exit(1);
    }

    configs = [{ ...preset, input, output }];
  }

  let grandTotalBefore = 0;
  let grandTotalAfter = 0;
  let grandTotalFiles = 0;

  for (const config of configs) {
    const { processed, totalBefore, totalAfter } = await processFolder(config);
    grandTotalBefore += totalBefore;
    grandTotalAfter += totalAfter;
    grandTotalFiles += processed;
  }

  if (configs.length > 1) {
    const totalSaved = (((grandTotalBefore - grandTotalAfter) / grandTotalBefore) * 100).toFixed(1);
    console.log(`\n${"═".repeat(50)}`);
    console.log(`  🎉 ALL DONE`);
    console.log(`     Files processed : ${grandTotalFiles}`);
    console.log(`     Total before     : ${formatBytes(grandTotalBefore)}`);
    console.log(`     Total after      : ${formatBytes(grandTotalAfter)}`);
    console.log(`     Total saved      : −${totalSaved}%`);
    console.log(`${"═".repeat(50)}\n`);
  }
}

main().catch((err) => {
  console.error("\n❌ Unexpected error:", err.message);
  process.exit(1);
});
