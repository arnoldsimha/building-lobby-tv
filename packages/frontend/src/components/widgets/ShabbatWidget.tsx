import { useTranslation } from 'react-i18next';
import { useShabbatTimes } from '../../hooks/useApi';
import WidgetBox from '../common/WidgetBox';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Premium Shabbat times widget — candle lighting (enters) and havdalah (ends).
 * Title bar: 🕯️ זמני שבת
 */
export default function ShabbatWidget() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useShabbatTimes();

  const shabbatData = data?.data;

  // Format the Shabbat date (YYYY-MM-DD → dd/mm/yyyy) for the title bar
  const shabbatDateStr = (() => {
    if (!shabbatData?.date) return '';
    const [y, m, d] = shabbatData.date.split('-');
    if (!y || !m || !d) return '';
    return ` - ${d}/${m}/${y}`;
  })();

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner size="sm" />;
    }

    if (isError || !shabbatData) {
      return (
        <p className="text-white/50 text-base italic">
          {t('common.unavailable')}
        </p>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {/* Candle lighting — Shabbat enters */}
        {shabbatData.candleLighting && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <span className="text-xl">🕯️</span>
            </div>
            <div className="flex flex-col">
              <span className="text-widget-label text-white/60">{t('shabbat.candleLighting')}</span>
              <span className="text-widget-content text-white font-bold text-xl">{shabbatData.candleLighting}</span>
            </div>
          </div>
        )}

        {/* Havdalah — Shabbat ends */}
        {shabbatData.havdalah && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <span className="text-xl">✨</span>
            </div>
            <div className="flex flex-col">
              <span className="text-widget-label text-white/60">{t('shabbat.havdalah')}</span>
              <span className="text-widget-content text-white font-bold text-xl">{shabbatData.havdalah}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <WidgetBox icon="🕯️" title={`${t('widgets.shabbatTimes')}${shabbatDateStr}`}>
      {renderContent()}
    </WidgetBox>
  );
}
