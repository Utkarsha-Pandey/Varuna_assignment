import express from 'express';
import cors from 'cors';
import { pool } from '../db/postgres';

// Route imports
import { PostgresRouteRepository } from '../../adapters/outbound/postgres/postgres.route.repository';
import { RouteService } from '../../core/application/route.service';
import { RouteController } from '../../adapters/inbound/http/route.controller';


import { TargetService } from '../../core/application/target.service';
import { PostgresComplianceRepository } from '../../adapters/outbound/postgres/postgres.compliance.repository';
import { ComplianceService } from '../../core/application/compliance.service';
import { ComplianceController } from '../../adapters/inbound/http/compliance.controller';
import { PostgresBankingRepository } from '../../adapters/outbound/postgres/postgres.banking.repository';
import { BankingService } from '../../core/application/banking.service';
import { BankingController } from '../../adapters/inbound/http/banking.controller';


// --- This is "Dependency Injection" ---

// 1. Route Dependencies
const routeRepository = new PostgresRouteRepository(pool);
const routeService = new RouteService(routeRepository);
const routeController = new RouteController(routeService);

// 2. --- ADD NEW DEPENDENCIES ---
const targetService = new TargetService(); // Has no dependencies
const complianceRepository = new PostgresComplianceRepository(pool);
const complianceService = new ComplianceService(complianceRepository, targetService);
const complianceController = new ComplianceController(complianceService);
// --- END NEW DEPENDENCIES ---
const bankingRepository = new PostgresBankingRepository(pool);
const bankingService = new BankingService(bankingRepository, complianceRepository);
const bankingController = new BankingController( bankingService);


// Create and configure the Express app
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Register our routes
app.use('/', routeController.router);
app.use('/', complianceController.router);
app.use('/', bankingController.router); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});