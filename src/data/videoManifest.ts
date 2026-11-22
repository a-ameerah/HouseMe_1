// Video manifest mapping property IDs to local video assets
// Files are placed in public/videos/{houseId}.mp4

export const videoManifest: Record<string, string> = {
  'list-yaba-2bed': '/videos/list-yaba-2bed.mp4',
  'list-yaba-dup-tunde': '/videos/list-yaba-dup-tunde.mp4',
  'list-surulere-2bed': '/videos/list-surulere-2bed.mp4',
};

export function getVideoUrl(houseId: string): string | null {
  return videoManifest[houseId] || null;
}
