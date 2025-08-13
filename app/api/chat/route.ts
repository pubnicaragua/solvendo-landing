import { streamText } from "ai"  
import { openai } from "@ai-sdk/openai"  
import { NextResponse } from "next/server"  
  
export async function POST(req: Request) {  
  try {  
    const { messages } = await req.json()  
    console.log("Mensajes recibidos en la API:", messages)  
  
    const result = await streamText({  
      model: openai("gpt-4o"),  
      messages,  
      system: `Eres un asistente de soporte amigable y útil para Solvendo. Si te preguntan "¿Qué es Solvendo?", responde: Solvendo es un sistema simple de usar y eficaz, que permite controlar inventario, ventas y compras de forma eficiente, ahorrando tiempo y reduciendo errores operativos en tu negocio. Responde solo con la información que se te proporciona. Si no tienes la información, indica que no la tienes.`,  
    })  
  
    console.log("Resultado de streamText:", result)  
  
    // Retornar la respuesta de streaming correctamente  
    return result.toDataStreamResponse()  
  } catch (error: any) {  
    console.error("Error en la ruta de API de chat:", error)  
    const errorMessage = error.message || "Ocurrió un error desconocido al procesar la solicitud de chat."  
    return NextResponse.json({ error: errorMessage }, { status: 500 })  
  }  
}