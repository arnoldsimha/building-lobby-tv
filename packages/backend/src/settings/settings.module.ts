import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SETTINGS_REPOSITORY } from '../common/interfaces/settings-repository.interface';
import { JsonSettingsRepository } from '../common/repositories/json-settings.repository';

@Module({
  controllers: [SettingsController],
  providers: [
    SettingsService,
    {
      provide: SETTINGS_REPOSITORY,
      useClass: JsonSettingsRepository,
    },
  ],
  exports: [SettingsService],
})
export class SettingsModule {}
