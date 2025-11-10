import { Pool } from 'pg';
import { Route } from '../../../core/domain/Route';
import { IRouteRepository } from '../../../core/ports/route.repository';

export class PostgresRouteRepository implements IRouteRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<Route[]> {
    // ... (this method remains unchanged)
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM routes ORDER BY route_id');
      return result.rows.map(row => ({
        ...row,
        ghg_intensity: parseFloat(row.ghg_intensity),
        fuel_consumption_t: parseFloat(row.fuel_consumption_t),
        distance_km: parseFloat(row.distance_km),
        total_emissions_t: parseFloat(row.total_emissions_t),
      }));
    } finally {
      client.release();
    }
  }

  // --- ADD THIS NEW METHOD ---
  async setBaseline(id: number): Promise<void> {
    const client = await this.pool.connect();
    try {
      // Start a transaction
      await client.query('BEGIN');

      // 1. Set all routes to NOT be the baseline
      await client.query('UPDATE routes SET is_baseline = false');

      // 2. Set the specified route TO be the baseline
      const result = await client.query(
        'UPDATE routes SET is_baseline = true WHERE id = $1',
        [id]
      );

      if (result.rowCount === 0) {
        throw new Error(`Route with ID ${id} not found.`);
      }

      // Commit the transaction
      await client.query('COMMIT');
    } catch (error) {
      // If anything fails, roll back the transaction
      await client.query('ROLLBACK');
      console.error('Error in setBaseline transaction:', error);
      throw error; // Re-throw the error to be handled by the controller
    } finally {
      // Always release the client
      client.release();
    }
  }
}