import { Pool } from 'pg';
import { Route } from '../../../core/domain/Route';
import { IComplianceRepository, IShipCompliance } from '../../../core/ports/compliance.repository';

// Helper function from our other repository. We can refactor this later.
const mapRowToRoute = (row: any): Route => {
  return {
    ...row,
    ghg_intensity: parseFloat(row.ghg_intensity),
    fuel_consumption_t: parseFloat(row.fuel_consumption_t),
    distance_km: parseFloat(row.distance_km),
    total_emissions_t: parseFloat(row.total_emissions_t),
  };
};
const mapRowToCompliance = (row: any): IShipCompliance => ({
  ship_id: row.ship_id,
  year: row.year,
  cb_gco2eq: parseFloat(row.cb_gco2eq)
});

export class PostgresComplianceRepository implements IComplianceRepository {
  constructor(private readonly pool: Pool) {}

  async getRouteByShipIdAndYear(shipId: string, year: number): Promise<Route | null> {
    const client = await this.pool.connect();
    try {
      // We assume shipId is the route_id for this project
      const result = await client.query(
        'SELECT * FROM routes WHERE route_id = $1 AND year = $2 LIMIT 1',
        [shipId, year]
      );
      if (result.rows.length === 0) {
        return null;
      }
      return mapRowToRoute(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async saveOrUpdateComplianceBalance(data: IShipCompliance): Promise<void> {
    const client = await this.pool.connect();
    const { ship_id, year, cb_gco2eq } = data;
    
    try {
      // This "UPSERT" command inserts a new record, or updates it if it already exists
      const query = `
        INSERT INTO ship_compliance (ship_id, year, cb_gco2eq)
        VALUES ($1, $2, $3)
        ON CONFLICT (ship_id, year) 
        DO UPDATE SET cb_gco2eq = $3, created_at = CURRENT_TIMESTAMP
      `;
      await client.query(query, [ship_id, year, cb_gco2eq]);
    } finally {
      client.release();
    }
  }
   async findComplianceBalance(shipId: string, year: number): Promise<IShipCompliance | null> {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        'SELECT * FROM ship_compliance WHERE ship_id = $1 AND year = $2',
        [shipId, year]
      );
      if (res.rows.length === 0) {
        return null;
      }
      return mapRowToCompliance(res.rows[0]);
    } finally {
      client.release();
    }
  }
}