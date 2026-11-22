/**
 * HouseImage - replaces SVGScene with real local photographs.
 * Falls back gracefully if the image fails to load.
 */
import React, { useState } from 'react';
import { getHouseImages } from '../../data/imageManifest';

type SceneType = 'exterior' | 'living' | 'kitchen' | 'bedroom' | 'road' | 'bathroom' | string;

const sceneToIndex: Record<SceneType, number> = {
  exterior: 0,
  living: 1,
  bedroom: 2,
  kitchen: 3,
  bathroom: 4,
  road: 5,
};

interface HouseImageProps {
  houseId: string;
  sceneType?: SceneType;
  sceneIndex?: number;
  alt?: string;
  className?: string;
  objectFit?: 'cover' | 'contain';
}

export const HouseImage: React.FC<HouseImageProps> = ({
  houseId,
  sceneType = 'exterior',
  sceneIndex,
  alt = 'Property photo',
  className = 'w-full h-full object-cover',
  objectFit = 'cover',
}) => {
  const images = getHouseImages(houseId);
  const idx = sceneIndex !== undefined ? sceneIndex : (sceneToIndex[sceneType] ?? 0);
  const src = images[Math.min(idx, images.length - 1)] || images[0];
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`bg-brand-50 flex items-center justify-center ${className}`}>
        <span className="text-brand-200 text-4xl select-none">H</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ objectFit }}
      onError={() => setError(true)}
      loading="lazy"
      decoding="async"
    />
  );
};
