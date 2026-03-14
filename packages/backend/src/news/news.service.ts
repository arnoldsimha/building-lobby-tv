import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as https from 'https';
import { SettingsService } from '../settings/settings.service';
import { NewsItemDto, NewsResponseDto, NewsSourceDto } from './dto/news.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Parser = require('rss-parser');

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const CACHE_KEY_PREFIX = 'news:';

const AVAILABLE_SOURCES: NewsSourceDto[] = [
  {
    key: 'ynet',
    name: 'Ynet',
    url: 'https://www.ynet.co.il/Integration/StoryRss2.xml',
    category: 'General news',
  },
  {
    key: 'walla-news',
    name: 'Walla News',
    url: 'https://rss.walla.co.il/feed/1',
    category: 'Breaking news',
  },
  {
    key: 'walla-headlines',
    name: 'Walla Headlines',
    url: 'https://rss.walla.co.il/feed/22',
    category: 'Top headlines',
  },
  {
    key: 'maariv',
    name: 'Maariv',
    url: 'https://www.maariv.co.il/Rss/RssFeedsMivzak662',
    category: 'Breaking news',
  },
];

@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);
  private readonly parser = new Parser({
    requestOptions: {
      agent: new https.Agent({ rejectUnauthorized: false }),
    },
  });

  constructor(
    private readonly settingsService: SettingsService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getHeadlines(): Promise<NewsResponseDto> {
    const sourceKey = await this.getActiveSourceKey();
    const cacheKey = `${CACHE_KEY_PREFIX}${sourceKey}`;

    const cached = await this.cacheManager.get<NewsResponseDto>(cacheKey);
    if (cached) {
      this.logger.log(`Returning cached news for source: ${sourceKey}`);
      return cached;
    }

    const source = AVAILABLE_SOURCES.find((s) => s.key === sourceKey);
    if (!source) {
      this.logger.warn(`Unknown news source: ${sourceKey}, falling back to ynet`);
      return this.fetchAndCacheNews(
        AVAILABLE_SOURCES[0],
        `${CACHE_KEY_PREFIX}${AVAILABLE_SOURCES[0].key}`,
      );
    }

    return this.fetchAndCacheNews(source, cacheKey);
  }

  getSources(): NewsSourceDto[] {
    return AVAILABLE_SOURCES;
  }

  private async fetchAndCacheNews(
    source: NewsSourceDto,
    cacheKey: string,
  ): Promise<NewsResponseDto> {
    try {
      this.logger.log(`Fetching RSS feed from: ${source.name} (${source.url})`);
      const feed = await this.parser.parseURL(source.url);

      const items: NewsItemDto[] = (feed.items || []).map((item: any) => ({
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || '',
        source: source.name,
      }));

      const response: NewsResponseDto = {
        items,
        source: source.key,
        fetchedAt: new Date().toISOString(),
      };

      await this.cacheManager.set(cacheKey, response, CACHE_TTL_MS);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to fetch RSS feed from ${source.name}`,
        error?.message,
      );

      return {
        items: [],
        source: source.key,
        fetchedAt: new Date().toISOString(),
      };
    }
  }

  private async getActiveSourceKey(): Promise<string> {
    try {
      const settings = await this.settingsService.getSettings();
      return settings.news?.activeSource || 'ynet';
    } catch {
      return 'ynet';
    }
  }
}
