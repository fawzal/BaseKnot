import { ITokenRepository } from './api/ITokenRepository';
import { UXUIToken } from '@/types/database';

export class TokenService {
  constructor(private readonly repository: ITokenRepository) {}

  async getAll(): Promise<UXUIToken[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<UXUIToken | null> {
    if (!id) return null;
    return this.repository.getById(id);
  }

  async create(componentType: string, designToken: string, sitemapId: string): Promise<UXUIToken> {
    const trimmedType = componentType?.trim();
    if (!trimmedType) {
      throw new Error('Component type cannot be empty');
    }
    const trimmedToken = designToken?.trim();
    if (!trimmedToken) {
      throw new Error('Design token cannot be empty');
    }
    return this.repository.create(trimmedType, trimmedToken, sitemapId);
  }

  async update(id: string, componentType: string, designToken: string): Promise<UXUIToken | null> {
    if (!id) throw new Error('Token ID is required for update');
    const trimmedType = componentType?.trim();
    if (!trimmedType) throw new Error('Component type cannot be empty');
    const trimmedToken = designToken?.trim();
    if (!trimmedToken) throw new Error('Design token cannot be empty');
    return this.repository.update(id, trimmedType, trimmedToken);
  }

  async updateParent(id: string, sitemapId: string | null): Promise<UXUIToken | null> {
    if (!id) throw new Error('Token ID is required');
    return this.repository.updateParent(id, sitemapId);
  }

  async delete(id: string): Promise<void> {
    if (!id) return;
    return this.repository.delete(id);
  }
}
