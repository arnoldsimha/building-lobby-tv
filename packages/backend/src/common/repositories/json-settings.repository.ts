import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ISettingsRepository } from '../interfaces/settings-repository.interface';
import { Settings } from '../../settings/settings.service';

const DATA_FILE = path.join(__dirname, '..', '..', '..', 'data', 'settings.json');

const DEFAULT_SETTINGS: Settings = {
  buildingName: '',
  buildingAddress: '',
  language: 'he',
  location: { geonameid: 0, city: '' },
  news: { activeSource: '', refreshInterval: 900000 },
  display: {
    messageRotationInterval: 10000,
    wallpaperRotationInterval: 30000,
    shabbatCacheInterval: 86400000,
  },
  theme: {
    primaryColor: '#2563EB',
    accentColor: '#D97706',
    panelBackground: 'rgba(255, 255, 255, 0.85)',
    textColor: '#1F2937',
  },
};

@Injectable()
export class JsonSettingsRepository implements ISettingsRepository {
  private readonly logger = new Logger(JsonSettingsRepository.name);

  private async readData(): Promise<Settings> {
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        this.logger.warn('settings.json not found, returning defaults');
        return { ...DEFAULT_SETTINGS };
      }
      throw error;
    }
  }

  private async writeData(data: Settings): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  async get(): Promise<Settings> {
    return this.readData();
  }

  async update(settings: Partial<Settings>): Promise<Settings> {
    const current = await this.readData();
    const updated = this.deepMerge(current, settings);
    await this.writeData(updated);
    return updated;
  }

  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        target[key] &&
        typeof target[key] === 'object'
      ) {
        result[key] = this.deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
}
