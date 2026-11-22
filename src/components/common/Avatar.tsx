import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { agentPhotoManifest } from '../../data/imageManifest';

interface AvatarProps {
  name: string;
  id?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  verified?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  id,
  src,
  size = 'md',
  verified = false,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  // Derive photo source
  let photoSrc = src;
  if (!photoSrc && id && agentPhotoManifest[id]) {
    photoSrc = agentPhotoManifest[id];
  }
  if (!photoSrc) {
    // Check known agent name mappings
    const lower = name.toLowerCase();
    if (lower.includes('tunde')) photoSrc = agentPhotoManifest['user-agent-tunde'];
    else if (lower.includes('ngozi')) photoSrc = agentPhotoManifest['user-agent-ngozi'];
    else if (lower.includes('prime')) photoSrc = agentPhotoManifest['user-agent-prime'];
    else if (lower.includes('ibrahim')) photoSrc = agentPhotoManifest['user-agent-ibrahim'];
    else if (lower.includes('funmi')) photoSrc = agentPhotoManifest['user-agent-funmi'];
    else if (lower.includes('chidi')) photoSrc = agentPhotoManifest['user-agent-chidi'];
  }

  const initials = name
    .split(' ')
    .filter((n) => n.length > 0 && n !== 'Mr' && n !== 'Mrs')
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  const sizeClasses = {
    sm: 'w-9 h-9 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
  }[size];

  const ringClasses = verified ? 'ring-2 ring-brand-600 ring-offset-2' : '';

  return (
    <div className="relative inline-block shrink-0 select-none">
      <div
        className={`rounded-full overflow-hidden flex items-center justify-center font-bold bg-brand-100 text-brand-700 border border-brand-200 ${sizeClasses} ${ringClasses} ${className}`}
      >
        {photoSrc && !imgError ? (
          <img
            src={photoSrc}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials || name.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      {verified && (
        <div
          title="Verified uploader"
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-brand-700 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm"
        >
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </div>
      )}
    </div>
  );
};
