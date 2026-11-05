import { IFeatureRepository } from './api/IFeatureRepository';
import { UXFeature } from '@/types/database';

export class FeatureService {
  constructor(private readonly repository: IFeatureRepository) {}

  async getAll(): Promise<UXFeature[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<UXFeature | null> {
    if (!id) return null;
    return this.repository.getById(id);
  }

  async create(featureName: string, researchId: string, description?: string): Promise<UXFeature> {
    const trimmedName = featureName?.trim();
    if (!trimmedName) {
      throw new Error('Feature name cannot be empty');
    }
    const trimmedDesc = description?.trim() || null;
    return this.repository.create(trimmedName, researchId, trimmedDesc || undefined);
  }

  async update(id: string, featureName: string, description?: string): Promise<UXFeature | null> {
    if (!id) throw new Error('Feature ID is required for update');
    const trimmedName = featureName?.trim();
    if (!trimmedName) throw new Error('Feature name cannot be empty');
    const trimmedDesc = description !== undefined ? description?.trim() : undefined;
    return this.repository.update(id, trimmedName, trimmedDesc);
  }

  async updateParent(id: string, researchId: string | null): Promise<UXFeature | null> {
    if (!id) throw new Error('Feature ID is required');
    return this.repository.updateParent(id, researchId);
  }

  async delete(id: string): Promise<void> {
    if (!id) return;
    return this.repository.delete(id);
  }
}
