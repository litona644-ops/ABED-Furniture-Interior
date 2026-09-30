/**
 * Cloudinary Upload Service for Abed Furniture & Interior Admin Panel
 * 
 * Cloud Name: bvly3tyz
 * Upload Preset: website_upload (Unsigned)
 * 
 * Features:
 * - Direct browser-to-Cloudinary unsigned upload without exposing API secrets
 * - Supports JPG, JPEG, PNG, WEBP images
 * - Supports MP4 videos (1-2 minutes, up to 100MB)
 * - Real-time upload percentage progress via XMLHttpRequest
 * - Descriptive Bengali & English error messaging
 */

export const CLOUDINARY_CONFIG = {
  cloudName: 'bvly3tyz',
  uploadPreset: 'website_upload',
  apiBaseUrl: 'https://api.cloudinary.com/v1_1/bvly3tyz'
};

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  format: string;
  bytes: number;
  duration?: number;
  width?: number;
  height?: number;
}

/**
 * Validates allowed image formats (JPG, JPEG, PNG, WEBP)
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isImageMime = file.type.startsWith('image/');

  if (!isImageMime && !allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: 'শুধুমাত্র JPG, JPEG, PNG এবং WEBP ছবি নির্বাচন করুন।'
    };
  }

  // 25MB max size limit for images
  const maxImageBytes = 25 * 1024 * 1024;
  if (file.size > maxImageBytes) {
    return {
      valid: false,
      error: 'ছবির সাইজ ২৫MB এর বেশি হতে পারবে না।'
    };
  }

  return { valid: true };
}

/**
 * Validates video formats (MP4) and size for 1-2 minute videos
 */
export function validateVideoFile(file: File): { valid: boolean; error?: string } {
  const allowedExtensions = ['mp4', 'mov', 'webm'];
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isVideoMime = file.type.startsWith('video/');

  if (!isVideoMime && !allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: 'শুধুমাত্র MP4 ফরম্যাটের ভিডিও নির্বাচন করুন।'
    };
  }

  // 100MB max limit to comfortably support 1-2 minutes full HD MP4 video
  const maxVideoBytes = 100 * 1024 * 1024;
  if (file.size > maxVideoBytes) {
    return {
      valid: false,
      error: 'ভিডিও সাইজ ১০০MB এর বেশি! ১–২ মিনিটের MP4 ভিডিও নির্বাচন করুন।'
    };
  }

  return { valid: true };
}

/**
 * Core upload handler to Cloudinary using XMLHttpRequest for accurate live progress tracking
 */
export async function uploadToCloudinary(
  file: File,
  resourceType: 'image' | 'video' | 'auto' = 'auto',
  onProgress?: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    // 1. Validate file based on resource type
    if (resourceType === 'image') {
      const val = validateImageFile(file);
      if (!val.valid) {
        return reject(new Error(val.error));
      }
    } else if (resourceType === 'video') {
      const val = validateVideoFile(file);
      if (!val.valid) {
        return reject(new Error(val.error));
      }
    }

    const endpoint = `${CLOUDINARY_CONFIG.apiBaseUrl}/${resourceType}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    // Track live progress percentage
    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(Math.min(99, Math.max(0, percent)));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          const secureUrl = response.secure_url || response.url;
          if (onProgress) onProgress(100);
          if (secureUrl) {
            resolve(secureUrl);
          } else {
            reject(new Error('ক্লাউডিনারি থেকে সঠিক URL পাওয়া যায়নি।'));
          }
        } catch {
          reject(new Error('ক্লাউডিনারি রেসপন্স পার্স করতে ব্যর্থ হয়েছে।'));
        }
      } else {
        let errorMsg = 'ক্লাউডিনারিতে ফাইল আপলোড ব্যর্থ হয়েছে।';
        try {
          const errRes = JSON.parse(xhr.responseText);
          if (errRes.error && errRes.error.message) {
            errorMsg = `ক্লাউডিনারি এরর: ${errRes.error.message}`;
          }
        } catch {
          errorMsg = `আপলোড ব্যর্থ হয়েছে (HTTP ${xhr.status})`;
        }
        reject(new Error(errorMsg));
      }
    };

    xhr.onerror = () => {
      reject(new Error('নেটওয়ার্ক সমস্যার কারণে ক্লাউডিনারিতে আপলোড সম্পন্ন হতে পারেনি। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন।'));
    };

    xhr.ontimeout = () => {
      reject(new Error('আপলোড টাইমআউট হয়েছে। পুনরায় চেষ্টা করুন।'));
    };

    // 10 minutes timeout for larger 1-2 minute videos
    xhr.timeout = 10 * 60 * 1000;

    xhr.send(formData);
  });
}

/**
 * Upload an image to Cloudinary (supports JPG, JPEG, PNG, WEBP)
 */
export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  return await uploadToCloudinary(file, 'image', onProgress);
}

/**
 * Upload an MP4 video (1-2 minutes) to Cloudinary
 */
export async function uploadVideoToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  return await uploadToCloudinary(file, 'video', onProgress);
}

/**
 * Returns the uncompressed original Cloudinary URL.
 * Guarantees no low-quality downscaling or aggressive compression parameters are present.
 */
export function getOriginalImageUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  return url.trim();
}

