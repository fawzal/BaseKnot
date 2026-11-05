import { UXResearch } from '@/types/database';

export interface IResearchRepository {
  getAll(): Promise<UXResearch[]>;
  getById(id: string): Promise<UXResearch | null>;
  create(insightText: string): Promise<UXResearch>;
  update(id: string, insightText: string): Promise<UXResearch | null>;
  delete(id: string): Promise<void>;
}
