import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { IMessageRepository } from '../interfaces/message-repository.interface';
import { Message } from '../../messages/messages.service';

const DATA_FILE = path.join(__dirname, '..', '..', '..', 'data', 'messages.json');

const DEFAULT_DATA: { messages: Message[] } = { messages: [] };

@Injectable()
export class JsonMessageRepository implements IMessageRepository {
  private readonly logger = new Logger(JsonMessageRepository.name);

  private async readData(): Promise<{ messages: Message[] }> {
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        this.logger.warn('messages.json not found, returning defaults');
        return { ...DEFAULT_DATA };
      }
      throw error;
    }
  }

  private async writeData(data: { messages: Message[] }): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  async findAll(): Promise<Message[]> {
    const data = await this.readData();
    return data.messages;
  }

  async findById(id: string): Promise<Message | null> {
    const data = await this.readData();
    return data.messages.find((m) => m.id === id) || null;
  }

  async findActive(): Promise<Message[]> {
    const data = await this.readData();
    const now = new Date().toISOString();
    return data.messages.filter(
      (m) => m.active && m.startDate <= now && m.endDate >= now,
    );
  }

  async create(entity: Partial<Message>): Promise<Message> {
    const data = await this.readData();
    const message: Message = {
      id: uuidv4(),
      title: entity.title || '',
      content: entity.content || '',
      type: entity.type || 'info',
      priority: entity.priority || 0,
      active: entity.active !== undefined ? entity.active : true,
      startDate: entity.startDate || new Date().toISOString(),
      endDate: entity.endDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    data.messages.push(message);
    await this.writeData(data);
    return message;
  }

  async update(id: string, entity: Partial<Message>): Promise<Message> {
    const data = await this.readData();
    const index = data.messages.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error(`Message with id ${id} not found`);
    }
    data.messages[index] = { ...data.messages[index], ...entity, id };
    await this.writeData(data);
    return data.messages[index];
  }

  async delete(id: string): Promise<void> {
    const data = await this.readData();
    const index = data.messages.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error(`Message with id ${id} not found`);
    }
    data.messages.splice(index, 1);
    await this.writeData(data);
  }
}
