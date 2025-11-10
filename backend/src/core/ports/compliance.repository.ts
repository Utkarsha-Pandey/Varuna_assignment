import { Route } from '../domain/Route';

export interface IShipCompliance {
  ship_id: string;
  year: number;
  cb_gco2eq: number;
}

export interface IComplianceRepository {
  getRouteByShipIdAndYear(shipId: string, year: number): Promise<Route | null>;
  saveOrUpdateComplianceBalance(data: IShipCompliance): Promise<void>;
  findComplianceBalance(shipId: string, year: number): Promise<IShipCompliance | null>;
}