import { Route } from '../domain/Route';
import { IRouteRepository } from '../ports/route.repository';

export class RouteService {
  constructor(private readonly routeRepository: IRouteRepository) {}

  public async getAllRoutes(): Promise<Route[]> {
    return this.routeRepository.findAll();
  }

  public async setRouteAsBaseline(id: number): Promise<void> {
    if (id <= 0) {
      throw new Error('Invalid route ID');
    }
    return this.routeRepository.setBaseline(id);
  }
}