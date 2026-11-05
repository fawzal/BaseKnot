import { ITraceabilityRepository } from './api/ITraceabilityRepository';
import { IResearchRepository } from './api/IResearchRepository';
import { IFeatureRepository } from './api/IFeatureRepository';
import { ISitemapRepository } from './api/ISitemapRepository';
import { ITokenRepository } from './api/ITokenRepository';
import { UXTraceabilityThread } from '@/types/database';

export interface BulkDeletePayload {
  researchIds: string[];
  featureIds: string[];
  sitemapIds: string[];
  tokenIds: string[];
}

export class TraceabilityService {
  constructor(
    private readonly traceabilityRepo: ITraceabilityRepository,
    private readonly researchRepo: IResearchRepository,
    private readonly featureRepo: IFeatureRepository,
    private readonly sitemapRepo: ISitemapRepository,
    private readonly tokenRepo: ITokenRepository
  ) {}

  async getFullTraceability(): Promise<UXTraceabilityThread[]> {
    return this.traceabilityRepo.getFullTraceability();
  }

  resetDefaults(): void {
    if (this.traceabilityRepo.resetDefaults) {
      this.traceabilityRepo.resetDefaults();
    }
  }

  /**
   * Bulk deletion coordinated across all 4 domain boundaries.
   * Executes in parallel to prevent waterfalls.
   */
  async bulkDelete(payload: BulkDeletePayload): Promise<void> {
    const { researchIds = [], featureIds = [], sitemapIds = [], tokenIds = [] } = payload;

    await Promise.all([
      ...researchIds.map((id) => this.researchRepo.delete(id)),
      ...featureIds.map((id) => this.featureRepo.delete(id)),
      ...sitemapIds.map((id) => this.sitemapRepo.delete(id)),
      ...tokenIds.map((id) => this.tokenRepo.delete(id)),
    ]);
  }
}
