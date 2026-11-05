import {
  IResearchRepository,
  IFeatureRepository,
  ISitemapRepository,
  ITokenRepository,
  ITraceabilityRepository,
} from './api';
import { UXResearch, UXFeature, UXSitemap, UXUIToken, UXTraceabilityThread } from '@/types/database';

export class ResilientResearchRepository implements IResearchRepository {
  constructor(
    private readonly primary: IResearchRepository,
    private readonly fallback: IResearchRepository
  ) {}

  async getAll(): Promise<UXResearch[]> {
    try {
      return await this.primary.getAll();
    } catch (e: any) {
      console.warn('[ResilientResearchRepository] Primary failed, using fallback:', e?.message || e);
      return this.fallback.getAll();
    }
  }

  async getById(id: string): Promise<UXResearch | null> {
    try {
      return await this.primary.getById(id);
    } catch (e: any) {
      console.warn('[ResilientResearchRepository] Primary getById failed, using fallback:', e?.message || e);
      return this.fallback.getById(id);
    }
  }

  async create(insightText: string): Promise<UXResearch> {
    try {
      return await this.primary.create(insightText);
    } catch (e: any) {
      console.warn('[ResilientResearchRepository] Primary create failed, using fallback:', e?.message || e);
      return this.fallback.create(insightText);
    }
  }

  async update(id: string, insightText: string): Promise<UXResearch | null> {
    try {
      return await this.primary.update(id, insightText);
    } catch (e: any) {
      console.warn('[ResilientResearchRepository] Primary update failed, using fallback:', e?.message || e);
      return this.fallback.update(id, insightText);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.primary.delete(id);
    } catch (e: any) {
      console.warn('[ResilientResearchRepository] Primary delete failed, using fallback:', e?.message || e);
      await this.fallback.delete(id);
    }
  }
}

export class ResilientFeatureRepository implements IFeatureRepository {
  constructor(
    private readonly primary: IFeatureRepository,
    private readonly fallback: IFeatureRepository
  ) {}

  async getAll(): Promise<UXFeature[]> {
    try {
      return await this.primary.getAll();
    } catch (e: any) {
      console.warn('[ResilientFeatureRepository] Primary failed, using fallback:', e?.message || e);
      return this.fallback.getAll();
    }
  }

  async getById(id: string): Promise<UXFeature | null> {
    try {
      return await this.primary.getById(id);
    } catch (e: any) {
      console.warn('[ResilientFeatureRepository] Primary getById failed, using fallback:', e?.message || e);
      return this.fallback.getById(id);
    }
  }

  async create(featureName: string, researchId: string, description?: string): Promise<UXFeature> {
    try {
      return await this.primary.create(featureName, researchId, description);
    } catch (e: any) {
      console.warn('[ResilientFeatureRepository] Primary create failed, using fallback:', e?.message || e);
      return this.fallback.create(featureName, researchId, description);
    }
  }

  async update(id: string, featureName: string, description?: string): Promise<UXFeature | null> {
    try {
      return await this.primary.update(id, featureName, description);
    } catch (e: any) {
      console.warn('[ResilientFeatureRepository] Primary update failed, using fallback:', e?.message || e);
      return this.fallback.update(id, featureName, description);
    }
  }

  async updateParent(id: string, researchId: string | null): Promise<UXFeature | null> {
    try {
      return await this.primary.updateParent(id, researchId);
    } catch (e: any) {
      console.warn('[ResilientFeatureRepository] Primary updateParent failed, using fallback:', e?.message || e);
      return this.fallback.updateParent(id, researchId);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.primary.delete(id);
    } catch (e: any) {
      console.warn('[ResilientFeatureRepository] Primary delete failed, using fallback:', e?.message || e);
      await this.fallback.delete(id);
    }
  }
}

export class ResilientSitemapRepository implements ISitemapRepository {
  constructor(
    private readonly primary: ISitemapRepository,
    private readonly fallback: ISitemapRepository
  ) {}

  async getAll(): Promise<UXSitemap[]> {
    try {
      return await this.primary.getAll();
    } catch (e: any) {
      console.warn('[ResilientSitemapRepository] Primary failed, using fallback:', e?.message || e);
      return this.fallback.getAll();
    }
  }

