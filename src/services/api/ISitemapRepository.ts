import { UXSitemap } from '@/types/database';

export interface ISitemapRepository {
  getAll(): Promise<UXSitemap[]>;
  getById(id: string): Promise<UXSitemap | null>;
  create(pageName: string, hierarchyLevel: string, featureId: string): Promise<UXSitemap>;
  update(id: string, pageName: string, hierarchyLevel: string): Promise<UXSitemap | null>;
  updateParent(id: string, featureId: string | null): Promise<UXSitemap | null>;
  delete(id: string): Promise<void>;
}
