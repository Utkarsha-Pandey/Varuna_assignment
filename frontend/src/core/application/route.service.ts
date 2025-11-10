import { Route } from '../domain/route';
import { IRouteApi } from '../ports/route.api';

export class RouteService {
  constructor(private readonly routeApi: IRouteApi) {}

  public async getRoutes(): Promise<Route[]> {
    return this.routeApi.getAllRoutes();
  }

  // --- ADD THIS NEW METHOD ---
  public async setBaseline(id: number): Promise<void> {
    try {
      return this.routeApi.setBaseline(id);
    } catch (error) {
      console.error('Service error setting baseline:', error);
      throw new Error('Failed to set baseline in service');
    }
  }
}