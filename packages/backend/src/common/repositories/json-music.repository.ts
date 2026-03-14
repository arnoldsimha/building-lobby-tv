import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IMusicConfigRepository } from '../interfaces/music-repository.interface';
import { MusicConfig } from '../../music/music.service';

const DATA_FILE = path.join(__dirname, '..', '..', '..', 'data', 'music.json');

const DEFAULT_CONFIG: MusicConfig = {
  enabled: true,
  volume: 30,
  source: 'radio',
  localPlaylist: [],
  radioStation: { name: '', url: '' },
  customStreamUrl: null,
  currentIndex: 0,
  shuffle: false,
  autoplay: true,
};

@Injectable()
export class JsonMusicRepository implements IMusicConfigRepository {
  private readonly logger = new Logger(JsonMusicRepository.name);

  private async readData(): Promise<MusicConfig> {
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        this.logger.warn('music.json not found, returning defaults');
        return { ...DEFAULT_CONFIG };
      }
      throw error;
    }
  }

  private async writeData(data: MusicConfig): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  async get(): Promise<MusicConfig> {
    return this.readData();
  }

  async update(config: Partial<MusicConfig>): Promise<MusicConfig> {
    const current = await this.readData();
    const updated: MusicConfig = {
      ...current,
      ...config,
    };
    await this.writeData(updated);
    return updated;
  }
}
