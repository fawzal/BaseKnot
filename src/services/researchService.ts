import { IResearchRepository } from './api/IResearchRepository';
import { UXResearch } from '@/types/database';

export class ResearchService {
  constructor(private readonly repository: IResearchRepository) {}

  async getAll(): Promise<UXResearch[]> {
    return this.repository.getAll();
  }

  async getById(id: string): Promise<UXResearch | null> {
    if (!id) return null;
    return this.repository.getById(id);
  }

  async create(insightText: string): Promise<UXResearch> {
    const trimmed = insightText?.trim();
    if (!trimmed) {
      throw new Error('Research insight text cannot be empty');
    }
    return this.repository.create(trimmed);
  }

  async update(id: string, insightText: string): Promise<UXResearch | null> {
    if (!id) throw new Error('Research ID is required for update');
    const trimmed = insightText?.trim();
    if (!trimmed) throw new Error('Research insight text cannot be empty');
    return this.repository.update(id, trimmed);
  }

  async delete(id: string): Promise<void> {
    if (!id) return;
    return this.repository.delete(id);
  }
}
