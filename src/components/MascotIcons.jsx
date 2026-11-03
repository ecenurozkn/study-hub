import React from 'react';

/**
 * 1. Gülümseyen Sevimli Alev Karakteri
 */
export function FlameMascot({ className = 'h-12 w-12' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="habitzFlameOuter" x1="32" y1="4" x2="32" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDBA74" />
          <stop offset="55%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#FDA4AF" />
        </linearGradient>
        <linearGradient id="habitzFlameInner" x1="32" y1="20" x2="32" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>
      </defs>
      <path
        d="M33.5 5C33.5 5 49 18.5 51.5 34.5C53.6 48 43.5 59 32 59C20.5 59 10.5 48.5 12.5 35C14 25 22 18.5 22 18.5C22 18.5 20.5 25.5 24.5 27.5C23.5 18 33.5 5 33.5 5Z"
        fill="url(#habitzFlameOuter)"
      />
      <path
        d="M32.5 22C32.5 22 43 31 44 41.5C44.8 50 38.5 56 32 56C25.5 56 19.5 50 20.5 41.5C21.3 33.5 32.5 22 32.5 22Z"
        fill="url(#habitzFlameInner)"
      />
      <circle cx="25.5" cy="41.5" r="2.6" fill="#1E293B" />
      <circle cx="38.5" cy="41.5" r="2.6" fill="#1E293B" />
      <circle cx="24.7" cy="40.6" r="0.9" fill="#FFFFFF" />
      <circle cx="37.7" cy="40.6" r="0.9" fill="#FFFFFF" />
      <ellipse cx="21.2" cy="44.8" rx="2.6" ry="1.5" fill="#FB7185" opacity="0.65" />
      <ellipse cx="42.8" cy="44.8" rx="2.6" ry="1.5" fill="#FB7185" opacity="0.65" />
      <path
        d="M28.5 45.2C29.6 47.4 34.4 47.4 35.5 45.2"
        stroke="#1E293B"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 2. Göz Kırpan Sevimli Bulut Karakteri (Ana Hoş Geldiniz Kartı Maskotu)
 */
export function WinkingCloudMascot({ className = 'h-14 w-14' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="habitzWinkCloudGrad" x1="10" y1="14" x2="54" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BFDBFE" />
          <stop offset="100%" stopColor="#93C5FD" />
        </linearGradient>
      </defs>
      <path
        d="M21 49H45.5C51.85 49 57 43.85 57 37.5C57 31.65 52.6 26.82 46.92 26.1C44.75 18.55 37.8 13 29.5 13C19.83 13 12 20.83 12 30.5C12 31.32 12.06 32.12 12.18 32.9C8.95 34.62 7 37.98 7 41.8C7 45.95 10.55 49 15 49H21Z"
        fill="url(#habitzWinkCloudGrad)"
      />
      {/* Sol Açık Göz */}
      <circle cx="25.5" cy="34.8" r="2.5" fill="#1E293B" />
      <circle cx="24.7" cy="34" r="0.85" fill="#FFFFFF" />
      {/* Sağ Göz Kırpan Yay */}
      <path
        d="M35.5 35.2C36.7 33.2 39.8 33.2 41 35.2"
        stroke="#1E293B"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Pembe Yanaklar */}
      <ellipse cx="21.5" cy="38.2" rx="2.6" ry="1.4" fill="#FDA4AF" />
      <ellipse cx="42.5" cy="38.2" rx="2.6" ry="1.4" fill="#FDA4AF" />
      {/* Neşeli Gülümseme */}
      <path
        d="M28.8 38.4C30.2 40.6 34.2 40.6 35.6 38.4"
        stroke="#1E293B"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 3. Minik Gözlü Sevimli Bulut Karakteri (Bebek Mavisi #93C5FD)
 */
export function CloudMascot({ className = 'h-10 w-10' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="habitzCloudGrad" x1="12" y1="16" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BFDBFE" />
          <stop offset="100%" stopColor="#93C5FD" />
        </linearGradient>
      </defs>
      <path
        d="M21 49H45.5C51.85 49 57 43.85 57 37.5C57 31.65 52.6 26.82 46.92 26.1C44.75 18.55 37.8 13 29.5 13C19.83 13 12 20.83 12 30.5C12 31.32 12.06 32.12 12.18 32.9C8.95 34.62 7 37.98 7 41.8C7 45.95 10.55 49 15 49H21Z"
        fill="url(#habitzCloudGrad)"
      />
      <circle cx="26" cy="35" r="2.4" fill="#1E293B" />
      <circle cx="38" cy="35" r="2.4" fill="#1E293B" />
      <circle cx="25.3" cy="34.2" r="0.8" fill="#FFFFFF" />
      <circle cx="37.3" cy="34.2" r="0.8" fill="#FFFFFF" />
      <ellipse cx="22" cy="38" rx="2.4" ry="1.3" fill="#FDA4AF" />
      <ellipse cx="42" cy="38" rx="2.4" ry="1.3" fill="#FDA4AF" />
      <path
        d="M29.2 38C30.4 39.8 33.6 39.8 34.8 38"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 4. Sevimli Beşgen Karakter (Tatlı Mor / Lavanta #C4B5FD & #8B5CF6)
 */
export function PentagonMascot({ className = 'h-10 w-10' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="habitzPentagonGrad" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <path
        d="M28.2 8.6C30.5 6.9 33.5 6.9 35.8 8.6L54.2 22C56.5 23.7 57.5 26.6 56.6 29.3L49.6 50.9C48.7 53.6 46.2 55.5 43.3 55.5H20.7C17.8 55.5 15.3 53.6 14.4 50.9L7.4 29.3C6.5 26.6 7.5 23.7 9.8 22L28.2 8.6Z"
        fill="url(#habitzPentagonGrad)"
      />
      <circle cx="25.5" cy="34" r="2.5" fill="#1E293B" />
      <circle cx="38.5" cy="34" r="2.5" fill="#1E293B" />
      <circle cx="24.8" cy="33.1" r="0.9" fill="#FFFFFF" />
      <circle cx="37.8" cy="33.1" r="0.9" fill="#FFFFFF" />
      <ellipse cx="21.2" cy="37.2" rx="2.4" ry="1.4" fill="#FDA4AF" opacity="0.85" />
      <ellipse cx="42.8" cy="37.2" rx="2.4" ry="1.4" fill="#FDA4AF" opacity="0.85" />
      <path
        d="M28.8 37.6C30.2 39.8 33.8 39.8 35.2 37.6"
        stroke="#1E293B"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 5. Sevimli Yıldız Karakter (Günışığı Turuncusu / Sarı #FDBA74)
 */
export function StarMascot({ className = 'h-10 w-10' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="habitzStarGrad" x1="12" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>
      </defs>
      <path
        d="M32 7.5C33.6 7.5 35 8.5 35.6 9.9L40.5 21.2L52.7 22.4C55.8 22.7 57.1 26.5 54.8 28.6L45.6 36.8L48.3 48.8C49 51.8 45.7 54.2 43.1 52.6L32 45.9L20.9 52.6C18.3 54.2 15 51.8 15.7 48.8L18.4 36.8L9.2 28.6C6.9 26.5 8.2 22.7 11.3 22.4L23.5 21.2L28.4 9.9C29 8.5 30.4 7.5 32 7.5Z"
        fill="url(#habitzStarGrad)"
      />
      <circle cx="26.2" cy="32.5" r="2.3" fill="#1E293B" />
      <circle cx="37.8" cy="32.5" r="2.3" fill="#1E293B" />
      <circle cx="25.5" cy="31.7" r="0.8" fill="#FFFFFF" />
      <circle cx="37.1" cy="31.7" r="0.8" fill="#FFFFFF" />
      <ellipse cx="22.5" cy="35.6" rx="2.2" ry="1.3" fill="#FDA4AF" />
      <ellipse cx="41.5" cy="35.6" rx="2.2" ry="1.3" fill="#FDA4AF" />
      <path
        d="M29.2 35.8C30.4 37.6 33.6 37.6 34.8 35.8"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 6. Sevimli Damla Karakteri (Nane Yeşili #6EE7B7)
 */
export function DropMascot({ className = 'h-10 w-10' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="habitzDropGrad" x1="18" y1="8" x2="48" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>
      </defs>
      <path
        d="M32 8C32 8 51 27.2 51 40.5C51 50.7 42.5 57 32 57C21.5 57 13 50.7 13 40.5C13 27.2 32 8 32 8Z"
        fill="url(#habitzDropGrad)"
      />
      <path
        d="M22 33C22 28.5 25 23.5 27 21"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="26" cy="39.5" r="2.4" fill="#1E293B" />
      <circle cx="38" cy="39.5" r="2.4" fill="#1E293B" />
      <circle cx="25.3" cy="38.7" r="0.8" fill="#FFFFFF" />
      <circle cx="37.3" cy="38.7" r="0.8" fill="#FFFFFF" />
      <ellipse cx="22" cy="42.6" rx="2.3" ry="1.3" fill="#FDA4AF" />
      <ellipse cx="42" cy="42.6" rx="2.3" ry="1.3" fill="#FDA4AF" />
      <path
        d="M29 42.8C30.3 44.6 33.7 44.6 35 42.8"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const MASCOT_OPTIONS = [
  { id: 'flame', label: 'Neşeli Alev', component: FlameMascot, bg: 'bg-[#FFF1F2]' },
  { id: 'cloud', label: 'Bulut Dostu', component: CloudMascot, bg: 'bg-[#EFF6FF]' },
  { id: 'pentagon', label: 'Mor Beşgen', component: PentagonMascot, bg: 'bg-[#F5F3FF]' },
  { id: 'star', label: 'Parlak Yıldız', component: StarMascot, bg: 'bg-[#FFF7ED]' },
  { id: 'drop', label: 'Nane Damlası', component: DropMascot, bg: 'bg-[#ECFDF5]' },
];

const COLOR_TO_MASCOT = {
  blue: 'cloud',
  emerald: 'drop',
  violet: 'pentagon',
  rose: 'flame',
  amber: 'star',
};

/**
 * Her derse rengine veya seçilen maskotuna göre sevimli bir mini karakter ikonu atar
 */
export function CourseMascotBadge({
  course,
  mascotType,
  size = 'md',
  className = '',
}) {
  const resolvedType =
    mascotType ||
    course?.mascot ||
    COLOR_TO_MASCOT[course?.color] ||
    'cloud';

  const found =
    MASCOT_OPTIONS.find((m) => m.id === resolvedType) || MASCOT_OPTIONS[1];
  const Comp = found.component;

  const sizeMap = {
    xs: { box: 'h-7 w-7 rounded-xl', svg: 'h-5 w-5' },
    sm: { box: 'h-9 w-9 rounded-2xl', svg: 'h-6 w-6' },
    md: { box: 'h-11 w-11 rounded-2xl', svg: 'h-8 w-8' },
    lg: { box: 'h-14 w-14 rounded-3xl', svg: 'h-10 w-10' },
  };

  const dims = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center border border-white/90 shadow-xs ${found.bg} ${dims.box} ${className}`}
      title={found.label}
    >
      <Comp className={dims.svg} />
    </div>
  );
}
