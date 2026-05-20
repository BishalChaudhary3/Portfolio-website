// lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Upload image to Cloudinary
export async function uploadImage(file, folder = 'portfolio') {
  try {
    // If file is base64 or buffer
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}

// Upload multiple images
export async function uploadMultipleImages(files, folder = 'portfolio') {
  const uploadPromises = files.map(file => uploadImage(file, folder));
  return await Promise.all(uploadPromises);
}

// Delete image from Cloudinary
export async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}

// Get image with transformations
export function getOptimizedImageUrl(publicId, options = {}) {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'limit',
    effect,
  } = options;
  
  let url = cloudinary.url(publicId, {
    quality,
    fetch_format: format,
    crop,
  });
  
  if (width) url = cloudinary.url(publicId, { width, crop });
  if (height) url = cloudinary.url(publicId, { height, crop });
  if (effect) url = cloudinary.url(publicId, { effect });
  
  return url;
}

// Get thumbnail URL
export function getThumbnailUrl(publicId, width = 300, height = 300) {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'thumb',
    gravity: 'face',
    quality: 'auto',
    fetch_format: 'auto',
  });
}

// Get blurred placeholder (for lazy loading)
export function getBlurPlaceholder(publicId) {
  return cloudinary.url(publicId, {
    transformation: [
      { effect: 'blur:500' },
      { quality: 1 },
      { fetch_format: 'auto' },
    ],
  });
}

// Upload from URL
export async function uploadFromUrl(url, folder = 'portfolio') {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: folder,
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error uploading from URL:', error);
    throw error;
  }
}

// Get video thumbnail
export async function getVideoThumbnail(videoPublicId, timestamp = '1') {
  return cloudinary.url(videoPublicId, {
    resource_type: 'video',
    transformation: [
      { start_offset: timestamp },
      { flags: 'layer_apply' },
      { format: 'jpg' },
    ],
  });
}

// Signature generation for unsigned uploads (client-side)
export function generateSignature(timestamp, folder) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    apiSecret
  );
  return signature;
}