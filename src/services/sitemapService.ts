import { ISitemapRepository } from './api/ISitemapRepository';
import { UXSitemap } from '@/types/database';

export class SitemapService {
  constructor(private readonly repository: ISitemapRepository) {}

  async getAll(): Promise<UXSitemap[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<UXSitemap | null> {
    if (!id) return null;
    return this.repository.getById(id);
  }

  async create(pageName: string, hierarchyLevel: string, featureId: string): Promise<UXSitemap> {
    const trimmedPage = pageName?.trim();
    if (!trimmedPage) {
      throw new Error('Page name cannot be empty');
    }
    const trimmedLevel = hierarchyLevel?.trim() || 'body';
    return this.repository.create(trimmedPage, trimmedLevel, featureId);
  }

  async update(id: string, pageName: string, hierarchyLevel: string): Promise<UXSitemap | null> {
    if (!id) throw new Error('Sitemap node ID is required for update');
    const trimmedPage = pageName?.trim();
    if (!trimmedPage) throw new Error('Page name cannot be empty');
    const trimmedLevel = hierarchyLevel?.trim() || 'body';
    return this.repository.update(id, trimmedPage, trimmedLevel);
  }

  async updateParent(id: string, featureId: string | null): Promise<UXSitemap | null> {
    if (!id) throw new Error('Sitemap node ID is required');
    return this.repository.updateParent(id, featureId);
  }

  async delete(id: string): Promise<void> {
    if (!id) return;
    return this.repository.delete(id);
  }
}
