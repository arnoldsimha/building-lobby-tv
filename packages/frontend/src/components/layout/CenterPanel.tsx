import WallpaperWidget from '../widgets/WallpaperWidget';

/**
 * Center panel (≈50% width). Uses WallpaperWidget with pictures data source
 * for displaying holiday/celebration images.
 */
export default function CenterPanel() {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <WallpaperWidget large dataSource="pictures" />
    </div>
  );
}
