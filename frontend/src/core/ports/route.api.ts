import { Route } from '../domain/route';
import { ComparisonData } from '../domain/comparison'; // <-- Import this

export interface IRouteApi {
  getAllRoutes(): Promise<Route[]>;
  setBaseline(id: number): Promise<void>;
  getComparisonData(): Promise<ComparisonData>;
}