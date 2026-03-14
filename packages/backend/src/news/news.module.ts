import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    CacheModule.register(),
    SettingsModule,
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
