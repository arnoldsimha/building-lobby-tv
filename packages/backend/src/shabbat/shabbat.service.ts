import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as https from 'https';
import { SettingsService } from '../settings/settings.service';
import { ShabbatTimesDto } from './dto/shabbat.dto';

const HEBCAL_BASE_URL = 'https://www.hebcal.com/shabbat';
const DEFAULT_GEONAMEID = 293397;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_KEY_CURRENT = 'shabbat:current';
const CACHE_KEY_UPCOMING = 'shabbat:upcoming';

interface HebCalItem {
  title: string;
  title_orig?: string;
  category: string;
  date: string;
  hebrew?: string;
  memo?: string;
}

interface HebCalResponse {
  title: string;
  date: string;
  items: HebCalItem[];
}

@Injectable()
export class ShabbatService {
  private readonly logger = new Logger(ShabbatService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly settingsService: SettingsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getShabbatTimes(): Promise<ShabbatTimesDto | null> {
    const cached = await this.cacheManager.get<ShabbatTimesDto>(CACHE_KEY_CURRENT);
    if (cached) {
      this.logger.log('Returning cached Shabbat times');
      return cached;
    }

    try {
      this.logger.log('Fetching current Shabbat times from HebCal');
      const geonameid = await this.getGeonameid();
      const url = `${HEBCAL_BASE_URL}?cfg=json&geonameid=${geonameid}&M=on`;

      const response = await firstValueFrom(
        this.httpService.get<HebCalResponse>(url, {
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        }),
      );

      const shabbatTimes = this.parseHebCalResponse(response.data);

      if (shabbatTimes) {
        await this.cacheManager.set(CACHE_KEY_CURRENT, shabbatTimes, CACHE_TTL_MS);
      }

      return shabbatTimes;
    } catch (error) {
      this.logger.error('Failed to fetch Shabbat times', error?.message);
      return null;
    }
  }

  async getUpcoming(): Promise<ShabbatTimesDto[]> {
    const cached = await this.cacheManager.get<ShabbatTimesDto[]>(CACHE_KEY_UPCOMING);
    if (cached) {
      this.logger.log('Returning cached upcoming Shabbat times');
      return cached;
    }

    try {
      this.logger.log('Fetching upcoming Shabbat times from HebCal');
      const geonameid = await this.getGeonameid();
      const results: ShabbatTimesDto[] = [];

      // Fetch next 4 weeks by requesting with specific dates
      const now = new Date();
      for (let week = 0; week < 4; week++) {
        const targetDate = new Date(now);
        targetDate.setDate(targetDate.getDate() + week * 7);

        const gy = targetDate.getFullYear();
        const gm = targetDate.getMonth() + 1;
        const gd = targetDate.getDate();

        const url = `${HEBCAL_BASE_URL}?cfg=json&geonameid=${geonameid}&M=on&gy=${gy}&gm=${gm}&gd=${gd}`;

        const response = await firstValueFrom(
          this.httpService.get<HebCalResponse>(url, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
          }),
        );

        const shabbatTimes = this.parseHebCalResponse(response.data);
        if (shabbatTimes) {
          // Avoid duplicates by checking date
          const exists = results.some((r) => r.date === shabbatTimes.date);
          if (!exists) {
            results.push(shabbatTimes);
          }
        }
      }

      await this.cacheManager.set(CACHE_KEY_UPCOMING, results, CACHE_TTL_MS);
      return results;
    } catch (error) {
      this.logger.error(
        'Failed to fetch upcoming Shabbat times',
        error?.message,
      );
      return [];
    }
  }

  private parseHebCalResponse(data: HebCalResponse): ShabbatTimesDto | null {
    if (!data?.items?.length) {
      return null;
    }

    const candleLightingItem = data.items.find(
      (item) => item.category === 'candles',
    );
    const havdalahItem = data.items.find(
      (item) => item.category === 'havdalah',
    );
    const parashaItem = data.items.find(
      (item) => item.category === 'parashat',
    );

    if (!candleLightingItem) {
      return null;
    }

    const candleLightingTime = this.extractTime(candleLightingItem.date);
    const havdalahTime = havdalahItem
      ? this.extractTime(havdalahItem.date)
      : '';

    // Extract parasha name - title is like "Parashat Vayikra"
    const parashaEnglish = parashaItem
      ? parashaItem.title.replace('Parashat ', '').replace('Parshat ', '')
      : '';
    const parasha = parashaItem?.hebrew || parashaEnglish;

    // Get the Shabbat date from candle lighting item
    const shabbatDate = candleLightingItem.date
      ? candleLightingItem.date.substring(0, 10)
      : '';

    return {
      candleLighting: candleLightingTime,
      havdalah: havdalahTime,
      parasha,
      parashaEnglish,
      date: shabbatDate,
    };
  }

  private extractTime(isoDateString: string): string {
    try {
      const date = new Date(isoDateString);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return '';
    }
  }

  private async getGeonameid(): Promise<number> {
    try {
      const settings = await this.settingsService.getSettings();
      return settings.location?.geonameid || DEFAULT_GEONAMEID;
    } catch {
      return DEFAULT_GEONAMEID;
    }
  }
}
