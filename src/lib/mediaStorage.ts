import { get, set, del } from 'idb-keyval';

export interface StoredMediaListing {
  listingId: string;
  videoBlob?: Blob;
  videoUrl?: string;
  posterBlob?: Blob;
  posterUrl?: string;
  photoBlobs: Blob[];
  photoUrls: string[];
}

export async function saveListingMedia(
  listingId: string,
  videoFile?: File,
  photoFiles?: File[],
  posterBlob?: Blob
) {
  const data: {
    videoBlob?: Blob;
    photoBlobs: Blob[];
    posterBlob?: Blob;
  } = {
    photoBlobs: photoFiles || [],
    videoBlob: videoFile,
    posterBlob,
  };

  await set(`houseme_media_${listingId}`, data);
}

export async function getListingMedia(listingId: string): Promise<{
  videoUrl?: string;
  posterUrl?: string;
  photoUrls: string[];
} | null> {
  const data = await get(`houseme_media_${listingId}`);
  if (!data) return null;

  const result: { videoUrl?: string; posterUrl?: string; photoUrls: string[] } = {
    photoUrls: [],
  };

  if (data.videoBlob) {
    result.videoUrl = URL.createObjectURL(data.videoBlob);
  }
  if (data.posterBlob) {
    result.posterUrl = URL.createObjectURL(data.posterBlob);
  }
  if (data.photoBlobs && Array.isArray(data.photoBlobs)) {
    result.photoUrls = data.photoBlobs.map((b: Blob) => URL.createObjectURL(b));
  }

  return result;
}

/**
 * Capture a frame from an uploaded video file to use as a real poster frame
 */
export function captureVideoFrame(videoFile: File, seekTime = 1): Promise<{ posterBlob: Blob; posterUrl: string }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    const fileUrl = URL.createObjectURL(videoFile);
    video.src = fileUrl;

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(seekTime, Math.max(0.1, video.duration / 2));
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 1136;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(fileUrl);
        return reject(new Error('Canvas context not available'));
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(fileUrl);
        if (blob) {
          const posterUrl = URL.createObjectURL(blob);
          resolve({ posterBlob: blob, posterUrl });
        } else {
          reject(new Error('Failed to create poster frame'));
        }
      }, 'image/jpeg', 0.85);
    };

    video.onerror = () => {
      URL.revokeObjectURL(fileUrl);
      reject(new Error('Failed to read video file'));
    };
  });
}
