import express from 'express';
import { pool } from '../db/postgres'; // Our DB connection
import { PostgresRouteRepository } from '../../adapters/outbound/postgres/postgres.route.repository';
import { RouteService } from '../../core/application/route.service';
import { RouteController } from '../../adapters/inbound/http/route.controller';

// --- This is called "Dependency Injection" ---
// 1. Create the DB-dependent adapter (repository)
const routeRepository = new PostgresRouteRepository(pool);

// 2. Create the core service, injecting the repository
const routeService = new RouteService(routeRepository);

// 3. Create the HTTP controller, injecting the service
const routeController = new RouteController(routeService);
// --- End of Dependency Injection ---

// Create and configure the Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Register our routes
app.use('/', routeController.router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});