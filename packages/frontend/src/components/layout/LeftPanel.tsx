import ClockWidget from '../widgets/ClockWidget';
import ShabbatWidget from '../widgets/ShabbatWidget';

/**
 * Left panel (≈22% width) — visually RIGHT in RTL layout.
 * Contains Clock + Shabbat widgets.
 */
export default function LeftPanel() {
  return (
    <div className="flex flex-col gap-4 w-full h-full overflow-y-auto">
      <ClockWidget />
      <ShabbatWidget />
    </div>
  );
}
