import { Request, Response, Router } from 'express';
import { RouteService } from '../../../core/application/route.service';

export class RouteController {
  public router = Router();

  constructor(private readonly routeService: RouteService) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/routes', this.getAllRoutes);
    this.router.post('/routes/:id/baseline', this.setBaseline);
    // --- ADD THIS LINE ---
    this.router.get('/routes/comparison', this.getComparison);
  }

   private getAllRoutes = async (req: Request, res: Response) => {
    try {
      const routes = await this.routeService.getAllRoutes();
      res.status(200).json(routes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching routes' });
    }
  };

  // --- ADD THIS NEW HANDLER ---
  private setBaseline = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid route ID' });
      }

      await this.routeService.setRouteAsBaseline(id);
      res.status(200).json({ message: 'Baseline set successfully' });
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Error setting baseline';
      res.status(500).json({ message });
    }
  };

  // --- ADD THIS HANDLER ---
  private getComparison = async (req: Request, res: Response) => {
    try {
      const data = await this.routeService.getComparisonData();
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : 'Error fetching comparison data';
      // If no baseline is set, this will be a 500, which is fine
      res.status(500).json({ message });
    }
  };
}