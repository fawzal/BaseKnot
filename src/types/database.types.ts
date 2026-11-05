/**
 * Database Types for UX Logic Thread (Traceability Mapper)
 * Generated & typed to reflect PostgreSQL schema in `supabase/migrations/001_initial_schema.sql`.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Valid hierarchy levels for sitemap information architecture.
 * Enforced by database CHECK constraint.
 */
export type HierarchyLevel =
  | 'header'
  | 'hero'
  | 'body'
  | 'sidebar'
  | 'footer'
  | 'floating'
  | 'modal';

export interface Database {
  public: {
    Tables: {
      ux_research: {
        Row: {
          id: string;
          insight_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          insight_text: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          insight_text?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ux_features: {
        Row: {
          id: string;
          feature_name: string;
          description: string | null;
          research_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          feature_name: string;
          description?: string | null;
          research_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          feature_name?: string;
          description?: string | null;
          research_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ux_features_research_id_fkey';
            columns: ['research_id'];
            isOneToOne: false;
            referencedRelation: 'ux_research';
            referencedColumns: ['id'];
          }
        ];
      };
      ux_sitemap: {
        Row: {
          id: string;
          page_name: string;
          hierarchy_level: HierarchyLevel;
          feature_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_name: string;
          hierarchy_level: HierarchyLevel;
          feature_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          page_name?: string;
          hierarchy_level?: HierarchyLevel;
          feature_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ux_sitemap_feature_id_fkey';
            columns: ['feature_id'];
            isOneToOne: false;
            referencedRelation: 'ux_features';
            referencedColumns: ['id'];
          }
        ];
      };
      ux_ui_tokens: {
        Row: {
          id: string;
          component_type: string;
          design_token: string;
          sitemap_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          component_type: string;
          design_token: string;
          sitemap_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          component_type?: string;
          design_token?: string;
          sitemap_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ux_ui_tokens_sitemap_id_fkey';
            columns: ['sitemap_id'];
            isOneToOne: false;
            referencedRelation: 'ux_sitemap';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      set_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// ----------------------------------------------------------------------------
// Convenience Table Types (Entity, Insert, Update)
// ----------------------------------------------------------------------------

export type UxResearch = Database['public']['Tables']['ux_research']['Row'];
export type UxResearchInsert = Database['public']['Tables']['ux_research']['Insert'];
export type UxResearchUpdate = Database['public']['Tables']['ux_research']['Update'];

export type UxFeature = Database['public']['Tables']['ux_features']['Row'];
export type UxFeatureInsert = Database['public']['Tables']['ux_features']['Insert'];
export type UxFeatureUpdate = Database['public']['Tables']['ux_features']['Update'];

export type UxSitemap = Database['public']['Tables']['ux_sitemap']['Row'];
export type UxSitemapInsert = Database['public']['Tables']['ux_sitemap']['Insert'];
export type UxSitemapUpdate = Database['public']['Tables']['ux_sitemap']['Update'];

export type UxUiToken = Database['public']['Tables']['ux_ui_tokens']['Row'];
export type UxUiTokenInsert = Database['public']['Tables']['ux_ui_tokens']['Insert'];
export type UxUiTokenUpdate = Database['public']['Tables']['ux_ui_tokens']['Update'];

// ----------------------------------------------------------------------------
// Relational Nested / Joined Types for End-to-End Traceability
// ----------------------------------------------------------------------------

export interface UxSitemapWithTokens extends UxSitemap {
  ux_ui_tokens: UxUiToken[];
}

export interface UxFeatureWithSitemap extends UxFeature {
  ux_sitemap: UxSitemapWithTokens[];
}

export interface UxResearchTraceabilityTree extends UxResearch {
  ux_features: UxFeatureWithSitemap[];
}

/**
 * Standard Supabase nested query string for fetching full end-to-end traceability
 * in a single round-trip (avoids N+1 query waterfall).
 *
 * Usage:
 * ```ts
 * const { data, error } = await supabase
 *   .from('ux_research')
 *   .select(TRACEABILITY_FULL_SELECT_QUERY)
 *   .order('created_at', { ascending: false });
 * ```
 */
export const TRACEABILITY_FULL_SELECT_QUERY = `
  id,
  insight_text,
  created_at,
  updated_at,
  ux_features (
    id,
    feature_name,
    description,
    research_id,
    created_at,
    updated_at,
    ux_sitemap (
      id,
      page_name,
      hierarchy_level,
      feature_id,
      created_at,
      updated_at,
      ux_ui_tokens (
        id,
        component_type,
        design_token,
        sitemap_id,
        created_at,
        updated_at
      )
    )
  )
` as const;
