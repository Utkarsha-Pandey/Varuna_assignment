import { Route } from '../domain/route';
import { IRouteApi } from '../ports/route.api';

export class RouteService {
  // We depend on the *interface* (port), not on axios
  constructor(private readonly routeApi: IRouteApi) {}

  public async getRoutes(): Promise<Route[]> {
    return this.routeApi.getAllRoutes();
  }
}