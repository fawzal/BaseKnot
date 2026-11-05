import { ITokenRepository } from '../api/ITokenRepository';
import { UXUIToken } from '@/types/database';
import { TypedSupabaseClient, supabaseClient } from './supabaseClient';

export class SupabaseTokenRepository implements ITokenRepository {
  private client: TypedSupabaseClient;

  constructor(client: TypedSupabaseClient = supabaseClient) {
    this.client = client;
  }

  async getAll(): Promise<UXUIToken[]> {
    const { data, error } = await this.client
      .from('ux_ui_tokens')
      .select('*, sitemap:ux_sitemap(*)')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch ux_ui_tokens from Supabase: ${error.message}`);
    }
    return (data || []) as unknown as UXUIToken[];
  }

  async getById(id: string): Promise<UXUIToken | null> {
    const { data, error } = await this.client
      .from('ux_ui_tokens')
      .select('*, sitemap:ux_sitemap(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch ux_ui_tokens by id (${id}): ${error.message}`);
    }
    return data as unknown as UXUIToken | null;
  }

  async create(componentType: string, designToken: string, sitemapId: string): Promise<UXUIToken> {
    const { data, error } = await this.client
      .from('ux_ui_tokens')
      .insert({
        component_type: componentType,
        design_token: designToken,
        sitemap_id: sitemapId,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to insert ux_ui_tokens: ${error?.message || 'No data returned'}`);
    }
    return data as unknown as UXUIToken;
  }

  async update(id: string, componentType: string, designToken: string): Promise<UXUIToken | null> {
    const { data, error } = await this.client
      .from('ux_ui_tokens')
      .update({
        component_type: componentType,
        design_token: designToken,
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to update ux_ui_tokens (${id}): ${error.message}`);
    }
    return data as unknown as UXUIToken | null;
  }

  async updateParent(id: string, sitemapId: string | null): Promise<UXUIToken | null> {
    const parentVal = sitemapId && sitemapId.trim() !== '' ? sitemapId : null;
    const { data, error } = await this.client
      .from('ux_ui_tokens')
      .update({ sitemap_id: parentVal })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to update parent for ux_ui_tokens (${id}): ${error.message}`);
    }
    return data as unknown as UXUIToken | null;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from('ux_ui_tokens')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete ux_ui_tokens (${id}): ${error.message}`);
    }
  }
}

export const supabaseTokenRepository = new SupabaseTokenRepository();
