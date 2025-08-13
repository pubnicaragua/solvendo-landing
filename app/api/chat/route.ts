import { NextRequest, NextResponse } from 'next/server'  
import OpenAI from 'openai'  
  
const openai = new OpenAI({  
  apiKey: process.env.OPENAI_API_KEY  
})  
  
export async function POST(request: NextRequest) {  
  try {  
    const { message, context } = await request.json()  
  
    // Prompt conciso pero completo para respuestas directas  
    const systemPrompt = `Eres SolvIA, asistente de Solvendo - plataforma líder de gestión empresarial chilena.  
  
SOLVENDO - FUNCIONALIDADES CLAVE:  
• POS integrado con múltiples terminales y sincronización tiempo real  
• Inventario inteligente con alertas de stock y códigos de barras  
• Facturación electrónica SII automática con folios CAF  
• Gestión de empleados, asistencias y roles personalizables  
• Reportes financieros y analytics en tiempo real  
• Multi-sucursal centralizado con control de cajas  
• Integración con sistemas contables y marketplaces  
  
PLANES: Demo gratuito, Básico, Premium, Enterprise personalizado.  
  
Responde SIEMPRE en español chileno, sé directo y específico sobre funcionalidades, menciona beneficios concretos. Si no sabes algo específico, deriva a contacto comercial.`  
  
    const completion = await openai.chat.completions.create({  
      model: 'gpt-3.5-turbo', // Más rápido que GPT-4  
      messages: [  
        { role: 'system', content: systemPrompt },  
        { role: 'user', content: message }  
      ],  
      max_tokens: 400,  
      temperature: 0.7,  
    })  
  
    const response = completion.choices[0]?.message?.content || 'Lo siento, no pude procesar tu consulta.'  
  
    return NextResponse.json({ response })  
  } catch (error) {  
    console.error('Error calling OpenAI:', error)  
    return NextResponse.json(  
      { response: 'Lo siento, hay un problema técnico momentáneo. Nuestro equipo está disponible para ayudarte.' },  
      { status: 500 }  
    )  
  }  
}