import { IBankingRepository, BankEntry } from '../ports/banking.repository';
import { IComplianceRepository } from '../ports/compliance.repository';

export class BankingService {
  constructor(
    private readonly bankingRepo: IBankingRepository,
    private readonly complianceRepo: IComplianceRepository
  ) {}

  /**
   * Gets all bank records and the total available surplus for a ship.
   */
  public async getBankingSummary(shipId: string) {
    const records = await this.bankingRepo.getBankEntries(shipId);
    const totalAvailable = await this.bankingRepo.getTotalBanked(shipId);
    return { records, totalAvailable };
  }

  /**
   * Banks a ship's surplus for a given year.
   * Requires GET /compliance/cb to have been called first.
   */
  public async bankSurplus(shipId: string, year: number): Promise<BankEntry> {
    const cb = await this.complianceRepo.findComplianceBalance(shipId, year);
    
    if (!cb) {
      throw new Error(`Compliance Balance for ${shipId} in ${year} must be calculated first.`);
    }
    if (cb.cb_gco2eq <= 0) {
      throw new Error('No surplus to bank. CB is zero or negative.');
    }

    // Add a positive entry to the bank ledger
    return this.bankingRepo.addBankEntry(shipId, year, cb.cb_gco2eq);
  }

  /**
   * Applies a specific amount of banked surplus to a ship's deficit.
   * Requires GET /compliance/cb to have been called first.
   */
  public async applyBankedSurplus(shipId: string, year: number, amountToApply: number): Promise<BankEntry> {
    if (amountToApply <= 0) {
      throw new Error('Amount to apply must be a positive number.');
    }

    const cb = await this.complianceRepo.findComplianceBalance(shipId, year);
    if (!cb) {
      throw new Error(`Compliance Balance for ${shipId} in ${year} must be calculated first.`);
    }
    if (cb.cb_gco2eq >= 0) {
      throw new Error('Ship has no deficit. Cannot apply surplus.');
    }

    // Check if the bank has enough funds
    const totalBanked = await this.bankingRepo.getTotalBanked(shipId);
    if (amountToApply > totalBanked) {
      throw new Error(`Insufficient funds. Available: ${totalBanked}, Tried to apply: ${amountToApply}`);
    }

    // Check if they are trying to apply more than the deficit
    const deficit = Math.abs(cb.cb_gco2eq);
    if (amountToApply > deficit) {
      throw new Error(`Amount (${amountToApply}) exceeds deficit (${deficit}). Apply only what is needed.`);
    }

    // Add a negative entry (withdrawal) to the bank ledger
    return this.bankingRepo.addBankEntry(shipId, year, -amountToApply);
  }
}