// pages/api/complete-migration.ts  
import { supabase } from '@/lib/supabase'  
  
export default async function handler(req: any, res: any) {  
  if (req.method !== 'POST') {  
    return res.status(405).json({ error: 'Method not allowed' })  
  }  
  
  const { email } = req.body  
  
  try {  
    // Obtener datos de migración pendiente  
    const { data: migrationData } = await supabase  
      .from('migration_logs')  
      .select('*')  
      .eq('email', email)  
      .eq('status', 'pending_auth_creation')  
      .single()  
  
    if (!migrationData) {  
      return res.status(404).json({ error: 'Migration data not found' })  
    }  
  
    const userData = JSON.parse(migrationData.error_message)  
  
    // Llamar a la edge function  
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/crear_usuario_con_password`, {  
      method: 'POST',  
      headers: {  
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,  
        'Content-Type': 'application/json'  
      },  
      body: JSON.stringify({  
        p_nombres: userData.nombres,  
        p_apellidos: userData.apellidos,  
        p_rut: userData.rut,  
        p_email: email,  
        p_telefono: '',  
        p_direccion: userData.direccion,  
        p_fecha_nacimiento: null,  
        p_password: userData.password,  
        p_empresa_id: userData.empresa_id,  
        p_sucursal_id: userData.sucursal_id,  
        p_rol: 'empleado'  
      })  
    })  
  
    const result = await response.json()  
  
    if (result.success) {  
      // Actualizar log de migración  
      await supabase  
        .from('migration_logs')  
        .update({ status: 'success' })  
        .eq('id', migrationData.id)  
    }  
  
    return res.status(200).json(result)  
  
  } catch (error) {  
    console.error('Error in migration:', error)  
    return res.status(500).json({ error: 'Migration failed' })  
  }  
}