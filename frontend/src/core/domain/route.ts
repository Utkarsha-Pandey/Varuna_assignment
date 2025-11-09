export interface Route {
  id: number;
  route_id: string;
  vessel_type: string;
  fuel_type: string;
  year: number;
  ghg_intensity: number;
  fuel_consumption_t: number;
  distance_km: number;
  total_emissions_t: number;
  is_baseline: boolean;
}