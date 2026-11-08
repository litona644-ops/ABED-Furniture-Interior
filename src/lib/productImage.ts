import type { SyntheticEvent } from 'react';

/**
 * Universal Product Image Resolver & Normalizer
 * 
 * Ensures bulletproof image loading across:
 * - Local Development
 * - Vercel Production
 * - Cloudinary Image Storage (bvly3tyz)
 * - Firebase Firestore (ai-studio-abedfurnitureint-c95a7d41-ca64-4031-b090-1e741e8f1033)
 */

export const DEFAULT_PRODUCT_FALLBACK_IMAGE = 
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

/**
 * Normalizes any image URL:
 * - Trims whitespace
 * - Ensures HTTPS (avoids mixed content block on Vercel)
 * - Decodes stringified JSON if stored as a serialized string
 */
export function normalizeImageUrl(rawUrl?: any): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  // If accidentally stored as a JSON array string like '["https://..."]'
  if (trimmed.startsWith('["') && trimmed.endsWith('"]')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
        return normalizeImageUrl(parsed[0]);
      }
    } catch {
      // ignore parse error and proceed
    }
  }

  // Force HTTPS for Cloudinary & modern CDNs
  if (trimmed.startsWith('http://res.cloudinary.com/')) {
    return trimmed.replace('http://', 'https://');
  }

  if (trimmed.startsWith('http://images.unsplash.com/')) {
    return trimmed.replace('http://', 'https://');
  }

  return trimmed;
}

/**
 * Optimizes Cloudinary URLs for production delivery on Vercel & Mobile:
 * Adds f_auto,q_auto transformations so images load swiftly with minimum data.
 */
export function getOptimizedImageUrl(url: string, width?: number): string {
  const normalized = normalizeImageUrl(url);
  if (!normalized) return DEFAULT_PRODUCT_FALLBACK_IMAGE;

  // Optimize Cloudinary URLs
  if (normalized.includes('res.cloudinary.com') && normalized.includes('/image/upload/')) {
    // Avoid double transformation
    if (!normalized.includes('/f_auto') && !normalized.includes('/q_auto')) {
      const transform = width ? `f_auto,q_auto,w_${width},c_limit` : 'f_auto,q_auto';
      return normalized.replace('/image/upload/', `/image/upload/${transform}/`);
    }
  }

  return normalized;
}

/**
 * Resolves the primary/main image for any product across all possible field names:
 * Checks: imgUrl, imageUrl, image, coverImage, images[0], gallery[0], photos[0]
 */
export function getProductMainImage(product: any): string {
  if (!product || typeof product !== 'object') return DEFAULT_PRODUCT_FALLBACK_IMAGE;

  // 1. Direct primary image fields
  const candidates = [
    product.imgUrl,
    product.imageUrl,
    product.image,
    product.coverImage,
  ];

  for (const cand of candidates) {
    const norm = normalizeImageUrl(cand);
    if (norm) return norm;
  }

  // 2. Check array fields
  const arrayCandidates = [
    product.images,
    product.gallery,
    product.photos
  ];

  for (const arr of arrayCandidates) {
    if (Array.isArray(arr) && arr.length > 0) {
      for (const item of arr) {
        const norm = normalizeImageUrl(item);
        if (norm) return norm;
      }
    } else if (typeof arr === 'string' && arr.trim()) {
      const norm = normalizeImageUrl(arr);
      if (norm) return norm;
    }
  }

  return DEFAULT_PRODUCT_FALLBACK_IMAGE;
}

/**
 * Extracts all valid, unique images for a product's gallery showcase.
 */
export function getProductGalleryImages(product: any): string[] {
  if (!product || typeof product !== 'object') {
    return [DEFAULT_PRODUCT_FALLBACK_IMAGE];
  }

  const collected: string[] = [];

  const main = getProductMainImage(product);
  if (main) collected.push(main);

  const arrayCandidates = [
    product.images,
    product.gallery,
    product.photos
  ];

  for (const arr of arrayCandidates) {
    if (Array.isArray(arr)) {
      for (const item of arr) {
        const norm = normalizeImageUrl(item);
        if (norm && !collected.includes(norm)) {
          collected.push(norm);
        }
      }
    } else if (typeof arr === 'string' && arr.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(arr);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            const norm = normalizeImageUrl(item);
            if (norm && !collected.includes(norm)) {
              collected.push(norm);
            }
          }
        }
      } catch {
        const norm = normalizeImageUrl(arr);
        if (norm && !collected.includes(norm)) {
          collected.push(norm);
        }
      }
    }
  }

  return collected.length > 0 ? collected : [DEFAULT_PRODUCT_FALLBACK_IMAGE];
}

/**
 * Safe Image error event handler:
 * - Logs failed request for inspection
 * - Prevents infinite error loops
 * - Replaces with fallback gracefully
 */
export function handleProductImageError(
  e: SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = DEFAULT_PRODUCT_FALLBACK_IMAGE
) {
  const target = e.currentTarget;
  if (!target) return;

  const currentSrc = target.src;
  // Prevent infinite loop if fallback itself fails
  if (target.dataset.hasFailed === 'true') {
    return;
  }

  console.warn(`[ImageLoadWarning] Failed to load product image: ${currentSrc}. Falling back to default.`);
  target.dataset.hasFailed = 'true';
  target.src = fallback;
}
