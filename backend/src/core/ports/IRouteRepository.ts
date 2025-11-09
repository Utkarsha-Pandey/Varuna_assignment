import { Route } from '../domain/Route.js';

export interface IRouteRepository {
  /**
   * Finds all routes.
   * @returns A promise resolving to an array of routes.
   */
  findAll(): Promise<Route[]>;
}