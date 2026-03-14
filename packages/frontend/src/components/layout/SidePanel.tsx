import ShabbatWidget from '../widgets/ShabbatWidget';
import MessagesWidget from '../widgets/MessagesWidget';
import WallpaperWidget from '../widgets/WallpaperWidget';

/**
 * Right side panel (340px). Contains Shabbat + Messages + Wallpaper widgets.
 */
export default function SidePanel() {
  console.log('[SidePanel] Rendering...');
  return (
    <div className="flex flex-col gap-4 w-full h-full overflow-y-auto">
      <ShabbatWidget />
      <MessagesWidget />
      <WallpaperWidget />
    </div>
  );
}
