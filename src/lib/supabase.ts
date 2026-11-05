/**
 * Backward compatibility proxy module.
 * Directs data operations to the decoupled Domain Service & Repository Layer (@/services).
 */
import { 
  supabaseClient, 
  isSupabaseConfigured as isConfiguredBool, 
  dataService as domainDataService 
} from '@/services';

export const isSupabaseConfigured = isConfiguredBool;
export const supabase = supabaseClient;
export const dataService = domainDataService;

export default dataService;
