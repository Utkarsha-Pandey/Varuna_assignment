import { Request, Response, Router } from 'express';
import { ComplianceService } from '../../../core/application/compliance.service';

export class ComplianceController {
  public router = Router();

  constructor(private readonly complianceService: ComplianceService) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/compliance/cb', this.getComplianceBalance);
    this.router.get('/compliance/adjusted-cb', this.getAdjustedCB); // ✅ Added route
  }

  private getComplianceBalance = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        return res.status(400).json({ message: 'shipId and year query parameters are required' });
      }

      const yearNum = parseInt(year as string, 10);
      if (isNaN(yearNum)) {
        return res.status(400).json({ message: 'Invalid year' });
      }

      const result = await this.complianceService.calculateAndStoreCB(shipId as string, yearNum);
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : 'Error calculating compliance balance';
      res.status(500).json({ message });
    }
  };

  // ✅ Added handler for adjusted CB
  private getAdjustedCB = async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        return res.status(400).json({ message: 'shipId and year query parameters are required' });
      }

      const yearNum = parseInt(year as string, 10);
      if (isNaN(yearNum)) {
        return res.status(400).json({ message: 'Invalid year' });
      }

      const result = await this.complianceService.getAdjustedComplianceBalance(
        shipId as string,
        yearNum
      );
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Error calculating adjusted CB';
      res.status(500).json({ message });
    }
  };
}
