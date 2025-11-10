import { Route } from '../domain/Route';
import { IRouteRepository } from '../ports/route.repository';
import { ComparisonData, ComparisonItem } from '../domain/comparison';

export class RouteService {
  private readonly complianceTarget2025 = 89.3368;
  constructor(private readonly routeRepository: IRouteRepository) {}

  public async getAllRoutes(): Promise<Route[]> {
    return this.routeRepository.findAll();
  }

  public async setRouteAsBaseline(id: number): Promise<void> {
    if (id <= 0) {
      throw new Error('Invalid route ID');
    }
  }
    public async getComparisonData(): Promise<ComparisonData> {
    const baseline = await this.routeRepository.findBaseline();
    if (!baseline) {
      throw new Error('No baseline route set. Please set a baseline first.');
    }

    const comparisonRoutes = await this.routeRepository.findNonBaselines();
    const baselineIntensity = baseline.ghg_intensity;

    const comparisons: ComparisonItem[] = comparisonRoutes.map((route) => {
      const comparisonIntensity = route.ghg_intensity;

      // Formula: percentDiff = ((comparison / baseline) − 1) × 100
      const percentDiff = ((comparisonIntensity / baselineIntensity) - 1) * 100;

      // Check compliance against the 2025 target
      const compliant = comparisonIntensity <= this.complianceTarget2025;

      return {
        route_id: route.route_id,
        year: route.year,
        ghgIntensity: comparisonIntensity,
        percentDiff: parseFloat(percentDiff.toFixed(2)), // Clean up to 2 decimal places
        compliant: compliant,
      };
       });

    return {
      baseline: baseline,
      comparisons: comparisons,
      target: this.complianceTarget2025,
    };
  }
}