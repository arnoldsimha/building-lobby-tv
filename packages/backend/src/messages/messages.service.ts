import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import {
  IMessageRepository,
  MESSAGE_REPOSITORY,
} from '../common/interfaces/message-repository.interface';

export interface Message {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'urgent' | 'event';
  priority: number;
  active: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
}

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
  ) {}

  async findAll(): Promise<Message[]> {
    this.logger.log('Finding all messages');
    return this.messageRepository.findAll();
  }

  async findById(id: string): Promise<Message | null> {
    this.logger.log(`Finding message by id: ${id}`);
    const message = await this.messageRepository.findById(id);
    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }
    return message;
  }

  async findActive(): Promise<Message[]> {
    this.logger.log('Finding active messages');
    return this.messageRepository.findActive();
  }

  async create(message: Partial<Message>): Promise<Message> {
    this.logger.log('Creating message');
    return this.messageRepository.create(message);
  }

  async update(id: string, message: Partial<Message>): Promise<Message> {
    this.logger.log(`Updating message: ${id}`);
    return this.messageRepository.update(id, message);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting message: ${id}`);
    return this.messageRepository.delete(id);
  }
}
