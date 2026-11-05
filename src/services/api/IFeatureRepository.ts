import { UXFeature } from '@/types/database';

export interface IFeatureRepository {
  getAll(): Promise<UXFeature[]>;
  getById(id: string): Promise<UXFeature | null>;
  create(featureName: string, researchId: string, description?: string): Promise<UXFeature>;
  update(id: string, featureName: string, description?: string): Promise<UXFeature | null>;
  updateParent(id: string, researchId: string | null): Promise<UXFeature | null>;
  delete(id: string): Promise<void>;
}
