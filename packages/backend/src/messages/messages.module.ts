import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MESSAGE_REPOSITORY } from '../common/interfaces/message-repository.interface';
import { JsonMessageRepository } from '../common/repositories/json-message.repository';

@Module({
  controllers: [MessagesController],
  providers: [
    MessagesService,
    {
      provide: MESSAGE_REPOSITORY,
      useClass: JsonMessageRepository,
    },
  ],
  exports: [MessagesService],
})
export class MessagesModule {}
