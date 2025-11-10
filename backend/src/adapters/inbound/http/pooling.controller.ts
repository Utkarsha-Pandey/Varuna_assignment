import { Request, Response, Router } from 'express';
import { PoolingService } from '../../../core/application/pooling.service';

export class PoolingController {
  public router = Router();

  constructor(private readonly poolingService: PoolingService) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/pools', this.createPool);
  }

  private createPool = async (req: Request, res: Response) => {
    try {
      // Expects body: { year: 2024, members: [{ shipId: "R001" }, { shipId: "R002" }] }
      const { year, members } = req.body;

      if (!year || !members || !Array.isArray(members) || members.length < 2) {
        return res.status(400).json({ message: 'year and a members array of at least 2 ships are required' });
      }
      
      const result = await this.poolingService.createPool(year, members);
      res.status(201).json(result);

    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Error creating pool';
      if (message.includes('Pool is invalid')) {
        res.status(400).json({ message });
      } else {
        res.status(500).json({ message });
      }
    }
  };
}