import { Route } from './Route';

// One item in the comparison list
export interface ComparisonItem {
  route_id: string;
  year: number;
  ghgIntensity: number;
  percentDiff: number; // % diff from baseline
  compliant: boolean; // vs. 2025 target
}

// The full response object
export interface ComparisonData {
  baseline: Route;
  comparisons: ComparisonItem[];
  target: number;
}