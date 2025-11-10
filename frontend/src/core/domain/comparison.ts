import { Route } from './route';

// One item in the comparison list
export interface ComparisonItem {
  route_id: string;
  year: number;
  ghgIntensity: number;
  percentDiff: number;
  compliant: boolean;
}

// The full response object from the API
export interface ComparisonData {
  baseline: Route;
  comparisons: ComparisonItem[];
  target: number;
}