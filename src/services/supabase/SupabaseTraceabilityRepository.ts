import { ITraceabilityRepository } from '../api/ITraceabilityRepository';
import { UXResearch, UXFeature, UXSitemap, UXUIToken, UXTraceabilityThread } from '@/types/database';
import { TypedSupabaseClient, supabaseClient } from './supabaseClient';

export class SupabaseTraceabilityRepository implements ITraceabilityRepository {
  private client: TypedSupabaseClient;

  constructor(client: TypedSupabaseClient = supabaseClient) {
    this.client = client;
  }

  async getFullTraceability(): Promise<UXTraceabilityThread[]> {
    // Parallel fetch all 4 tables at once — strictly zero-waterfall
    const [resResult, featResult, siteResult, tokResult] = await Promise.all([
      this.client.from('ux_research').select('*').order('created_at', { ascending: false }),
      this.client.from('ux_features').select('*').order('created_at', { ascending: false }),
      this.client.from('ux_sitemap').select('*').order('created_at', { ascending: false }),
      this.client.from('ux_ui_tokens').select('*').order('created_at', { ascending: false }),
    ]);

    if (resResult.error) throw new Error(`Research query error: ${resResult.error.message}`);
    if (featResult.error) throw new Error(`Features query error: ${featResult.error.message}`);
    if (siteResult.error) throw new Error(`Sitemap query error: ${siteResult.error.message}`);
    if (tokResult.error) throw new Error(`Tokens query error: ${tokResult.error.message}`);

    const researchList = (resResult.data || []) as UXResearch[];
    const featuresList = (featResult.data || []) as UXFeature[];
    const sitemapList = (siteResult.data || []) as UXSitemap[];
    const tokensList = (tokResult.data || []) as UXUIToken[];

    return researchList.map((research) => {
      const relFeatures = featuresList.filter((f) => f.research_id === research.id);
      return {
        research,
        features: relFeatures.map((feature) => {
          const relSitemap = sitemapList.filter((s) => s.feature_id === feature.id);
          return {
            feature,
            sitemapNodes: relSitemap.map((node) => ({
              node,
              tokens: tokensList.filter((t) => t.sitemap_id === node.id),
            })),
          };
        }),
      };
    });
  }

  resetDefaults(): void {
    console.info('SupabaseTraceabilityRepository: Reset defaults is handled via migration seed.sql in database mode.');
  }
}

export const supabaseTraceabilityRepository = new SupabaseTraceabilityRepository();
