import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(){
    this.supabase = createClient(
      process.env.SUPABASE_PROJECT_URL || '',
      process.env.SUPABASE_API_KEY_SERVICE_ROLE || process.env.SUPABASE_API_KEY || '',
    )
  }

  getClient(): SupabaseClient{
    return this.supabase;
  }
}
