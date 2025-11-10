import { Route } from '../domain/Route';

export interface IRouteRepository {
  /**
   * Finds all routes.
   * @returns A promise resolving to an array of routes.
   */
  findAll(): Promise<Route[]>;

  /**
   * Sets a specific route as the baseline.
   * This should set all other routes to is_baseline = false.
   * @param id The database primary key of the route.
   */
  setBaseline(id: number): Promise<void>;
}