import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IWallpaperConfigRepository } from '../interfaces/wallpaper-repository.interface';
import { WallpaperConfig } from '../../wallpapers/wallpapers.service';

const DATA_FILE = path.join(__dirname, '..', '..', '..', 'data', 'wallpapers.json');

const DEFAULT_CONFIG: WallpaperConfig = {
  source: 'local',
  wallpapers: [],
  rotationEnabled: true,
  rotationInterval: 30000,
};

@Injectable()
export class JsonWallpaperRepository implements IWallpaperConfigRepository {
  private readonly logger = new Logger(JsonWallpaperRepository.name);

  private async readData(): Promise<WallpaperConfig> {
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        this.logger.warn('wallpapers.json not found, returning defaults');
        return { ...DEFAULT_CONFIG };
      }
      throw error;
    }
  }

  private async writeData(data: WallpaperConfig): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  async get(): Promise<WallpaperConfig> {
    return this.readData();
  }

  async update(config: Partial<WallpaperConfig>): Promise<WallpaperConfig> {
    const current = await this.readData();
    const updated: WallpaperConfig = {
      ...current,
      ...config,
      wallpapers: config.wallpapers !== undefined ? config.wallpapers : current.wallpapers,
    };
    await this.writeData(updated);
    return updated;
  }
}
