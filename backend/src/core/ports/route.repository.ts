import { Route } from '../domain/Route';

export interface IRouteRepository {
  findAll(): Promise<Route[]>;
  setBaseline(id: number): Promise<void>;
  findBaseline(): Promise<Route | null>;
  findNonBaselines(): Promise<Route[]>;
}