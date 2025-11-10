import { Request, Response, Router } from 'express';
import { BankingService } from '../../../core/application/banking.service';

export class BankingController {
  public router = Router();

  constructor(private readonly bankingService: BankingService) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/banking/records', this.getBankingRecords);
    this.router.post('/banking/bank', this.bankSurplus);
    this.router.post('/banking/apply', this.applyBankedSurplus);
  }

  // Helper to extract common query params
  private getQueryContext = (req: Request): { shipId: string, yearNum: number } => {
    const { shipId, year } = req.query;
    if (!shipId) throw new Error('shipId query parameter is required');
    if (!year) throw new Error('year query parameter is required');
    
    const yearNum = parseInt(year as string, 10);
    if (isNaN(yearNum)) throw new Error('Invalid year');
    
    return { shipId: shipId as string, yearNum };
  };

  // Helper for consistent error handling
  private handleError = (error: unknown, res: Response) => {
    console.error(error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    
    // Send 400 Bad Request for known business logic failures
    if (error instanceof Error && (
      error.message.includes('Insufficient') || 
      error.message.includes('No surplus') ||
      error.message.includes('no deficit') ||
      error.message.includes('must be calculated first')
    )) {
      res.status(400).json({ message });
    } else {
      res.status(500).json({ message });
    }
  };

  private getBankingRecords = async (req: Request, res: Response) => {
    try {
      const { shipId } = req.query;
      if (!shipId) {
        return res.status(400).json({ message: 'shipId query parameter is required' });
      }
      const data = await this.bankingService.getBankingSummary(shipId as string);
      res.status(200).json(data);
    } catch (error) { 
      this.handleError(error, res); 
    }
  };

  private bankSurplus = async (req: Request, res: Response) => {
    try {
      const { shipId, yearNum } = this.getQueryContext(req);
      const entry = await this.bankingService.bankSurplus(shipId, yearNum);
      res.status(201).json(entry);
    } catch (error) { 
      this.handleError(error, res); 
    }
  };

  private applyBankedSurplus = async (req: Request, res: Response) => {
    try {
      const { shipId, yearNum } = this.getQueryContext(req);
      const { amount } = req.body; // e.g., { "amount": 1000000 }

      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ 
          message: 'A positive "amount" in the JSON body is required.' 
        });
      }
      
      const entry = await this.bankingService.applyBankedSurplus(shipId, yearNum, amount);
      res.status(201).json(entry);
    } catch (error) { 
      this.handleError(error, res); 
    }
  };
}