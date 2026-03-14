import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface Picture {
  id: string;
  url: string;
  title: string;
  active: boolean;
}

export interface PictureConfig {
  pictures: Picture[];
  rotationEnabled: boolean;
  rotationInterval: number;
}

@Injectable()
export class PicturesService {
  private readonly dataPath = path.join(process.cwd(), 'data', 'pictures.json');

  async getPictureConfig(): Promise<PictureConfig> {
    const raw = fs.readFileSync(this.dataPath, 'utf-8');
    return JSON.parse(raw);
  }

  async updatePictureConfig(config: PictureConfig): Promise<PictureConfig> {
    fs.writeFileSync(this.dataPath, JSON.stringify(config, null, 2), 'utf-8');
    return config;
  }
}
