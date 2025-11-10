import { Route } from '../domain/route';

export interface IRouteApi {
  getAllRoutes(): Promise<Route[]>;
  /**
   * Sets a specific route as the baseline.
   * @param id The database primary key of the route.
   */
  setBaseline(id: number): Promise<void>;
}