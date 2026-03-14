import { MusicConfig } from '../../music/music.service';

/**
 * Music configuration repository interface.
 * Manages the music config as a single document.
 */
export interface IMusicConfigRepository {
  /**
   * Get the current music configuration.
   */
  get(): Promise<MusicConfig>;

  /**
   * Update music configuration.
   * @param config - Partial music config to merge
   * @returns The updated music configuration
   */
  update(config: Partial<MusicConfig>): Promise<MusicConfig>;
}

/** Injection token for the Music repository */
export const MUSIC_REPOSITORY = 'MUSIC_REPOSITORY';
