import { NextRequest, NextResponse } from 'next/server'  
import { supabase } from '@/lib/supabase'  
  
export async function POST(request: NextRequest) {  
  try {  
    const { email, password } = await request.json()  
    console.log('🔄 Iniciando migración automática para:', email)  
  
    // ✅ Función helper para obtener configuración del sistema  
    const getSystemConfig = async (key: string) => {  
      try {  
        const { data, error } = await supabase  
          .from('system_config')  
          .select('value')  
          .eq('key', key)  
          .single()  
          
        if (error || !data) {  
          console.warn(`⚠️ No se encontró configuración para: ${key}`)  
          return null  
        }  
          
        return data.value  
      } catch (error) {  
        console.error(`❌ Error obteniendo configuración ${key}:`, error)  
        return null  
      }  
    }  
  
    // Obtener datos del demo completado  
    const { data: demoData } = await supabase  
      .from('demo_registrations')  
      .select('*')  
      .eq('email', email)  
      .eq('status', 'completed')  
      .single()  
  
    if (!demoData) {  
      return NextResponse.json({ error: 'Demo registration not found' }, { status: 404 })  
    }  
  
    console.log('📊 Datos completos del demo:', demoData)  
  
    // Verificar si ya existe en usuarios  
    const { data: existingUser } = await supabase  
      .from('usuarios')  
      .select('id')  
      .eq('email', email)  
      .single()  
  
    if (existingUser) {  
      return NextResponse.json({ success: true, message: 'User already migrated' })  
    }  
  
    // ✅ COMPLETAMENTE DINÁMICO: Obtener configuración de empresa y sucursal  
    const demoCompanyConfig = await getSystemConfig('demo_company')  
    const demoBranchConfig = await getSystemConfig('demo_branch')  
  
    if (!demoCompanyConfig || !demoBranchConfig) {  
      console.error('❌ No se encontró configuración de empresa/sucursal demo')  
      return NextResponse.json({ error: 'Demo configuration not found' }, { status: 500 })  
    }  
  
    // Buscar empresa usando configuración dinámica  
    const { data: empresaDemo } = await supabase  
      .from('empresas')  
      .select('id')  
      .eq('razon_social', demoCompanyConfig.razon_social)  
      .single()  
  
    if (!empresaDemo) {  
      console.error('❌ No se encontró empresa demo:', demoCompanyConfig.razon_social)  
      return NextResponse.json({ error: 'Demo company not found' }, { status: 404 })  
    }  
  
    // Buscar sucursal usando configuración dinámica  
    const { data: sucursalDemo } = await supabase  
      .from('sucursales')  
      .select('id')  
      .eq('nombre', demoBranchConfig.nombre)  
      .eq('empresa_id', empresaDemo.id)  
      .single()  
  
    if (!sucursalDemo) {  
      console.error('❌ No se encontró sucursal demo:', demoBranchConfig.nombre)  
      return NextResponse.json({ error: 'Demo branch not found' }, { status: 404 })  
    }  
  
    // ✅ CORRECCIÓN CRÍTICA: Preparar datos con valores por defecto para campos requeridos  
    const edgeFunctionData = {  
      p_nombres: demoData.name?.split(' ')[0] || 'Usuario',  
      p_apellidos: demoData.name?.split(' ').slice(1).join(' ') || 'Demo',  
      p_rut: demoData.rut || '11111111-1',  
      p_email: demoData.email,  
      p_telefono: demoData.telefono || '',  
      p_direccion: demoData.direccion || '',  
      p_fecha_nacimiento: null,  
      p_password: password,  
      p_empresa_id: empresaDemo.id, // ✅ Completamente dinámico  
      p_sucursal_id: sucursalDemo.id, // ✅ Completamente dinámico  
      p_rol: 'administrador' // ✅ Rol de administrador para nuevos usuarios  
    }  
  
    console.log('📊 Datos que se enviarán a edge function:', edgeFunctionData)  
  
    // Llamar a la edge function para crear el usuario  
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/crear_usuario_con_password`, {  
      method: 'POST',  
      headers: {  
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,  
        'Content-Type': 'application/json'  
      },  
      body: JSON.stringify(edgeFunctionData)  
    })  
  
    console.log('🔍 Status de edge function:', response.status)  
    const result = await response.json()  
    console.log('📧 Resultado de edge function:', result)  
  
    if (result.success) {  
      // Actualizar logs de migración  
      await supabase  
        .from('migration_logs')  
        .update({ status: 'completed' })  
        .eq('email', email)  
        .eq('status', 'pending_auth_creation')  
  
      console.log('✅ Migración completada exitosamente')  
    }  
  
    return NextResponse.json(result)  
  } catch (error) {  
    console.error('❌ Error in auto migration:', error)  
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 })  
  }  
}