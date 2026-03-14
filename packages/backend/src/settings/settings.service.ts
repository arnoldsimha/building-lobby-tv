import { Injectable, Inject, Logger } from '@nestjs/common';
import {
  ISettingsRepository,
  SETTINGS_REPOSITORY,
} from '../common/interfaces/settings-repository.interface';

export interface Settings {
  buildingName: string;
  buildingAddress: string;
  language: string;
  location: {
    geonameid: number;
    city: string;
  };
  news: {
    activeSource: string;
    refreshInterval: number;
  };
  display: {
    messageRotationInterval: number;
    wallpaperRotationInterval: number;
    shabbatCacheInterval: number;
  };
  theme: {
    primaryColor: string;
    accentColor: string;
    panelBackground: string;
    textColor: string;
  };
}

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @Inject(SETTINGS_REPOSITORY)
    private readonly settingsRepository: ISettingsRepository,
  ) {}

  async getSettings(): Promise<Settings> {
    this.logger.log('Getting settings');
    return this.settingsRepository.get();
  }

  async updateSettings(settings: Partial<Settings>): Promise<Settings> {
    this.logger.log('Updating settings');
    return this.settingsRepository.update(settings);
  }
}
