import { createClient } from "@supabase/supabase-js"

// Asegúrate de que estas variables de entorno estén configuradas en Vercel
// NEXT_PUBLIC_SUPABASE_URL: https://ujkdekqhoeyfjvtzdtaz.supabase.co
// SUPABASE_SERVICE_ROLE_KEY: Tu clave de rol de servicio de Supabase (NO la anon key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseServiceRoleKey)
}
