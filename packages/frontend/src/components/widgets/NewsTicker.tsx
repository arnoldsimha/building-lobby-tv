import { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNews } from '../../hooks/useApi';

const SEPARATOR = ' │ ';
const GAP_PX = 120; // gap between the two copies

/**
 * Premium scrolling news headlines ticker (RTL marquee).
 * Uses two identical copies side-by-side; animates translateX by
 * exactly one copy-width so the loop is seamless.
 */
export default function NewsTicker() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useNews();
  const copyRef = useRef<HTMLSpanElement>(null);
  const [contentWidth, setContentWidth] = useState(0);

  // Format each headline with publication time (HH:MM)
  const headlines = data?.items?.map((item) => {
    let timeStr = '';
    try {
      const date = new Date(item.pubDate);
      if (!isNaN(date.getTime())) {
        timeStr = date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
      }
    } catch {
      // ignore invalid dates
    }
    return { time: timeStr, title: item.title };
  }) ?? [];
  const hasHeadlines = headlines.length > 0;

  const renderHeadlines = useCallback(
    () =>
      headlines.map((h, i) => (
        <span key={i}>
          {i > 0 && <span className="text-blue-400/60 mx-1">{SEPARATOR}</span>}
          {h.time && (
            <>
              <strong className="text-blue-300">{h.time}</strong>
              <span className="text-white/40"> — </span>
            </>
          )}
          <span className="text-white/90">{h.title}</span>
        </span>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(headlines)],
  );

  // Measure the width of one copy
  useEffect(() => {
    if (copyRef.current) {
      setContentWidth(copyRef.current.offsetWidth + GAP_PX);
    }
  }, [headlines]);

  if (isLoading) {
    return (
      <div className="flex items-center h-full px-4">
        <span className="text-news-ticker text-white/50">{t('common.loading')}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center h-full px-4">
        <span className="text-news-ticker text-red-400">{t('common.error')}</span>
      </div>
    );
  }

  if (!hasHeadlines) {
    return (
      <div className="flex items-center h-full px-4">
        <span className="text-news-ticker text-white/50">{t('news.noNews')}</span>
      </div>
    );
  }

  // Speed: ~30px/s  →  duration = contentWidth / 30
  const duration = Math.max(20, contentWidth / 30);

  return (
    <div className="relative h-full flex items-center overflow-hidden">
      <div
        className="whitespace-nowrap text-news-ticker flex"
        style={
          contentWidth > 0
            ? {
                animation: `ticker-scroll ${duration}s linear infinite`,
              }
            : undefined
        }
      >
        {/* Copy A – also used for measuring */}
        <span ref={copyRef} className="inline-block" style={{ paddingLeft: `${GAP_PX}px` }}>
          {renderHeadlines()}
        </span>
        {/* Copy B – seamless duplicate */}
        <span className="inline-block" style={{ paddingLeft: `${GAP_PX}px` }}>
          {renderHeadlines()}
        </span>
      </div>

      {/* Scoped keyframe that shifts by exactly one copy-width */}
      {contentWidth > 0 && (
        <style>{`
          @keyframes ticker-scroll {
            from { transform: translateX(0); }
            to   { transform: translateX(${contentWidth}px); }
          }
        `}</style>
      )}
    </div>
  );
}
