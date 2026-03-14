import { Settings } from '../../settings/settings.service';

/**
 * Settings repository interface.
 * Settings is a singleton object - no CRUD collection operations.
 */
export interface ISettingsRepository {
  /**
   * Get the current settings object.
   */
  get(): Promise<Settings>;

  /**
   * Update settings with partial data (deep merge).
   * @param settings - Partial settings to merge
   * @returns The updated settings object
   */
  update(settings: Partial<Settings>): Promise<Settings>;
}

/** Injection token for the Settings repository */
export const SETTINGS_REPOSITORY = 'SETTINGS_REPOSITORY';