  async getById(id: string): Promise<UXSitemap | null> {
    try {
      return await this.primary.getById(id);
    } catch (e: any) {
      console.warn('[ResilientSitemapRepository] Primary getById failed, using fallback:', e?.message || e);
      return this.fallback.getById(id);
    }
  }

  async create(pageName: string, hierarchyLevel: string, featureId: string): Promise<UXSitemap> {
    try {
      return await this.primary.create(pageName, hierarchyLevel, featureId);
    } catch (e: any) {
      console.warn('[ResilientSitemapRepository] Primary create failed, using fallback:', e?.message || e);
      return this.fallback.create(pageName, hierarchyLevel, featureId);
    }
  }

  async update(id: string, pageName: string, hierarchyLevel: string): Promise<UXSitemap | null> {
    try {
      return await this.primary.update(id, pageName, hierarchyLevel);
    } catch (e: any) {
      console.warn('[ResilientSitemapRepository] Primary update failed, using fallback:', e?.message || e);
      return this.fallback.update(id, pageName, hierarchyLevel);
    }
  }

  async updateParent(id: string, featureId: string | null): Promise<UXSitemap | null> {
    try {
      return await this.primary.updateParent(id, featureId);
    } catch (e: any) {
      console.warn('[ResilientSitemapRepository] Primary updateParent failed, using fallback:', e?.message || e);
      return this.fallback.updateParent(id, featureId);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.primary.delete(id);
    } catch (e: any) {
      console.warn('[ResilientSitemapRepository] Primary delete failed, using fallback:', e?.message || e);
      await this.fallback.delete(id);
    }
  }
}

export class ResilientTokenRepository implements ITokenRepository {
  constructor(
    private readonly primary: ITokenRepository,
    private readonly fallback: ITokenRepository
  ) {}

  async getAll(): Promise<UXUIToken[]> {
    try {
      return await this.primary.getAll();
    } catch (e: any) {
      console.warn('[ResilientTokenRepository] Primary failed, using fallback:', e?.message || e);
      return this.fallback.getAll();
    }
  }

  async getById(id: string): Promise<UXUIToken | null> {
    try {
      return await this.primary.getById(id);
    } catch (e: any) {
      console.warn('[ResilientTokenRepository] Primary getById failed, using fallback:', e?.message || e);
      return this.fallback.getById(id);
    }
  }

  async create(componentType: string, designToken: string, sitemapId: string): Promise<UXUIToken> {
    try {
      return await this.primary.create(componentType, designToken, sitemapId);
    } catch (e: any) {
      console.warn('[ResilientTokenRepository] Primary create failed, using fallback:', e?.message || e);
      return this.fallback.create(componentType, designToken, sitemapId);
    }
  }

  async update(id: string, componentType: string, designToken: string): Promise<UXUIToken | null> {
    try {
      return await this.primary.update(id, componentType, designToken);
    } catch (e: any) {
      console.warn('[ResilientTokenRepository] Primary update failed, using fallback:', e?.message || e);
      return this.fallback.update(id, componentType, designToken);
    }
  }

  async updateParent(id: string, sitemapId: string | null): Promise<UXUIToken | null> {
    try {
      return await this.primary.updateParent(id, sitemapId);
    } catch (e: any) {
      console.warn('[ResilientTokenRepository] Primary updateParent failed, using fallback:', e?.message || e);
      return this.fallback.updateParent(id, sitemapId);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.primary.delete(id);
    } catch (e: any) {
      console.warn('[ResilientTokenRepository] Primary delete failed, using fallback:', e?.message || e);
      await this.fallback.delete(id);
    }
  }
}

export class ResilientTraceabilityRepository implements ITraceabilityRepository {
  constructor(
    private readonly primary: ITraceabilityRepository,
    private readonly fallback: ITraceabilityRepository
  ) {}

  async getFullTraceability(): Promise<UXTraceabilityThread[]> {
    try {
      return await this.primary.getFullTraceability();
    } catch (e: any) {
      console.warn('[ResilientTraceabilityRepository] Primary failed, using fallback:', e?.message || e);
      return this.fallback.getFullTraceability();
    }
  }

  resetDefaults(): void {
    if (this.fallback.resetDefaults) {
      this.fallback.resetDefaults();
    }
  }
}
