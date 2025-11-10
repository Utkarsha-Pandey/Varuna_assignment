import { IComplianceRepository, IShipCompliance } from '../ports/compliance.repository';
import { TargetService } from './target.service';
import { IBankingRepository } from '../ports/banking.repository';

export class ComplianceService {
  // Energy constant: 41,000 MJ/t
  private readonly ENERGY_CONVERSION_FACTOR_MJ_PER_T = 41000;

  constructor(
    private readonly complianceRepository: IComplianceRepository,
    private readonly targetService: TargetService,
    private readonly bankingRepository: IBankingRepository
  ) {}

  /**
   * Calculates, stores, and returns the Compliance Balance (CB) for a ship and year.
   */
  public async calculateAndStoreCB(shipId: string, year: number): Promise<IShipCompliance> {
    // 1. Get data for the calculation
    const route = await this.complianceRepository.getRouteByShipIdAndYear(shipId, year);
    if (!route) {
      throw new Error(`No route data found for ship ${shipId} in ${year}.`);
    }

    const actualIntensity = route.ghg_intensity;
    const fuelConsumption = route.fuel_consumption_t;

    // 2. Get the year's target
    const targetIntensity = this.targetService.getTargetIntensity(year);

    // 3. Apply Core Formulas
    // Energy in scope (MJ) = fuelConsumption × 41 000 MJ/t
    const energyInScope = fuelConsumption * this.ENERGY_CONVERSION_FACTOR_MJ_PER_T;

    // Compliance Balance = (Target − Actual) × Energy in scope
    const complianceBalance = (targetIntensity - actualIntensity) * energyInScope;

    const result: IShipCompliance = {
      ship_id: shipId,
      year: year,
      cb_gco2eq: parseFloat(complianceBalance.toFixed(2)), // Format to 2 decimal places
    };

    // 4. Store the snapshot in the database
    await this.complianceRepository.saveOrUpdateComplianceBalance(result);

    return result;
  }

  /**
   * Gets the adjusted compliance balance for a ship (CB after banking).
   */
  public async getAdjustedComplianceBalance(shipId: string, year: number): Promise<IShipCompliance> {
    // 1. Get the raw CB snapshot
    let cb = await this.complianceRepository.findComplianceBalance(shipId, year);

    // 2. If it hasn't been calculated, calculate it now.
    if (!cb) {
      console.log(`CB for ${shipId}/${year} not found, calculating...`);
      cb = await this.calculateAndStoreCB(shipId, year);
    }

    // 3. Get the total from the bank (applies to all years)
    const totalBanked = await this.bankingRepository.getTotalBanked(shipId);

    // 4. Return the adjusted CB
    return {
      ship_id: shipId,
      year: year,
      cb_gco2eq: parseFloat((cb.cb_gco2eq + totalBanked).toFixed(2)),
    };
  }
}
