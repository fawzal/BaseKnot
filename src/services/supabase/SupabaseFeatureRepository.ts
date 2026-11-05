import { IFeatureRepository } from '../api/IFeatureRepository';
import { UXFeature } from '@/types/database';
import { TypedSupabaseClient, supabaseClient } from './supabaseClient';

export class SupabaseFeatureRepository implements IFeatureRepository {
  private client: TypedSupabaseClient;

  constructor(client: TypedSupabaseClient = supabaseClient) {
    this.client = client;
  }

  async getAll(): Promise<UXFeature[]> {
    const { data, error } = await this.client
      .from('ux_features')
      .select('*, research:ux_research(*)')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch ux_features from Supabase: ${error.message}`);
    }
    return (data || []) as unknown as UXFeature[];
  }

  async getById(id: string): Promise<UXFeature | null> {
    const { data, error } = await this.client
      .from('ux_features')
      .select('*, research:ux_research(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch ux_features by id (${id}): ${error.message}`);
    }
    return data as unknown as UXFeature | null;
  }

  async create(featureName: string, researchId: string, description?: string): Promise<UXFeature> {
    const { data, error } = await this.client
      .from('ux_features')
      .insert({
        feature_name: featureName,
        research_id: researchId,
        description: description || null,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to insert ux_features: ${error?.message || 'No data returned'}`);
    }
    return data as unknown as UXFeature;
  }

  async update(id: string, featureName: string, description?: string): Promise<UXFeature | null> {
    const { data, error } = await this.client
      .from('ux_features')
      .update({
        feature_name: featureName,
        description: description !== undefined ? description : null,
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to update ux_features (${id}): ${error.message}`);
    }
    return data as unknown as UXFeature | null;
  }

  async updateParent(id: string, researchId: string | null): Promise<UXFeature | null> {
    const parentVal = researchId && researchId.trim() !== '' ? researchId : null;
    const { data, error } = await this.client
      .from('ux_features')
      .update({ research_id: parentVal })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to update parent for ux_features (${id}): ${error.message}`);
    }
    return data as unknown as UXFeature | null;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from('ux_features')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete ux_features (${id}): ${error.message}`);
    }
  }
}

export const supabaseFeatureRepository = new SupabaseFeatureRepository();
