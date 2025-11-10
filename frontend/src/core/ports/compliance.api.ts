import { IShipCompliance } from '../domain/compliance';
import { BankingSummary, BankEntry } from '../domain/banking';
import { PoolMember } from '../domain/pooling'; // ✅ Added import

export interface IComplianceApi {
  /**
   * Calculates and fetches the CB for a ship/year.
   */
  getComplianceBalance(shipId: string, year: number): Promise<IShipCompliance>;

  /**
   * Fetches the banking history and total surplus for a ship.
   */
  getBankingSummary(shipId: string): Promise<BankingSummary>;

  /**
   * Calls the API to bank a ship's current surplus.
   */
  bankSurplus(shipId: string, year: number): Promise<BankEntry>;

  /**
   * Applies a specific amount of banked surplus to a deficit.
   */
  applyBankedSurplus(shipId: string, year: number, amount: number): Promise<BankEntry>;

  // --- NEW METHODS ADDED BELOW ---

  /**
   * Gets the adjusted CB for a ship (CB + net banking).
   */
  getAdjustedComplianceBalance(shipId: string, year: number): Promise<IShipCompliance>;

  /**
   * Submits a new pool to be created.
   */
  createPool(year: number, members: { shipId: string }[]): Promise<PoolMember[]>;
}
