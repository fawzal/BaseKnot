import { IResearchRepository } from '../api/IResearchRepository';
import { UXResearch } from '@/types/database';
import { mockStorage } from './mockStorage';

export class MockResearchRepository implements IResearchRepository {
  async getAll(): Promise<UXResearch[]> {
    return mockStorage.getResearch();
  }

  async getById(id: string): Promise<UXResearch | null> {
    const items = mockStorage.getResearch();
    return items.find(r => r.id === id) || null;
  }

  async create(insightText: string): Promise<UXResearch> {
    const items = mockStorage.getResearch();
    const newItem: UXResearch = {
      id: `res-${Date.now()}`,
      insight_text: insightText,
      created_at: new Date().toISOString(),
    };
    mockStorage.setResearch([newItem, ...items]);
    return newItem;
  }

  async update(id: string, insightText: string): Promise<UXResearch | null> {
    const items = mockStorage.getResearch();
    const index = items.findIndex(r => r.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], insight_text: insightText };
    mockStorage.setResearch(items);
    return items[index];
  }

  async delete(id: string): Promise<void> {
    mockStorage.cascadeDeleteResearch(id);
  }
}

export const mockResearchRepository = new MockResearchRepository();
