/**
 * list-cloudinary-images.mjs
 * Paisajes Invisibles — Cloudinary folder lister
 *
 * Fetches all image public IDs inside a Cloudinary folder and prints them
 * formatted and ready to paste into the `images: []` array in cases.js.
 *
 * Usage:
 *   node list-cloudinary-images.mjs "paisajes-invisibles/familias/ROMARIO VELOZ"
 *   node list-cloudinary-images.mjs --all
 */

import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fetches ALL resources in a folder using the Search API (handles pagination)
async function listAllInFolder(folder) {
  const results = [];
  let nextCursor = undefined;

  do {
    // Use folder: expression — matches Cloudinary's newer asset_folder system
    const query = cloudinary.search
      .expression(`folder:"${folder}"`)
      .max_results(500);

    if (nextCursor) query.next_cursor(nextCursor);

    const response = await query.execute();

    results.push(...response.resources);
    nextCursor = response.next_cursor;
  } while (nextCursor);

  return results;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("\nUsage:");
    console.log('  node list-cloudinary-images.mjs "paisajes-invisibles/familias/ROMARIO VELOZ"');
    console.log("  node list-cloudinary-images.mjs --all");
    process.exit(1);
  }

  if (args[0] === "--all") {
    // List every subfolder inside familias
    console.log("\nFetching all folders under paisajes-invisibles/familias ...\n");

    const response = await cloudinary.api.sub_folders("paisajes-invisibles/familias");
    const folders  = response.folders.map((f) => f.path);

    for (const folder of folders) {
      await printFolder(folder);
    }
  } else {
    // Single folder passed as argument
    await printFolder(args[0]);
  }
}

async function printFolder(folder) {
  const resources = await listAllInFolder(folder);

  if (resources.length === 0) {
    console.log(`// ${folder} — no images found\n`);
    return;
  }

  // Use secure_url — these images use Cloudinary's fixed-folder system
  // where public_id is just the filename, not a full path
  const urls = resources.map((r) => r.secure_url);

  // Print in copy-paste format for cases.js
  console.log(`// ── ${folder} (${urls.length} images)`);
  console.log("images: [");
  for (const url of urls) {
    console.log(`  "${url}",`);
  }
  console.log("],");
  console.log("");
}

main().catch((err) => {
  console.error("\n❌ Error:", err.message);
  process.exit(1);
});
