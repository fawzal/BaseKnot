import {
  IResearchRepository,
  IFeatureRepository,
  ISitemapRepository,
  ITokenRepository,
  ITraceabilityRepository,
} from './api';
import {
  mockResearchRepository,
  mockFeatureRepository,
  mockSitemapRepository,
  mockTokenRepository,
  mockTraceabilityRepository,
} from './mock';
import {
  supabaseResearchRepository,
  supabaseFeatureRepository,
  supabaseSitemapRepository,
  supabaseTokenRepository,
  supabaseTraceabilityRepository,
  isSupabaseConfigured,
} from './supabase';
import {
  ResilientResearchRepository,
  ResilientFeatureRepository,
  ResilientSitemapRepository,
  ResilientTokenRepository,
  ResilientTraceabilityRepository,
} from './resilientRepositories';
import { ResearchService } from './researchService';
import { FeatureService } from './featureService';
import { SitemapService } from './sitemapService';
import { TokenService } from './tokenService';
import { TraceabilityService } from './traceabilityService';

export interface RepositoryBundle {
  researchRepo: IResearchRepository;
  featureRepo: IFeatureRepository;
  sitemapRepo: ISitemapRepository;
  tokenRepo: ITokenRepository;
  traceabilityRepo: ITraceabilityRepository;
}

export interface ServiceBundle {
  researchService: ResearchService;
  featureService: FeatureService;
  sitemapService: SitemapService;
  tokenService: TokenService;
  traceabilityService: TraceabilityService;
  isBackendConnected: boolean;
  repositories: RepositoryBundle;
}

export type FactoryMode = 'auto' | 'supabase' | 'mock';

/**
 * Service Factory creating decoupled domain services with chosen repository implementation.
 * - 'supabase': Pure Supabase repository
 * - 'mock': Pure LocalStorage mock repository
 * - 'auto': Uses Supabase if configured with resilient fallback to mock on error, else mock
 */
export function createServices(mode: FactoryMode = 'auto'): ServiceBundle {
  let repos: RepositoryBundle;
  const isConnected = isSupabaseConfigured;

  if (mode === 'supabase') {
    repos = {
      researchRepo: supabaseResearchRepository,
      featureRepo: supabaseFeatureRepository,
      sitemapRepo: supabaseSitemapRepository,
      tokenRepo: supabaseTokenRepository,
      traceabilityRepo: supabaseTraceabilityRepository,
    };
  } else if (mode === 'mock' || !isConnected) {
    repos = {
      researchRepo: mockResearchRepository,
      featureRepo: mockFeatureRepository,
      sitemapRepo: mockSitemapRepository,
      tokenRepo: mockTokenRepository,
      traceabilityRepo: mockTraceabilityRepository,
    };
  } else {
    // 'auto' mode with Supabase configured: Wrap with resilient fallback decorator
    repos = {
      researchRepo: new ResilientResearchRepository(
        supabaseResearchRepository,
        mockResearchRepository
      ),
      featureRepo: new ResilientFeatureRepository(
        supabaseFeatureRepository,
        mockFeatureRepository
      ),
      sitemapRepo: new ResilientSitemapRepository(
        supabaseSitemapRepository,
        mockSitemapRepository
      ),
      tokenRepo: new ResilientTokenRepository(
        supabaseTokenRepository,
        mockTokenRepository
      ),
      traceabilityRepo: new ResilientTraceabilityRepository(
        supabaseTraceabilityRepository,
        mockTraceabilityRepository
      ),
    };
  }

  const researchService = new ResearchService(repos.researchRepo);
  const featureService = new FeatureService(repos.featureRepo);
  const sitemapService = new SitemapService(repos.sitemapRepo);
  const tokenService = new TokenService(repos.tokenRepo);
  const traceabilityService = new TraceabilityService(
    repos.traceabilityRepo,
    repos.researchRepo,
    repos.featureRepo,
    repos.sitemapRepo,
    repos.tokenRepo
  );

  return {
    researchService,
    featureService,
    sitemapService,
    tokenService,
    traceabilityService,
    isBackendConnected: mode === 'mock' ? false : isConnected,
    repositories: repos,
  };
}

// Default application service bundle singleton
export const services = createServices('auto');
