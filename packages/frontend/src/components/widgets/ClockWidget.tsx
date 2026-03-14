import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { HDate, gematriya, months } from '@hebcal/core';
import WidgetBox from '../common/WidgetBox';

/** Map JS Date.getDay() to i18n day keys */
const DAY_KEYS = [
  'days.sunday',
  'days.monday',
  'days.tuesday',
  'days.wednesday',
  'days.thursday',
  'days.friday',
  'days.saturday',
] as const;

/** Map JS Date.getMonth() to i18n month keys */
const MONTH_KEYS = [
  'months.january',
  'months.february',
  'months.march',
  'months.april',
  'months.may',
  'months.june',
  'months.july',
  'months.august',
  'months.september',
  'months.october',
  'months.november',
  'months.december',
] as const;

/** Map HebCal month numbers to i18n keys */
const HEBREW_MONTH_KEY_MAP: Record<number, string> = {
  [months.NISAN]: 'hebrewMonths.nisan',
  [months.IYYAR]: 'hebrewMonths.iyar',
  [months.SIVAN]: 'hebrewMonths.sivan',
  [months.TAMUZ]: 'hebrewMonths.tamuz',
  [months.AV]: 'hebrewMonths.av',
  [months.ELUL]: 'hebrewMonths.elul',
  [months.TISHREI]: 'hebrewMonths.tishrei',
  [months.CHESHVAN]: 'hebrewMonths.cheshvan',
  [months.KISLEV]: 'hebrewMonths.kislev',
  [months.TEVET]: 'hebrewMonths.tevet',
  [months.SHVAT]: 'hebrewMonths.shvat',
  [months.ADAR_I]: 'hebrewMonths.adarI',
  [months.ADAR_II]: 'hebrewMonths.adarII',
};

function formatHebrewYear(year: number): string {
  return gematriya(year);
}

function formatHebrewDay(day: number): string {
  return gematriya(day);
}

/**
 * Premium clock and date widget.
 * Large dramatic time display with elegant date info.
 */
export default function ClockWidget() {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = useCallback((date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }, []);

  const getGregorianDate = useCallback(
    (date: Date) => {
      const day = date.getDate();
      const month = t(MONTH_KEYS[date.getMonth()]);
      const year = date.getFullYear();
      return `${day} ${t('common.in')}${month} ${year}`;
    },
    [t],
  );

  const getHebrewDate = useCallback(
    (date: Date) => {
      try {
        const hdate = new HDate(date);
        const day = formatHebrewDay(hdate.getDate());
        const monthNum = hdate.getMonth();
        const isLeapYear = HDate.isLeapYear(hdate.getFullYear());
        let monthKey: string;
        if (monthNum === months.ADAR_I && !isLeapYear) {
          monthKey = 'hebrewMonths.adar';
        } else {
          monthKey = HEBREW_MONTH_KEY_MAP[monthNum] ?? 'hebrewMonths.adar';
        }
        const month = t(monthKey);
        const year = formatHebrewYear(hdate.getFullYear());
        return `${day} ${month} ${year}`;
      } catch (err) {
        console.warn('[ClockWidget] Hebrew date error:', err);
        return '';
      }
    },
    [t],
  );

  return (
    <WidgetBox icon="🕐" title={t('widgets.clock')} contentClassName="text-center !py-6">
      {/* Time — large dramatic display */}
      <div className="text-clock-time text-white leading-none mb-3 font-extrabold tracking-tight">
        {formatTime(now)}
      </div>

      {/* Divider line */}
      <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-3" />

      {/* Day of week */}
      <div className="text-day-of-week text-white/90 mb-1.5 font-semibold">
        {t(DAY_KEYS[now.getDay()])}
      </div>

      {/* Gregorian date */}
      <div className="text-date-text text-white/70 mb-1">
        {getGregorianDate(now)}
      </div>

      {/* Hebrew date */}
      <div className="text-date-text text-white/70">
        {getHebrewDate(now)}
      </div>
    </WidgetBox>
  );
}
