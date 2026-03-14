import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useWallpapers, useUnsplashPhotos } from '../../hooks/useApi';

const API_BASE = 'http://localhost:3001/api';

/** Resolve wallpaper URL — external URLs used as-is, local filenames via API */
function resolveWallpaperUrl(filename: string): string {
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  return `${API_BASE}/wallpapers/images/${filename}`;
}

interface WallpaperItem {
  url: string;
  title: string;
}

/**
 * Full-screen wallpaper background layer.
 * Supports two sources:
 *  - "local": images from backend data/wallpapers/ directory
 *  - "unsplash": high-quality photos fetched from Unsplash API
 * Always shows a black base with faded images on top.
 *
 * Crossfade strategy:
 *  - Two <img> layers (A and B) are always mounted.
 *  - We alternate which layer is "front" using a simple toggle.
 *  - The new image is loaded off-screen first, then we fade the front layer in.
 */
export default function WallpaperLayer() {
  const { t } = useTranslation();
  const { data: config, isLoading, isError } = useWallpapers();

  const isUnsplash = config?.source === 'unsplash';
  const { data: unsplashPhotos } = useUnsplashPhotos(isUnsplash);

  const [currentIndex, setCurrentIndex] = useState(0);
  // showA = true means layer A is the visible (front) layer
  const [showA, setShowA] = useState(true);
  const [srcA, setSrcA] = useState<string>('');
  const [srcB, setSrcB] = useState<string>('');
  const [fadeA, setFadeA] = useState(true); // true = A is visible
  const [fadeB, setFadeB] = useState(false); // false = B is hidden
  const preloadRef = useRef<HTMLImageElement | null>(null);

  // Build unified wallpaper items from either source
  const wallpaperItems: WallpaperItem[] = useMemo(() => {
    if (isUnsplash && unsplashPhotos && unsplashPhotos.length > 0) {
      return unsplashPhotos.map((photo) => ({
        url: photo.url,
        title: photo.description || photo.author,
      }));
    }
    // Fallback to local wallpapers
    const active = (config?.wallpapers ?? []).filter((w) => w.active);
    return active.map((w) => ({
      url: resolveWallpaperUrl(w.filename),
      title: w.title,
    }));
  }, [isUnsplash, unsplashPhotos, config]);

  const shouldRotate = config?.rotationEnabled === true && wallpaperItems.length > 1;
  const rotationInterval = config?.rotationInterval ?? 30_000;

  // Initialize first image on layer A
  useEffect(() => {
    if (wallpaperItems.length > 0) {
      setSrcA(wallpaperItems[0].url);
      setFadeA(true);
      setFadeB(false);
      setShowA(true);
      setCurrentIndex(0);
    }
  }, [wallpaperItems]);

  // Crossfade to the next image
  const crossfadeTo = useCallback(
    (nextIdx: number) => {
      const nextUrl = wallpaperItems[nextIdx]?.url;
      if (!nextUrl) return;

      // Preload the next image before starting the transition
      const img = new Image();
      preloadRef.current = img;
      img.onload = () => {
        if (showA) {
          // A is currently visible → load next into B, then fade B in / A out
          setSrcB(nextUrl);
          // Use requestAnimationFrame to ensure B is rendered at opacity-0 first
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setFadeB(true);
              setFadeA(false);
              setShowA(false);
            });
          });
        } else {
          // B is currently visible → load next into A, then fade A in / B out
          setSrcA(nextUrl);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setFadeA(true);
              setFadeB(false);
              setShowA(true);
            });
          });
        }
        setCurrentIndex(nextIdx);
      };
      img.onerror = () => {
        // Skip to next on error
        setCurrentIndex(nextIdx);
      };
      img.src = nextUrl;
    },
    [wallpaperItems, showA],
  );

  // Rotation timer
  useEffect(() => {
    if (!shouldRotate || wallpaperItems.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % wallpaperItems.length;
        crossfadeTo(next);
        return prev; // actual update happens in crossfadeTo callback
      });
    }, rotationInterval);

    return () => clearInterval(timer);
  }, [shouldRotate, wallpaperItems.length, rotationInterval, crossfadeTo]);

  // No wallpapers — just show black background
  if (wallpaperItems.length === 0) {
    return <div className="absolute inset-0 bg-black" />;
  }

  const currentItem = wallpaperItems[currentIndex];

  return (
    <div className="absolute inset-0 bg-black">
      {/* Layer A */}
      <img
        src={srcA}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
          fadeA ? 'opacity-80' : 'opacity-0'
        }`}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Layer B */}
      {srcB && (
        <img
          src={srcB}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
            fadeB ? 'opacity-80' : 'opacity-0'
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}

      {/* Dark overlay for subtle fade effect */}
      <div className="absolute inset-0 bg-black/15" />

      {/* Unsplash attribution (required by Unsplash API guidelines) */}
      {isUnsplash && currentItem && (
        <div className="absolute bottom-2 left-2 text-[10px] text-white/30 z-10">
          {t('common.photoCredit')}
        </div>
      )}
    </div>
  );
}
