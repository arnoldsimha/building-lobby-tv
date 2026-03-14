import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useWallpapers, usePictures } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import FadeTransition from '../common/FadeTransition';

const API_BASE = 'http://localhost:3001/api';

/** Resolve wallpaper URL — external URLs used as-is, local filenames via API */
function resolveImageUrl(filenameOrUrl: string): string {
  if (filenameOrUrl.startsWith('http://') || filenameOrUrl.startsWith('https://')) {
    return filenameOrUrl;
  }
  return `${API_BASE}/wallpapers/images/${filenameOrUrl}`;
}

/** Unified image item from either wallpaper or picture config */
interface ImageItem {
  id: string;
  url: string;
  title: string;
  active: boolean;
}

type DataSourceType = 'wallpapers' | 'pictures';

interface WallpaperWidgetProps {
  large?: boolean;
  dataSource?: DataSourceType;
  className?: string;
}

/**
 * Premium image display widget with glass styling.
 */
export default function WallpaperWidget({
  large = false,
  dataSource = 'wallpapers',
  className = '',
}: WallpaperWidgetProps) {
  const { t } = useTranslation();

  const wallpaperQuery = useWallpapers();
  const pictureQuery = usePictures();

  const query = dataSource === 'pictures' ? pictureQuery : wallpaperQuery;
  const { data: rawConfig, isLoading, isError } = query;

  const { activeItems, rotationEnabled, rotationInterval } = useMemo(() => {
    if (!rawConfig) {
      return { activeItems: [] as ImageItem[], rotationEnabled: false, rotationInterval: 30000 };
    }

    if (dataSource === 'pictures' && 'pictures' in rawConfig) {
      const cfg = rawConfig as { pictures: Array<{ id: string; url: string; title: string; active: boolean }>; rotationEnabled: boolean; rotationInterval: number };
      return {
        activeItems: cfg.pictures.filter((p) => p.active).map((p) => ({
          id: p.id,
          url: p.url,
          title: p.title,
          active: p.active,
        })),
        rotationEnabled: cfg.rotationEnabled,
        rotationInterval: cfg.rotationInterval ?? 15000,
      };
    }

    if ('wallpapers' in rawConfig) {
      const cfg = rawConfig as { wallpapers: Array<{ id: string; filename: string; title: string; active: boolean }>; rotationEnabled: boolean; rotationInterval: number };
      return {
        activeItems: cfg.wallpapers.filter((w) => w.active).map((w) => ({
          id: w.id,
          url: resolveImageUrl(w.filename),
          title: w.title,
          active: w.active,
        })),
        rotationEnabled: cfg.rotationEnabled,
        rotationInterval: cfg.rotationInterval ?? 30000,
      };
    }

    return { activeItems: [] as ImageItem[], rotationEnabled: false, rotationInterval: 30000 };
  }, [rawConfig, dataSource]);

  const shouldRotate = large && rotationEnabled && activeItems.length > 1;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!shouldRotate || activeItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeItems.length);
    }, rotationInterval);
    return () => clearInterval(timer);
  }, [shouldRotate, activeItems.length, rotationInterval]);

  useEffect(() => {
    if (currentIndex >= activeItems.length && activeItems.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeItems.length, currentIndex]);

  const currentItem = activeItems[currentIndex] ?? activeItems[0] ?? null;
  const imageUrl = currentItem?.url ?? null;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={large ? 'flex items-center justify-center h-full' : ''}>
          <LoadingSpinner size={large ? 'lg' : 'sm'} />
        </div>
      );
    }

    if (isError || !imageUrl) {
      return (
        <div className={large ? 'flex items-center justify-center h-full' : ''}>
          <p className="text-white/50 text-base italic">
            {t('common.unavailable')}
          </p>
        </div>
      );
    }

    if (large) {
      return (
        <div className="relative w-full h-full overflow-hidden">
          <FadeTransition transitionKey={currentIndex} duration={1500}>
            <img
              src={imageUrl}
              alt={currentItem?.title ?? t('widgets.wallpaper')}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </FadeTransition>
          {/* Image title overlay with gradient */}
          {currentItem?.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 py-4">
              <p className="text-white text-lg font-medium m-0 text-shadow-sm">
                {currentItem.title}
              </p>
            </div>
          )}
          {/* Pagination dots */}
          {activeItems.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {activeItems.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                      : 'bg-white/35'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <img
        src={imageUrl}
        alt={currentItem?.title ?? t('widgets.wallpaper')}
        className="w-full h-48 object-cover rounded"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  };

  // Large mode: glass container, no title bar
  if (large) {
    return (
      <div className={`flex flex-col h-full rounded-widget overflow-hidden glass-panel ${className}`}>
        {renderContent()}
      </div>
    );
  }

  // Small mode: use WidgetBox
  return null;
}
