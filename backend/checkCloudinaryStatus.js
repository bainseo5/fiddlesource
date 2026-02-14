/**
 * Check Cloudinary upload progress
 */

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddtyxauci',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const resources = await cloudinary.api.resources({
  type: 'upload',
  resource_type: 'video',
  max_results: 500
});

console.log(`\n📊 Cloudinary Status:`);
console.log(`   Files uploaded: ${resources.resources.length} / 63`);
console.log(`\n   Recent uploads:`);
resources.resources.slice(0, 10).forEach(r => {
  console.log(`   - ${r.public_id}`);
});
