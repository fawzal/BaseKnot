import { IResearchRepository } from '../api/IResearchRepository';
import { UXResearch } from '@/types/database';
import { TypedSupabaseClient, supabaseClient } from './supabaseClient';

export class SupabaseResearchRepository implements IResearchRepository {
  private client: TypedSupabaseClient;

  constructor(client: TypedSupabaseClient = supabaseClient) {
    this.client = client;
  }

  async getAll(): Promise<UXResearch[]> {
    const { data, error } = await this.client
      .from('ux_research')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch ux_research from Supabase: ${error.message}`);
    }
    return (data || []) as UXResearch[];
  }

  async getById(id: string): Promise<UXResearch | null> {
    const { data, error } = await this.client
      .from('ux_research')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch ux_research by id (${id}): ${error.message}`);
    }
    return data as UXResearch | null;
  }

  async create(insightText: string): Promise<UXResearch> {
    const { data, error } = await this.client
      .from('ux_research')
      .insert({ insight_text: insightText })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to insert ux_research: ${error?.message || 'No data returned'}`);
    }
    return data as UXResearch;
  }

  async update(id: string, insightText: string): Promise<UXResearch | null> {
    const { data, error } = await this.client
      .from('ux_research')
      .update({ insight_text: insightText })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to update ux_research (${id}): ${error.message}`);
    }
    return data as UXResearch | null;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from('ux_research')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete ux_research (${id}): ${error.message}`);
    }
  }
}

export const supabaseResearchRepository = new SupabaseResearchRepository();
