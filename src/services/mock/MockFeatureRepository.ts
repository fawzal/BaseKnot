import { IFeatureRepository } from '../api/IFeatureRepository';
import { UXFeature } from '@/types/database';
import { mockStorage } from './mockStorage';

export class MockFeatureRepository implements IFeatureRepository {
  async getAll(): Promise<UXFeature[]> {
    const features = mockStorage.getFeatures();
    const researchList = mockStorage.getResearch();
    const researchMap = new Map(researchList.map(r => [r.id, r]));

    // Populate relational join
    return features.map(f => ({
      ...f,
      research: researchMap.get(f.research_id),
    }));
  }

  async getById(id: string): Promise<UXFeature | null> {
    const features = mockStorage.getFeatures();
    const feature = features.find(f => f.id === id);
    if (!feature) return null;

    const researchList = mockStorage.getResearch();
    const research = researchList.find(r => r.id === feature.research_id);
    return { ...feature, research };
  }

  async create(featureName: string, researchId: string, description?: string): Promise<UXFeature> {
    const items = mockStorage.getFeatures();
    const newItem: UXFeature = {
      id: `feat-${Date.now()}`,
      feature_name: featureName,
      description: description || null,
      research_id: researchId,
      created_at: new Date().toISOString(),
    };
    mockStorage.setFeatures([newItem, ...items]);
    return newItem;
  }

  async update(id: string, featureName: string, description?: string): Promise<UXFeature | null> {
    const items = mockStorage.getFeatures();
    const index = items.findIndex(f => f.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      feature_name: featureName,
      description: description !== undefined ? description : items[index].description,
    };
    mockStorage.setFeatures(items);
    return items[index];
  }

  async updateParent(id: string, researchId: string | null): Promise<UXFeature | null> {
    const items = mockStorage.getFeatures();
    const index = items.findIndex(f => f.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      research_id: researchId || '',
    };
    mockStorage.setFeatures(items);
    return items[index];
  }

  async delete(id: string): Promise<void> {
    mockStorage.cascadeDeleteFeature(id);
  }
}

export const mockFeatureRepository = new MockFeatureRepository();
