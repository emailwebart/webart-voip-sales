import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://agidkhyiueygvsfabfro.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnaWRraHlpdWV5Z3ZzZmFiZnJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MzMxMzQsImV4cCI6MjA3NzIwOTEzNH0.em4Gk3YHSUNEK1h19gzM-DTEWJphzKOfKiVku70JK7o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
