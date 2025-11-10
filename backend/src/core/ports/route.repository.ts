import { Route } from '../domain/Route';

export interface IRouteRepository {
  findAll(): Promise<Route[]>;
  setBaseline(id: number): Promise<void>;

  // --- ADD THESE TWO METHODS ---
  /**
   * Finds the single route marked as baseline.
   */
  findBaseline(): Promise<Route | null>;

  /**
   * Finds all routes NOT marked as baseline.
   */
  findNonBaselines(): Promise<Route[]>;
}