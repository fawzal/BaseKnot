import { UXUIToken } from '@/types/database';

export interface ITokenRepository {
  getAll(): Promise<UXUIToken[]>;
  getById(id: string): Promise<UXUIToken | null>;
  create(componentType: string, designToken: string, sitemapId: string): Promise<UXUIToken>;
  update(id: string, componentType: string, designToken: string): Promise<UXUIToken | null>;
  updateParent(id: string, sitemapId: string | null): Promise<UXUIToken | null>;
  delete(id: string): Promise<void>;
}
