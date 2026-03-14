import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ShabbatController } from './shabbat.controller';
import { ShabbatService } from './shabbat.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    HttpModule,
    CacheModule.register(),
    SettingsModule,
  ],
  controllers: [ShabbatController],
  providers: [ShabbatService],
  exports: [ShabbatService],
})
export class ShabbatModule {}
