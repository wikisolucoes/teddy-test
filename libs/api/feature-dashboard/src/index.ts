export * from './lib/feature-dashboard.module.js';

// Service
export { DashboardService } from './lib/application/services/dashboard.service.js';

// DTOs
export * from './lib/application/get-dashboard-stats/dtos/dashboard-stats.dto.js';
export * from './lib/application/get-latest-clients/dtos/latest-clients.dto.js';
export * from './lib/application/get-clients-chart-data/dtos/clients-chart-data.dto.js';

// Queries
export * from './lib/application/get-dashboard-stats/queries/get-dashboard-stats.query.js';
export * from './lib/application/get-latest-clients/queries/get-latest-clients.query.js';
export * from './lib/application/get-clients-chart-data/queries/get-clients-chart-data.query.js';
