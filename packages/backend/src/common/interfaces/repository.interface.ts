/**
 * Generic repository interface for the Repository Pattern.
 * All entity repositories should implement this interface.
 *
 * Phase 1: JSON file-based implementations
 * Phase 2: DynamoDB implementations (swap via DI, zero service changes)
 */
export interface IRepository<T> {
  /**
   * Find all entities.
   */
  findAll(): Promise<T[]>;

  /**
   * Find a single entity by its ID.
   * @param id - The unique identifier
   * @returns The entity or null if not found
   */
  findById(id: string): Promise<T | null>;

  /**
   * Create a new entity.
   * @param entity - The entity data to create (without ID)
   * @returns The created entity with generated ID
   */
  create(entity: Partial<T>): Promise<T>;

  /**
   * Update an existing entity.
   * @param id - The unique identifier
   * @param entity - The partial entity data to update
   * @returns The updated entity
   */
  update(id: string, entity: Partial<T>): Promise<T>;

  /**
   * Delete an entity by its ID.
   * @param id - The unique identifier
   */
  delete(id: string): Promise<void>;
}
