export interface UXResearch {
  id: string;
  insight_text: string;
  created_at: string;
}

export interface UXFeature {
  id: string;
  feature_name: string;
  description?: string | null;
  research_id: string;
  created_at: string;
  // Relational join
  research?: UXResearch;
}

export type SitemapHierarchyLevel = 
  | 'Header'
  | 'Hero Section'
  | 'Main Content'
  | 'Sidebar'
  | 'Modal/Drawer'
  | 'Floating Action'
  | 'Footer';

export interface UXSitemap {
  id: string;
  page_name: string;
  hierarchy_level: SitemapHierarchyLevel | string;
  feature_id: string;
  created_at: string;
  // Relational join
  feature?: UXFeature;
}

export interface UXUIToken {
  id: string;
  component_type: string;
  design_token: string;
  sitemap_id: string;
  created_at: string;
  // Relational join
  sitemap?: UXSitemap;
}

/** Complete relational graph item for context export */
export interface UXTraceabilityThread {
  research: UXResearch;
  features: Array<{
    feature: UXFeature;
    sitemapNodes: Array<{
      node: UXSitemap;
      tokens: UXUIToken[];
    }>;
  }>;
}

export type ActiveTab = 'research' | 'sitemap' | 'tokens' | 'export';

// Re-export formal Supabase Database definitions & query helpers
export * from './database.types';

