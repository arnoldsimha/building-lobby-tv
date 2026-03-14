import { WallpaperConfig } from '../../wallpapers/wallpapers.service';

/**
 * Wallpaper configuration repository interface.
 * Manages the wallpaper config as a single document.
 */
export interface IWallpaperConfigRepository {
  /**
   * Get the current wallpaper configuration.
   */
  get(): Promise<WallpaperConfig>;

  /**
   * Update wallpaper configuration.
   * @param config - Partial wallpaper config to merge
   * @returns The updated wallpaper configuration
   */
  update(config: Partial<WallpaperConfig>): Promise<WallpaperConfig>;
}

/** Injection token for the Wallpaper repository */
export const WALLPAPER_REPOSITORY = 'WALLPAPER_REPOSITORY';
