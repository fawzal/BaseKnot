import { UXTraceabilityThread } from '@/types/database';

export interface ITraceabilityRepository {
  getFullTraceability(): Promise<UXTraceabilityThread[]>;
  resetDefaults(): Promise<void> | void;
}
