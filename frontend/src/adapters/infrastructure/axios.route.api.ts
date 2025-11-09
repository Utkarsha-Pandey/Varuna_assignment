import axios from 'axios';
import { Route } from '../../core/domain/route';
import { IRouteApi } from '../../core/ports/route.api';

// This is our connection to the real backend
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
});

export class AxiosRouteApi implements IRouteApi {
  async getAllRoutes(): Promise<Route[]> {
    try {
      const response = await apiClient.get<Route[]>('/routes');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch routes:', error);
      return []; // Return empty on error
    }
  }
}