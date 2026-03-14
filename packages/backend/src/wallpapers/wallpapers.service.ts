import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import * as path from 'path';
import * as fs from 'fs';
import * as https from 'https';
import {
  IWallpaperConfigRepository,
  WALLPAPER_REPOSITORY,
} from '../common/interfaces/wallpaper-repository.interface';

export interface Wallpaper {
  id: string;
  filename: string;
  title: string;
  active: boolean;
}

export interface UnsplashSettings {
  query: string;
  count: number;
}

export interface UnsplashPhoto {
  id: string;
  url: string;
  author: string;
  description: string;
}

export interface WallpaperConfig {
  source: 'local' | 'unsplash';
  unsplash?: UnsplashSettings;
  wallpapers: Wallpaper[];
  rotationEnabled: boolean;
  rotationInterval: number;
}

const CACHE_TTL = 60 * 60 * 1000; // 1 hour

@Injectable()
export class WallpapersService {
  private readonly logger = new Logger(WallpapersService.name);
  private readonly wallpapersDir = path.join(
    __dirname,
    '..',
    '..',
    'data',
    'wallpapers',
  );

  /** Cached Unsplash photos */
  private unsplashCache: UnsplashPhoto[] = [];
  private unsplashLastFetch = 0;

  constructor(
    @Inject(WALLPAPER_REPOSITORY)
    private readonly wallpaperRepository: IWallpaperConfigRepository,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getWallpaperConfig(): Promise<WallpaperConfig> {
    this.logger.log('Getting wallpaper configuration');
    return this.wallpaperRepository.get();
  }

  async updateWallpaperConfig(
    config: Partial<WallpaperConfig>,
  ): Promise<WallpaperConfig> {
    this.logger.log('Updating wallpaper configuration');
    return this.wallpaperRepository.update(config);
  }

  serveImage(filename: string, res: Response): void {
    const filePath = path.join(this.wallpapersDir, filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`Wallpaper image not found: ${filename}`);
    }

    res.sendFile(filePath);
  }

  /**
   * Fetch landscape photos from Unsplash API.
   * Only the API call is proxied to hide the access key.
   * Image URLs are returned directly (frontend loads them from Unsplash CDN).
   * Results are cached for 1 hour.
   */
  async getUnsplashPhotos(): Promise<UnsplashPhoto[]> {
    const accessKey = this.configService.get<string>('UNSPLASH_ACCESS_KEY');

    if (!accessKey) {
      this.logger.warn('UNSPLASH_ACCESS_KEY not set in .env');
      return [];
    }

    const now = Date.now();

    // Return cached photos if still fresh (1 hour)
    if (
      this.unsplashCache.length > 0 &&
      now - this.unsplashLastFetch < CACHE_TTL
    ) {
      this.logger.log(
        `Returning ${this.unsplashCache.length} cached Unsplash photos`,
      );
      return this.unsplashCache;
    }

    try {
      const config = await this.getWallpaperConfig();
      const unsplash = config.unsplash;
      const count = unsplash?.count || 10;
      const query = unsplash?.query || 'Israel Tel Aviv Jerusalem Haifa cityscape sea';
      const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${encodeURIComponent(query)}&count=${count}`;

      this.logger.log(
        `Fetching ${count} photos from Unsplash: query="${query}"`,
      );

      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            Authorization: `Client-ID ${accessKey}`,
            'Accept-Version': 'v1',
          },
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        }),
      );

      const photos: UnsplashPhoto[] = (
        Array.isArray(data) ? data : [data]
      ).map((photo: any) => ({
        id: photo.id,
        url: photo.urls?.regular || photo.urls?.full,
        author: photo.user?.name || 'Unknown',
        description:
          photo.description || photo.alt_description || 'Unsplash photo',
      }));

      this.unsplashCache = photos;
      this.unsplashLastFetch = now;

      this.logger.log(`Cached ${photos.length} Unsplash photos for 1 hour`);
      return photos;
    } catch (error: any) {
      this.logger.error(
        'Failed to fetch Unsplash photos',
        error?.response?.data || error?.message,
      );
      return this.unsplashCache; // Return stale cache on error
    }
  }
}
