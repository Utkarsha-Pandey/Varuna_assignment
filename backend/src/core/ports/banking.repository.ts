// Domain model for a single bank ledger entry
export interface BankEntry {
  id: number;
  ship_id: string;
  year: number;
  amount_gco2eq: number;
  created_at: Date;
}

export interface IBankingRepository {
  /**
   * Adds a new transaction entry (positive or negative) to the bank ledger.
   */
  addBankEntry(shipId: string, year: number, amount: number): Promise<BankEntry>;

  /**
   * Gets all bank ledger entries for a specific ship.
   */
  getBankEntries(shipId: string): Promise<BankEntry[]>;

  /**
   * Calculates the total available banked surplus for a ship (sum of all entries).
   */
  getTotalBanked(shipId: string): Promise<number>;
}