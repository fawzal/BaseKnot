import { ISitemapRepository } from '../api/ISitemapRepository';
import { UXSitemap } from '@/types/database';
import { mockStorage } from './mockStorage';

export class MockSitemapRepository implements ISitemapRepository {
  async getAll(): Promise<UXSitemap[]> {
    const sitemaps = mockStorage.getSitemaps();
    const features = mockStorage.getFeatures();
    const featureMap = new Map(features.map(f => [f.id, f]));

    return sitemaps.map(s => ({
      ...s,
      feature: featureMap.get(s.feature_id),
    }));
  }

  async getById(id: string): Promise<UXSitemap | null> {
    const sitemaps = mockStorage.getSitemaps();
    const sitemap = sitemaps.find(s => s.id === id);
    if (!sitemap) return null;

    const features = mockStorage.getFeatures();
    const feature = features.find(f => f.id === sitemap.feature_id);
    return { ...sitemap, feature };
  }

  async create(pageName: string, hierarchyLevel: string, featureId: string): Promise<UXSitemap> {
    const items = mockStorage.getSitemaps();
    const newItem: UXSitemap = {
      id: `site-${Date.now()}`,
      page_name: pageName,
      hierarchy_level: hierarchyLevel,
      feature_id: featureId,
      created_at: new Date().toISOString(),
    };
    mockStorage.setSitemaps([newItem, ...items]);
    return newItem;
  }

  async update(id: string, pageName: string, hierarchyLevel: string): Promise<UXSitemap | null> {
    const items = mockStorage.getSitemaps();
    const index = items.findIndex(s => s.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      page_name: pageName,
      hierarchy_level: hierarchyLevel,
    };
    mockStorage.setSitemaps(items);
    return items[index];
  }

  async updateParent(id: string, featureId: string | null): Promise<UXSitemap | null> {
    const items = mockStorage.getSitemaps();
    const index = items.findIndex(s => s.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      feature_id: featureId || '',
    };
    mockStorage.setSitemaps(items);
    return items[index];
  }

  async delete(id: string): Promise<void> {
    mockStorage.cascadeDeleteSitemap(id);
  }
}

export const mockSitemapRepository = new MockSitemapRepository();
