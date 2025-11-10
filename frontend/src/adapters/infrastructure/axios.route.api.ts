import axios from 'axios';
import { Route } from '../../core/domain/route';
import { IRouteApi } from '../../core/ports/route.api';
import { ComparisonData } from '../../core/domain/comparison';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
});

export class AxiosRouteApi implements IRouteApi {
  async getAllRoutes(): Promise<Route[]> {
    // ... (this method remains unchanged)
    try {
      const response = await apiClient.get<Route[]>('/routes');
      //console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch routes:', error);
      return [];
    }
  }

  // --- ADD THIS NEW METHOD ---
  async setBaseline(id: number): Promise<void> {
    try {
      await apiClient.post(`/routes/${id}/baseline`);
    } catch (error) {
      console.error(`Failed to set baseline for route ${id}:`, error);
      // Re-throw to be caught by the component
      throw error; 
    }
  }

 async getComparisonData(): Promise<ComparisonData> {
    try {
      const response = await apiClient.get<ComparisonData>('/routes/comparison');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch comparison data:', error);
      // Re-throw to be caught by the component
      throw error;
    }
  }
}