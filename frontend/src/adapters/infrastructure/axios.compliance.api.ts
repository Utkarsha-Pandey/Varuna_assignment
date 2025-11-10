import axios from 'axios';
import { IComplianceApi } from '../../core/ports/compliance.api';
import { IShipCompliance } from '../../core/domain/compliance';
import { BankingSummary, BankEntry } from '../../core/domain/banking';

// We can use the same API client from the routes API,
// but for separation, we'll define it again.
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
});

export class AxiosComplianceApi implements IComplianceApi {
  
  async getComplianceBalance(shipId: string, year: number): Promise<IShipCompliance> {
    try {
      const response = await apiClient.get<IShipCompliance>(
        `/compliance/cb?shipId=${shipId}&year=${year}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch compliance balance:', error);
      throw (error as any).response?.data || error;
    }
  }

  async getBankingSummary(shipId: string): Promise<BankingSummary> {
    try {
      const response = await apiClient.get<BankingSummary>(
        `/banking/records?shipId=${shipId}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch banking summary:', error);
      throw (error as any).response?.data || error;
    }
  }

  async bankSurplus(shipId: string, year: number): Promise<BankEntry> {
    try {
      const response = await apiClient.post<BankEntry>(
        `/banking/bank?shipId=${shipId}&year=${year}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to bank surplus:', error);
      throw (error as any).response?.data || error;
    }
  }

  async applyBankedSurplus(shipId: string, year: number, amount: number): Promise<BankEntry> {
    try {
      const response = await apiClient.post<BankEntry>(
        `/banking/apply?shipId=${shipId}&year=${year}`,
        { amount } // Send amount in the request body
      );
      return response.data;
    } catch (error) {
      console.error('Failed to apply surplus:', error);
      throw (error as any).response?.data || error;
    }
  }
}