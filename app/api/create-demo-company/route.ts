import { NextRequest, NextResponse } from 'next/server'  
import { createClient } from '@supabase/supabase-js'  
  
export async function POST(request: NextRequest) {  
  try {  
    // ✅ Usar service role key para bypasear RLS  
    const supabase = createClient(  
      process.env.NEXT_PUBLIC_SUPABASE_URL!,  
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key  
      {  
        auth: {  
          autoRefreshToken: false,  
          persistSession: false  
        }  
      }  
    )  
  
    const {  
      razon_social,  
      rut,  
      direccion,  
      region,  
      comuna,  
      businessType,  
      apps,  
      employees,  
      estimatedEmployees,  
      branches,  
      dte,  
      skuCount,  
      estimatedSkuCount,  
      offlineMode  
    } = await request.json()  
  
    // ✅ Crear empresa individual  
    const { data: empresa, error: empresaError } = await supabase  
      .from('empresas')  
      .insert({  
        razon_social,  
        rut,  
        direccion,  
        region,  
        activo: true  
      })  
      .select()  
      .single()  
  
    if (empresaError) {  
      throw new Error(`Error creando empresa: ${empresaError.message}`)  
    }  
  
    // ✅ Crear sucursal principal  
    const { data: sucursal, error: sucursalError } = await supabase  
      .from('sucursales')  
      .insert({  
        empresa_id: empresa.id,  
        nombre: 'Sucursal Principal',  
        direccion,  
        // region, // ✅ Comentar esta línea temporalmente  
        activo: true  
      })  
      .select()  
      .single()  
  
    if (sucursalError) {  
      throw new Error(`Error creando sucursal: ${sucursalError.message}`)  
    }  
  
    // ✅ Crear plan personalizado  
    let limite_empleados = 10  
    if (employees === "+20" && estimatedEmployees) {  
      limite_empleados = Math.max(parseInt(estimatedEmployees), 20)  
    } else if (employees && employees !== "+20") {  
      const range = employees.split('-')  
      limite_empleados = parseInt(range[1]) || 10  
    }  
  
    let limite_productos = 650  
    if (skuCount === "1.500+" && estimatedSkuCount) {  
      limite_productos = Math.max(parseInt(estimatedSkuCount), 1500)  
    } else if (skuCount && skuCount !== "1.500+") {  
      const range = skuCount.split('-')  
      limite_productos = parseInt(range[1]) || 650  
    }  
  
    // ✅ Crear tabla planes si no existe  
    const { error: planError } = await supabase  
      .from('planes')  
      .insert({  
        empresa_id: empresa.id,  
        nombre: 'Plan Personalizado',  
        limite_empleados,  
        limite_productos,  
        api_pasarelas: true,  
        dte_ilimitadas: dte === "yes",  
        precio: 69  
      })  
  
    if (planError) {  
      console.warn('⚠️ Error creando plan:', planError)  
    }  
  
    return NextResponse.json({  
      success: true,  
      empresaId: empresa.id,  
      sucursalId: sucursal.id  
    })  
  
  } catch (error) {  
    console.error('❌ Error in create-demo-company:', error)  
      
    // ✅ Manejo correcto del tipo 'unknown' para TypeScript  
    const errorMessage = error instanceof Error ? error.message : 'Error interno del servidor'  
      
    return NextResponse.json({  
      success: false,  
      error: errorMessage  
    }, { status: 500 })  
  }  
}