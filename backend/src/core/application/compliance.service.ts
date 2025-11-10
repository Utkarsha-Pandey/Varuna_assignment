import { IComplianceRepository, IShipCompliance } from '../ports/compliance.repository';
import { TargetService } from './target.service';

export class ComplianceService {
  // Energy constant: 41,000 MJ/t
  private readonly ENERGY_CONVERSION_FACTOR_MJ_PER_T = 41000;

  constructor(
    private readonly complianceRepository: IComplianceRepository,
    private readonly targetService: TargetService
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
      // Format to 2 decimal places
      cb_gco2eq: parseFloat(complianceBalance.toFixed(2)), 
    };

    // 4. Store the snapshot in the database
    await this.complianceRepository.saveOrUpdateComplianceBalance(result);

    return result;
  }
}