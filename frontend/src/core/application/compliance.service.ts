import { IComplianceApi } from '../ports/compliance.api';
import { IShipCompliance } from '../domain/compliance';
import { BankingSummary, BankEntry } from '../domain/banking';
import { PoolMember } from '../domain/pooling';

export class ComplianceService {
  constructor(private readonly complianceApi: IComplianceApi) {}

  public getComplianceBalance(shipId: string, year: number): Promise<IShipCompliance> {
    return this.complianceApi.getComplianceBalance(shipId, year);
  }

  public getBankingSummary(shipId: string): Promise<BankingSummary> {
    return this.complianceApi.getBankingSummary(shipId);
  }

  public bankSurplus(shipId: string, year: number): Promise<BankEntry> {
    return this.complianceApi.bankSurplus(shipId, year);
  }

  public applyBankedSurplus(shipId: string, year: number, amount: number): Promise<BankEntry> {
    return this.complianceApi.applyBankedSurplus(shipId, year, amount);
  }

   public getAdjustedComplianceBalance(shipId: string, year: number): Promise<IShipCompliance> {
    return this.complianceApi.getAdjustedComplianceBalance(shipId, year);
  }

  public createPool(year: number, members: { shipId: string }[]): Promise<PoolMember[]> {
    return this.complianceApi.createPool(year, members);
  }
}