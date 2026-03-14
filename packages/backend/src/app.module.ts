import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MessagesModule } from './messages/messages.module';
import { ShabbatModule } from './shabbat/shabbat.module';
import { NewsModule } from './news/news.module';
import { WallpapersModule } from './wallpapers/wallpapers.module';
import { PicturesModule } from './pictures/pictures.module';
import { MusicModule } from './music/music.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    MessagesModule,
    ShabbatModule,
    NewsModule,
    WallpapersModule,
    PicturesModule,
    MusicModule,
    SettingsModule,
  ],
})
export class AppModule {}
