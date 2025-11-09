import express from 'express';
import cors from 'cors'; // 
import { pool } from '../db/postgres';
import { PostgresRouteRepository } from '../../adapters/outbound/postgres/postgres.route.repository';
import { RouteService } from '../../core/application/route.service';
import { RouteController } from '../../adapters/inbound/http/route.controller';

// --- This is called "Dependency Injection" ---
const routeRepository = new PostgresRouteRepository(pool);
const routeService = new RouteService(routeRepository);
const routeController = new RouteController(routeService);

// Create and configure the Express app
const app = express();

// --- Add these lines ---
app.use(cors({
  origin: '*' // Allow requests from your Vite frontend
}));
// --- End of new lines ---

app.use(express.json()); 
app.use('/', routeController.router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});