import { Request, Response, Router } from 'express';
import { RouteService } from '../../../core/application/route.service';

export class RouteController {
  public router = Router();

  // We pass in the service (use case)
  constructor(private readonly routeService: RouteService) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/routes', this.getAllRoutes);
  }

  // Use arrow function to preserve 'this' context
  private getAllRoutes = async (req: Request, res: Response) => {
    try {
      const routes = await this.routeService.getAllRoutes();
      res.status(200).json(routes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching routes' });
    }
  };
}