import { Pool } from 'pg';
import { PoolMember } from '../../../core/domain/pooling';
import { IPoolingRepository } from '../../../core/ports/pooling.repository';

export class PostgresPoolingRepository implements IPoolingRepository {
  constructor(private readonly pool: Pool) {}

  async createPool(year: number, members: PoolMember[]): Promise<PoolMember[]> {
    const client = await this.pool.connect();
    try {
      // Start transaction
      await client.query('BEGIN');

      // 1. Create entry in pools table
      const poolRes = await client.query(
        'INSERT INTO pools (year) VALUES ($1) RETURNING id',
        [year]
      );
      const poolId = poolRes.rows[0].id;

      // 2. Create entries in pool_members table
      // We use a "multi-insert" query for efficiency
      const values: any[] = [];
      const queryParams: string[] = [];
      
      members.forEach((member, index) => {
        const i = index * 4; // Each member has 4 params
        queryParams.push(`($${i+1}, $${i+2}, $${i+3}, $${i+4})`);
        values.push(poolId, member.ship_id, member.cb_before, member.cb_after);
      });

      const insertQuery = `
        INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after)
        VALUES ${queryParams.join(', ')}
      `;

      await client.query(insertQuery, values);

      // Commit transaction
      await client.query('COMMIT');

      // Return the members list as confirmation
      return members;

    } catch (error) {
      // Rollback on error
      await client.query('ROLLBACK');
      console.error('Error in createPool transaction:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}