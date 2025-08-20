import { createClient } from '@supabase/supabase-js'  
  
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''  
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''  
  
if (!supabaseUrl || !supabaseAnonKey) {  
  console.error('Missing Supabase environment variables. Please check your .env.local file')  
}  
  
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {  
  auth: {  
    persistSession: true,  
    autoRefreshToken: true,  
    detectSessionInUrl: true,  
    // ✅ Sin debug para evitar logs excesivos  
    debug: false  
  },  
  // ✅ Configuración de realtime optimizada  
  realtime: {  
    params: {  
      eventsPerSecond: 5  
    }  
  }  
})