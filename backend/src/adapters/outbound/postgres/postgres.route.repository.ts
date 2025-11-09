import { Pool } from 'pg';
import { Route } from '../../../core/domain/Route';
import { IRouteRepository } from '../../../core/ports/IRouteRepository';

export class PostgresRouteRepository implements IRouteRepository {
  // We pass in the actual database connection pool
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<Route[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM routes ORDER BY route_id');
      
      // Map database snake_case to our domain's camelCase (if they were different)
      // Here they are conveniently the same, but this is where mapping happens.
      // For this example, we'll map the decimal (string) to a number.
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
}