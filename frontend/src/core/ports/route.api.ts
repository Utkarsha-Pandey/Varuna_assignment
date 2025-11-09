import { Route } from '../domain/route';

export interface IRouteApi {
  getAllRoutes(): Promise<Route[]>;
  // We'll add this later
  // setBaseline(routeId: number): Promise<void>; 
}