// 1. Interfaces & Contracts
export * from './api';

// 2. Mock Repository Implementations
export * from './mock';

// 3. Supabase Repository Implementations & Client
export * from './supabase';

// 4. Resilient Decorators
export * from './resilientRepositories';

// 5. Domain Services
export * from './researchService';
export * from './featureService';
export * from './sitemapService';
export * from './tokenService';
export * from './traceabilityService';

// 6. Service Factory & Aggregated Data Service
export * from './serviceFactory';
export * from './dataService';

// 7. Convenient direct-access singletons wired to default service bundle
import { services } from './serviceFactory';

export const researchService = services.researchService;
export const featureService = services.featureService;
export const sitemapService = services.sitemapService;
export const tokenService = services.tokenService;
export const traceabilityService = services.traceabilityService;
export const isBackendConnected = () => services.isBackendConnected;
