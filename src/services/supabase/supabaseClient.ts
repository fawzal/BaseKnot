import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawAnonKey &&
  rawUrl !== 'https://your-project.supabase.co' &&
  !rawUrl.includes('placeholder')
);

export const supabaseUrl: string =
  isSupabaseConfigured && rawUrl ? rawUrl : 'https://dummy-project.supabase.co';
export const supabaseAnonKey: string =
  isSupabaseConfigured && rawAnonKey ? rawAnonKey : 'dummy-anon-key';

export const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

export type TypedSupabaseClient = typeof supabaseClient;
