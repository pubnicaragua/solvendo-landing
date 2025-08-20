"use server"  
  
import { createServerClient } from "@/lib/supabaseServer"  
import sgMail from "@sendgrid/mail"  
import bcrypt from "bcryptjs"  
  
interface FormData {  
  name: string  
  email: string  
  password?: string  
  rut?: string  
  razonSocial?: string  
  direccion?: string  
  region?: string  
  comuna?: string  
  businessType?: string  
  otherBusinessType?: string  
  apps?: string[]  
  employees?: string  
  estimatedEmployees?: string  
  branches?: number  
  totalBoxes?: number  
  dte?: string  
  skuCount?: string  
  estimatedSkuCount?: string  
  offlineMode?: string  
}  
  
interface SaveProgressParams {  
  formData: FormData  
  currentStep: number  
  isFinalSubmission: boolean  
}  
  
export async function saveDemoProgress({ formData, currentStep, isFinalSubmission }: SaveProgressParams) {  
  console.log(`🔧 Server Action saveDemoProgress iniciada. Paso: ${currentStep}, Final: ${isFinalSubmission}`)  
          
  const supabase = createServerClient()  
  console.log('✅ Cliente Supabase creado')  
        
  try {  
    // Validar campos requeridos  
    if (!formData.name || !formData.email) {  
      console.error('❌ Campos requeridos faltantes: name o email')  
      return {         
        success: false,         
        message: "Nombre y email son requeridos."         
      }  
    }  
  
    // ✅ CAMBIO CRÍTICO: NO hashear contraseña para demo_registrations  
          // ✅ CAMBIO CRÍTICO: NO hashear contraseña para demo_registrations  
    // Necesitamos la contraseña en texto plano para la migración automática  
    let passwordToSave = formData.password || ''  
      
    if (!passwordToSave) {  
      passwordToSave = 'temp_password_' + Date.now()  
      console.log('🔐 Contraseña temporal generada')  
    } else {  
      console.log('🔐 Contraseña guardada en texto plano para migración')  
      console.log('🔑 Contraseña que se guardará:', passwordToSave) // ✅ Log de debugging  
    }  
  
    // Preparar datos  
    const dataToSave: any = {  
      name: formData.name.trim(),  
      email: formData.email.trim().toLowerCase(),  
      password: passwordToSave, // ✅ Contraseña en texto plano  
      rut: formData.rut?.trim() || null,  
      razon_social: formData.razonSocial?.trim() || null,  
      direccion: formData.direccion?.trim() || null,  
      region: formData.region?.trim() || null,  
      comuna: formData.comuna?.trim() || null,  
      business_type: formData.businessType === "other" ? formData.otherBusinessType?.trim() : formData.businessType?.trim(),  
      apps: formData.apps || null,  
      employees: formData.employees === "+20" ? `Más de 20: ${formData.estimatedEmployees}` : formData.employees,  
      branches: formData.branches ? parseInt(formData.branches.toString()) : null,  
      total_boxes: formData.totalBoxes ? parseInt(formData.totalBoxes.toString()) : null,  
      dte: formData.dte || null,  
      sku_count: formData.skuCount === "1.500+" ? `Más de 1,500: ${formData.estimatedSkuCount}` : formData.skuCount,  
      offline_mode: formData.offlineMode || null,  
      last_step_completed: parseInt(currentStep.toString()),  
      status: isFinalSubmission ? "completed" : "pending",  
    }  
  
    // Limpiar campos undefined  
    Object.keys(dataToSave).forEach((key) => {  
      if (dataToSave[key] === undefined) {  
        dataToSave[key] = null  
      }  
    })  
            
    console.log('📝 Datos a guardar:', JSON.stringify(dataToSave, null, 2))  
  
    // Upsert en demo_registrations  
    const { data: result, error: dbError } = await supabase  
      .from("demo_registrations")  
      .upsert(dataToSave, {         
        onConflict: "email",         
        ignoreDuplicates: false         
      })  
      .select()  
  
    if (dbError) {  
      console.error("❌ Error detallado de Supabase:", {  
        message: dbError.message,  
        details: dbError.details,  
        hint: dbError.hint,  
        code: dbError.code  
      })  
          
      // MENSAJE ESPECÍFICO para RUT duplicado  
      if (dbError.code === '23505' && dbError.message.includes('unique_rut')) {  
        return {  
          success: false,  
          message: `El RUT ${formData.rut} ya está registrado. Si ya tienes una cuenta, inicia sesión con tu email original.`  
        }  
      }  
          
      return {         
        success: false,         
        message: "Error al guardar el progreso de la demo. Por favor, inténtalo de nuevo."         
      }  
    }  
  
    console.log('✅ Datos guardados exitosamente:', result)  
  
    // Enviar correos si es sumisión final  
    if (isFinalSubmission) {  
      if (process.env.SENDGRID_API_KEY) {  
        console.log("📧 SENDGRID_API_KEY detectada. Intentando enviar correos.")  
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)  
  
        const businessTypeName = formData.businessType === "other" ? formData.otherBusinessType : formData.businessType  
  
        const msgToSolvendo = {  
          to: "registros@solvendo.cl",  
          from: "registros@solvendo.cl",  
          subject: "NUEVO REGISTRO DE DEMO - Solvendo",  
          html: `  
            <h1>Nuevo Registro de Demo</h1>  
            <p>Se ha registrado una nueva demo con los siguientes datos:</p>  
            <ul>  
              <li><strong>Nombre:</strong> ${formData.name}</li>  
              <li><strong>Email Cliente:</strong> ${formData.email}</li>  
              <li><strong>Tipo de Negocio:</strong> ${businessTypeName || "N/A"}</li>  
              <li><strong>Aplicaciones:</strong> ${formData.apps?.join(", ") || "N/A"}</li>  
              <li><strong>Colaboradores:</strong> ${formData.employees || "N/A"}</li>  
              <li><strong>Sucursales:</strong> ${formData.branches || "N/A"}</li>  
              <li><strong>RUT:</strong> ${formData.rut || "N/A"}</li>  
              <li><strong>Razón Social:</strong> ${formData.razonSocial || "N/A"}</li>  
              <li><strong>Dirección:</strong> ${formData.direccion || "N/A"}, ${formData.comuna || "N/A"}, ${formData.region || "N/A"}</li>  
              <li><strong>Cajas Totales:</strong> ${formData.totalBoxes || "N/A"}</li>  
              <li><strong>DTE:</strong> ${formData.dte === "yes" ? "Sí" : "No"}</li>  
              <li><strong>Cantidad SKU:</strong> ${formData.skuCount === "1.500+" ? `Más de 1,500: ${formData.estimatedSkuCount}` : formData.skuCount || "N/A"}</li>  
              <li><strong>Modo Sin Conexión:</strong> ${formData.offlineMode === "yes" ? "Sí" : "No"}</li>  
            </ul>  
          `,  
        }  
  
        const msgToClient = {  
          to: formData.email,  
          from: "registros@solvendo.cl",  
          subject: "¡Gracias por registrarte en la demo de Solvendo!",  
          html: `  
            <h1>¡Gracias por registrarte en la demo de Solvendo!</h1>  
            <p>Hemos recibido tu información y te notificaremos por correo electrónico cuando estemos listos para que pruebes Solvendo.</p>  
            <p>Fecha de lanzamiento: 14 de Julio</p>  
            <p>¡Esperamos verte pronto!</p>  
            <p>Atentamente,<br/>El equipo de Solvendo</p>  
          `,  
        }  
  
        try {  
          await sgMail.send(msgToSolvendo)  
          await sgMail.send(msgToClient)  
          console.log("✅ Correos enviados con SendGrid.")  
        } catch (emailError: any) {  
          console.error("❌ Error al enviar correos con SendGrid:", emailError.response?.body || emailError)  
        }  
      } else {  
        console.warn("⚠️ SENDGRID_API_KEY no está configurada.")  
      }  
    }  
  
    return {         
      success: true,         
      message: isFinalSubmission ? "¡Registro de demo exitoso!" : "Progreso guardado."         
    }  
  } catch (error) {  
    console.error("💥 Error completo en saveDemoProgress:", error)  
    return {  
      success: false,  
      message: "Ocurrió un error inesperado al guardar el progreso. Por favor, inténtalo de nuevo.",  
    }  
  }  
}