import { Pool } from 'pg';
import { BankEntry, IBankingRepository } from '../../../core/ports/banking.repository';

const mapRowToBankEntry = (row: any): BankEntry => ({
  id: row.id,
  ship_id: row.ship_id,
  year: row.year,
  amount_gco2eq: parseFloat(row.amount_gco2eq),
  created_at: row.created_at,
});

export class PostgresBankingRepository implements IBankingRepository {
  constructor(private readonly pool: Pool) {}

  async addBankEntry(shipId: string, year: number, amount: number): Promise<BankEntry> {
    const client = await this.pool.connect();
    try {
      const res = await client.query(
        'INSERT INTO bank_entries (ship_id, year, amount_gco2eq) VALUES ($1, $2, $3) RETURNING *',
        [shipId, year, amount]
      );
      return mapRowToBankEntry(res.rows[0]);
    } finally {
      client.release();
    }
  }

  async getBankEntries(shipId: string): Promise<BankEntry[]> {
    const client = await this.pool.connect();
    try {
      // Get all entries for this ship
      const res = await client.query(
        'SELECT * FROM bank_entries WHERE ship_id = $1 ORDER BY created_at DESC',
        [shipId]
      );
      return res.rows.map(mapRowToBankEntry);
    } finally {
      client.release();
    }
  }

  async getTotalBanked(shipId: string): Promise<number> {
    const client = await this.pool.connect();
    try {
      // Get the sum of all entries for this ship
      const res = await client.query(
        'SELECT COALESCE(SUM(amount_gco2eq), 0) as total FROM bank_entries WHERE ship_id = $1',
        [shipId]
      );
      return parseFloat(res.rows[0].total);
    } finally {
      client.release();
    }
  }
}