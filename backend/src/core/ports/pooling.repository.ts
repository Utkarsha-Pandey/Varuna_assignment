import { PoolMember } from '../domain/pooling';

export interface IPoolingRepository {
  /**
   * Creates a pool and its members in a single transaction.
   * @param year The year of the pool.
   * @param members The list of members with their before/after balances.
   * @returns The created pool members.
   */
  createPool(year: number, members: PoolMember[]): Promise<PoolMember[]>;
}