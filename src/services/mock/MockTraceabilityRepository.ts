import { ITraceabilityRepository } from '../api/ITraceabilityRepository';
import { UXTraceabilityThread } from '@/types/database';
import { mockStorage } from './mockStorage';

export class MockTraceabilityRepository implements ITraceabilityRepository {
  async getFullTraceability(): Promise<UXTraceabilityThread[]> {
    return mockStorage.getFullTraceability();
  }

  resetDefaults(): void {
    mockStorage.resetToDefaults();
  }
}

export const mockTraceabilityRepository = new MockTraceabilityRepository();
