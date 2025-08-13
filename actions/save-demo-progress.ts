"use server"

import { createServerClient } from "@/lib/supabaseServer"
import sgMail from "@sendgrid/mail"
import bcrypt from "bcryptjs"

interface FormData {
  name: string
  email: string
  password?: string // La contraseña puede ser opcional para guardados parciales si no se ha llegado al paso 1
  rut?: string
  razonSocial?: string
  direccion?: string
  region?: string
  comuna?: string
  businessType?: string
  otherBusinessType?: string
  apps?: string[]
  employees?: string
  estimatedEmployees?: string // Nuevo campo
  branches?: number
  totalBoxes?: number
  dte?: string
  skuCount?: string
  estimatedSkuCount?: string // Nuevo campo para SKU estimado
  offlineMode?: string
}

interface SaveProgressParams {
  formData: FormData
  currentStep: number
  isFinalSubmission: boolean
}

export async function saveDemoProgress({ formData, currentStep, isFinalSubmission }: SaveProgressParams) {
  console.log(`Server Action saveDemoProgress iniciada. Paso: ${currentStep}, Final: ${isFinalSubmission}`)
  const supabase = createServerClient()

  try {
    let hashedPassword = formData.password // Usar la contraseña directamente si ya está hasheada o no se va a hashear
    if (formData.password && currentStep >= 1) {
      // Solo hashear si la contraseña está presente y estamos en el paso 1 o posterior
      hashedPassword = await bcrypt.hash(formData.password, 10)
    }

    // Prepara los datos para la inserción/actualización
    const dataToSave: any = {
      name: formData.name,
      email: formData.email,
      password: hashedPassword, // Almacena la contraseña hasheada
      rut: formData.rut,
      razon_social: formData.razonSocial,
      direccion: formData.direccion,
      region: formData.region,
      comuna: formData.comuna,
      business_type: formData.businessType === "other" ? formData.otherBusinessType : formData.businessType,
      apps: formData.apps,
      employees: formData.employees === "+20" ? `Más de 20: ${formData.estimatedEmployees}` : formData.employees, // Actualizado para +20 colaboradores
      branches: formData.branches,
      total_boxes: formData.totalBoxes,
      dte: formData.dte,
      sku_count: formData.skuCount === "1,500+" ? `Más de 1,500: ${formData.estimatedSkuCount}` : formData.skuCount,
      offline_mode: formData.offlineMode,
      last_step_completed: currentStep,
      status: isFinalSubmission ? "completed" : "pending",
    }

    // Eliminar campos undefined para evitar errores de Supabase si no están presentes en el paso actual
    Object.keys(dataToSave).forEach((key) => dataToSave[key] === undefined && delete dataToSave[key])

    // Intenta insertar o actualizar el registro
    const { error: dbError } = await supabase
      .from("demo_registrations")
      .upsert(dataToSave, { onConflict: "email", ignoreDuplicates: false }) // Actualiza si el email ya existe
      .select() // Selecciona el registro actualizado/insertado para verificar

    if (dbError) {
      console.error("Error al insertar/actualizar datos en Supabase:", dbError)
      return { success: false, message: "Error al guardar el progreso de la demo. Por favor, inténtalo de nuevo." }
    }

    // Si es la sumisión final, envía los correos
    if (isFinalSubmission) {
      if (process.env.SENDGRID_API_KEY) {
        console.log("SENDGRID_API_KEY detectada. Intentando enviar correos.")
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const businessTypeName = formData.businessType === "other" ? formData.otherBusinessType : formData.businessType

        // Email para Solvendo
        const msgToSolvendo = {
          to: "registros@solvendo.cl",
          from: "registros@solvendo.cl", // Usar el remitente verificado
          subject: "NUEVO REGISTRO DE DEMO - Solvendo",
          html: `
            <h1>Nuevo Registro de Demo</h1>
            <p>Se ha registrado una nueva demo con los siguientes datos:</p>
            <ul>
              <li><strong>Nombre:</strong> ${formData.name}</li>
              <li><strong>Email Cliente:</strong> ${formData.email}</li>
              <li><strong>Tipo de Negocio:</strong> ${businessTypeName}</li>
              <li><strong>Aplicaciones:</strong> ${formData.apps?.join(", ") || "N/A"}</li>
              <li><strong>Colaboradores:</strong> ${formData.employees || "N/A"}</li>
              <li><strong>Sucursales:</strong> ${formData.branches || "N/A"}</li>
              <li><strong>RUT:</strong> ${formData.rut || "N/A"}</li>
              <li><strong>Razón Social:</strong> ${formData.razonSocial || "N/A"}</li>
              <li><strong>Dirección:</strong> ${formData.direccion || "N/A"}, ${formData.comuna || "N/A"}, ${formData.region || "N/A"}</li>
              <li><strong>Cajas Totales:</strong> ${formData.totalBoxes || "N/A"}</li>
              <li><strong>DTE:</strong> ${formData.dte === "yes" ? "Sí" : "No"}</li>
              <li><strong>Cantidad SKU:</strong> ${formData.skuCount === "1,500+" ? `Más de 1,500: ${formData.estimatedSkuCount}` : formData.skuCount || "N/A"}</li>
              <li><strong>Modo Sin Conexión:</strong> ${formData.offlineMode === "yes" ? "Sí" : "No"}</li>
            </ul>
          `,
        }

        // Email para el Cliente
        const msgToClient = {
          to: formData.email,
          from: "registros@solvendo.cl", // Usar el remitente verificado
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
          console.log("Correos enviados con SendGrid.")
        } catch (emailError: any) {
          console.error("Error al enviar correos con SendGrid:", emailError.response?.body || emailError)
        }
      } else {
        console.warn("SENDGRID_API_KEY no está configurada. Las notificaciones por correo electrónico no se enviarán.")
      }
    }

    return { success: true, message: isFinalSubmission ? "¡Registro de demo exitoso!" : "Progreso guardado." }
  } catch (error) {
    console.error("Error en la Server Action saveDemoProgress:", error)
    return {
      success: false,
      message: "Ocurrió un error inesperado al guardar el progreso. Por favor, inténtalo de nuevo.",
    }
  }
}
