import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import {
  IMusicConfigRepository,
  MUSIC_REPOSITORY,
} from '../common/interfaces/music-repository.interface';

export interface MusicTrack {
  id: string;
  filename: string;
  title: string;
  artist: string;
}

export interface RadioStation {
  name: string;
  url: string;
}

export interface MusicConfig {
  enabled: boolean;
  volume: number;
  source: 'local' | 'radio' | 'custom';
  localPlaylist: MusicTrack[];
  radioStation: RadioStation;
  customStreamUrl: string | null;
  currentIndex: number;
  shuffle: boolean;
  autoplay: boolean;
}

@Injectable()
export class MusicService {
  private readonly logger = new Logger(MusicService.name);
  private readonly musicDir = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'music',
  );

  constructor(
    @Inject(MUSIC_REPOSITORY)
    private readonly musicRepository: IMusicConfigRepository,
  ) {}

  async getConfig(): Promise<MusicConfig> {
    this.logger.log('Getting music configuration');
    return this.musicRepository.get();
  }

  async updateConfig(config: Partial<MusicConfig>): Promise<MusicConfig> {
    this.logger.log('Updating music configuration');
    return this.musicRepository.update(config);
  }

  streamFile(filename: string, res: Response): void {
    const filePath = path.join(this.musicDir, filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Music file not found: ${filename}`);
    }

    const stat = fs.statSync(filePath);
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size,
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  }
}
