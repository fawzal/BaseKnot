import { ISitemapRepository } from '../api/ISitemapRepository';
import { UXSitemap } from '@/types/database';
import { HierarchyLevel } from '@/types/database.types';
import { TypedSupabaseClient, supabaseClient } from './supabaseClient';

export class SupabaseSitemapRepository implements ISitemapRepository {
  private client: TypedSupabaseClient;

  constructor(client: TypedSupabaseClient = supabaseClient) {
    this.client = client;
  }

  async getAll(): Promise<UXSitemap[]> {
    const { data, error } = await this.client
      .from('ux_sitemap')
      .select('*, feature:ux_features(*)')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch ux_sitemap from Supabase: ${error.message}`);
    }
    return (data || []) as unknown as UXSitemap[];
  }

  async getById(id: string): Promise<UXSitemap | null> {
    const { data, error } = await this.client
      .from('ux_sitemap')
      .select('*, feature:ux_features(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch ux_sitemap by id (${id}): ${error.message}`);
    }
    return data as unknown as UXSitemap | null;
  }

  async create(pageName: string, hierarchyLevel: string, featureId: string): Promise<UXSitemap> {
    const { data, error } = await this.client
      .from('ux_sitemap')
      .insert({
        page_name: pageName,
        hierarchy_level: hierarchyLevel as HierarchyLevel,
        feature_id: featureId,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to insert ux_sitemap: ${error?.message || 'No data returned'}`);
    }
    return data as unknown as UXSitemap;
  }

  async update(id: string, pageName: string, hierarchyLevel: string): Promise<UXSitemap | null> {
    const { data, error } = await this.client
      .from('ux_sitemap')
      .update({
        page_name: pageName,
        hierarchy_level: hierarchyLevel as HierarchyLevel,
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to update ux_sitemap (${id}): ${error.message}`);
    }
    return data as unknown as UXSitemap | null;
  }

  async updateParent(id: string, featureId: string | null): Promise<UXSitemap | null> {
    const parentVal = featureId && featureId.trim() !== '' ? featureId : null;
    const { data, error } = await this.client
      .from('ux_sitemap')
      .update({ feature_id: parentVal })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to update parent for ux_sitemap (${id}): ${error.message}`);
    }
    return data as unknown as UXSitemap | null;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from('ux_sitemap')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete ux_sitemap (${id}): ${error.message}`);
    }
  }
}

export const supabaseSitemapRepository = new SupabaseSitemapRepository();
