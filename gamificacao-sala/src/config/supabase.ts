import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uwxgssketcpejqkjawmj.supabase.co';
const supabaseKey = 'sb_publishable_jiQyGKYcsdUtpVAD--kAPQ_kIfGimXA';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('As variáveis de ambiente do Supabase estão faltando.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);