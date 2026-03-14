import { useTranslation } from 'react-i18next';
import { useSettings } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Premium building name banner — full-width dark glass bar.
 * Building name comes from settings API; displayed via i18n template.
 */
export default function BuildingHeader() {
  const { t } = useTranslation();
  const { data: settings, isLoading, isError } = useSettings();

  if (isLoading) {
    return (
      <div className="glass-dark flex justify-center py-3">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  const buildingName = isError
    ? t('common.defaultBuildingName')
    : settings?.buildingName || t('common.defaultBuildingName');

  return (
    <div className="glass-dark w-full px-8 py-4 text-center">
      <h1 className="text-building-name text-white m-0 tracking-wide text-shadow-md">
        {t('common.buildingHeader', { buildingName })}
      </h1>
    </div>
  );
}
