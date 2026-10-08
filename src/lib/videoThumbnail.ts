/**
 * Real Video Thumbnail Generator & Frame Extractor
 * Extracts authentic video frames from video files, Cloudinary video URLs, and external video links.
 */

/**
 * Extracts a high-resolution frame from a video File or URL in the browser using HTML5 Canvas.
 */
export function captureVideoFrame(
  fileOrUrl: File | string,
  atTimeInSec: number = 0.5
): Promise<string> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous';

      let objectUrl: string | null = null;
      if (typeof fileOrUrl === 'string') {
        video.src = fileOrUrl;
      } else {
        objectUrl = URL.createObjectURL(fileOrUrl);
        video.src = objectUrl;
      }

      const cleanup = () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
      };

      const timeoutId = setTimeout(() => {
        cleanup();
        // If timeout occurs, fallback to Cloudinary URL transformation if string
        if (typeof fileOrUrl === 'string') {
          resolve(getCloudinaryVideoThumbnail(fileOrUrl) || '');
        } else {
          resolve('');
        }
      }, 5000);

      video.onloadedmetadata = () => {
        const targetTime = Math.min(
          atTimeInSec,
          video.duration > 0.5 ? video.duration / 2 : 0.1
        );
        video.currentTime = targetTime;
      };

      video.onseeked = () => {
        clearTimeout(timeoutId);
        try {
          const canvas = document.createElement('canvas');
          const width = video.videoWidth || 800;
          const height = video.videoHeight || 450;
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
            cleanup();
            resolve(dataUrl);
            return;
          }
        } catch (e) {
          console.warn('Canvas video frame extraction note:', e);
        }
        cleanup();
        if (typeof fileOrUrl === 'string') {
          resolve(getCloudinaryVideoThumbnail(fileOrUrl) || '');
        } else {
          resolve('');
        }
      };

      video.onerror = () => {
        clearTimeout(timeoutId);
        cleanup();
        if (typeof fileOrUrl === 'string') {
          resolve(getCloudinaryVideoThumbnail(fileOrUrl) || '');
        } else {
          resolve('');
        }
      };
    } catch {
      resolve('');
    }
  });
}

/**
 * Returns an instant official Cloudinary thumbnail for any Cloudinary video URL.
 * Converts: https://res.cloudinary.com/.../video/upload/v123/name.mp4
 * To: https://res.cloudinary.com/.../video/upload/so_1,w_1000,h_650,c_fill,q_auto,f_jpg/v123/name.jpg
 */
export function getCloudinaryVideoThumbnail(videoUrl: string): string {
  if (!videoUrl || typeof videoUrl !== 'string') return '';

  // Cloudinary Video transformation
  if (videoUrl.includes('cloudinary.com') && videoUrl.includes('/video/upload/')) {
    const withoutExt = videoUrl.replace(/\.(mp4|mov|webm|ogg|m4v)$/i, '.jpg');
    return withoutExt.replace(
      '/video/upload/',
      '/video/upload/so_1,w_1000,h_650,c_fill,q_auto,f_jpg/'
    );
  }

  // YouTube Video Thumbnail
  const ytMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
  }

  return '';
}

/**
 * Determines the best real video thumbnail for any project video URL.
 */
export function getProjectVideoThumbnail(videoUrl: string): string {
  if (!videoUrl) return '';
  const cloudThumb = getCloudinaryVideoThumbnail(videoUrl);
  if (cloudThumb) return cloudThumb;
  return `${videoUrl}#t=0.5`;
}
