import { IRepository } from './repository.interface';
import { Message } from '../../messages/messages.service';

/**
 * Message-specific repository interface.
 * Extends the generic repository with message-specific queries.
 */
export interface IMessageRepository extends IRepository<Message> {
  /**
   * Find all currently active messages (active=true and within date range).
   */
  findActive(): Promise<Message[]>;
}

/** Injection token for the Message repository */
export const MESSAGE_REPOSITORY = 'MESSAGE_REPOSITORY';
