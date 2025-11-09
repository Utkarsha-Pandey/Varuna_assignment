import { Route } from '../domain/Route';
import { IRouteRepository } from '../ports/IRouteRepository';

export class RouteService {
  // We depend on the *interface* (port), not the concrete implementation
  constructor(private readonly routeRepository: IRouteRepository) {}

  public async getAllRoutes(): Promise<Route[]> {
    return this.routeRepository.findAll();
  }
}