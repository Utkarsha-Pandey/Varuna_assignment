import express from 'express';
import cors from 'cors';
import { pool } from '../db/postgres';

// --- Route imports ---
import { PostgresRouteRepository } from '../../adapters/outbound/postgres/postgres.route.repository';
import { RouteService } from '../../core/application/route.service';
import { RouteController } from '../../adapters/inbound/http/route.controller';

// --- Compliance imports ---
import { TargetService } from '../../core/application/target.service';
import { PostgresComplianceRepository } from '../../adapters/outbound/postgres/postgres.compliance.repository';
import { ComplianceService } from '../../core/application/compliance.service';
import { ComplianceController } from '../../adapters/inbound/http/compliance.controller';

// --- Banking imports ---
import { PostgresBankingRepository } from '../../adapters/outbound/postgres/postgres.banking.repository';
import { BankingService } from '../../core/application/banking.service';
import { BankingController } from '../../adapters/inbound/http/banking.controller';

// --- Pooling imports ---
import { PostgresPoolingRepository } from '../../adapters/outbound/postgres/postgres.pooling.repository';
import { PoolingService } from '../../core/application/pooling.service';
import { PoolingController } from '../../adapters/inbound/http/pooling.controller';

// =======================================================
// Dependency Injection Setup
// =======================================================

// 1. --- Route Dependencies ---
const routeRepository = new PostgresRouteRepository(pool);
const routeService = new RouteService(routeRepository);
const routeController = new RouteController(routeService);

// 2. --- Compliance Dependencies ---
const targetService = new TargetService();
const complianceRepository = new PostgresComplianceRepository(pool);

// 3. --- Banking Dependencies ---
const bankingRepository = new PostgresBankingRepository(pool);
const bankingService = new BankingService(bankingRepository, complianceRepository);
const bankingController = new BankingController(bankingService);

// ✅ Inject bankingRepository into complianceService
const complianceService = new ComplianceService(
  complianceRepository,
  targetService,
  bankingRepository
);
const complianceController = new ComplianceController(complianceService);

// 4. --- Pooling Dependencies ---
const poolingRepository = new PostgresPoolingRepository(pool);
const poolingService = new PoolingService(poolingRepository, complianceService);
const poolingController = new PoolingController(poolingService);
// --- END POOLING DEPENDENCIES ---

// =======================================================
// Express App Setup
// =======================================================
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Register routes
app.use('/', routeController.router);
app.use('/', complianceController.router);
app.use('/', bankingController.router);
app.use('/', poolingController.router); // ✅ Register pooling controller

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});
