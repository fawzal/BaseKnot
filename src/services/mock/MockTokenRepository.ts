import { ITokenRepository } from '../api/ITokenRepository';
import { UXUIToken } from '@/types/database';
import { mockStorage } from './mockStorage';

export class MockTokenRepository implements ITokenRepository {
  async getAll(): Promise<UXUIToken[]> {
    const tokens = mockStorage.getTokens();
    const sitemaps = mockStorage.getSitemaps();
    const sitemapMap = new Map(sitemaps.map(s => [s.id, s]));

    return tokens.map(t => ({
      ...t,
      sitemap: sitemapMap.get(t.sitemap_id),
    }));
  }

  async getById(id: string): Promise<UXUIToken | null> {
    const tokens = mockStorage.getTokens();
    const token = tokens.find(t => t.id === id);
    if (!token) return null;

    const sitemaps = mockStorage.getSitemaps();
    const sitemap = sitemaps.find(s => s.id === token.sitemap_id);
    return { ...token, sitemap };
  }

  async create(componentType: string, designToken: string, sitemapId: string): Promise<UXUIToken> {
    const items = mockStorage.getTokens();
    const newItem: UXUIToken = {
      id: `tok-${Date.now()}`,
      component_type: componentType,
      design_token: designToken,
      sitemap_id: sitemapId,
      created_at: new Date().toISOString(),
    };
    mockStorage.setTokens([newItem, ...items]);
    return newItem;
  }

  async update(id: string, componentType: string, designToken: string): Promise<UXUIToken | null> {
    const items = mockStorage.getTokens();
    const index = items.findIndex(t => t.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      component_type: componentType,
      design_token: designToken,
    };
    mockStorage.setTokens(items);
    return items[index];
  }

  async updateParent(id: string, sitemapId: string | null): Promise<UXUIToken | null> {
    const items = mockStorage.getTokens();
    const index = items.findIndex(t => t.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      sitemap_id: sitemapId || '',
    };
    mockStorage.setTokens(items);
    return items[index];
  }

  async delete(id: string): Promise<void> {
    const items = mockStorage.getTokens().filter(t => t.id !== id);
    mockStorage.setTokens(items);
  }
}

export const mockTokenRepository = new MockTokenRepository();
