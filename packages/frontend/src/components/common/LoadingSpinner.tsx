import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-[3px]',
  lg: 'w-12 h-12 border-4',
};

/**
 * Loading indicator with spinning animation and localized text.
 * Tailwind-only styling.
 */
export default function LoadingSpinner({ size = 'md' }: LoadingSpinnerProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-2">
      <div className={`${SIZE_CLASSES[size]} border-blue-400 border-t-transparent rounded-full animate-spin`} />
      <span className="text-white/50 text-sm">{t('common.loading')}</span>
    </div>
  );
}
