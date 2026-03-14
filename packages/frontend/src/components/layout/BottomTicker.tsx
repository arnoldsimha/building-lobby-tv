import { useTranslation } from 'react-i18next';
import NewsTicker from '../widgets/NewsTicker';

/**
 * Premium bottom ticker bar for news headlines.
 * Dark glass effect, full width.
 */
export default function BottomTicker() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center h-ticker w-full glass-dark">
      {/* Title tab with accent glow */}
      <div className="widget-header-gradient text-white flex items-center gap-2 text-widget-title h-full px-6 shrink-0 tracking-wider">
        <span>📰</span>
        <span className="font-bold uppercase">{t('widgets.news')}</span>
      </div>

      {/* Scrolling content area */}
      <div className="flex-1 overflow-hidden h-full">
        <NewsTicker />
      </div>
    </div>
  );
}
