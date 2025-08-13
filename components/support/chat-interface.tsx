"use client"  
  
import { useChat } from "ai/react"  
import { Button } from "@/components/ui/button"  
import { Input } from "@/components/ui/input"  
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"  
import { Send, Loader2 } from "lucide-react"  
import { useEffect, useRef } from "react"  
import Image from "next/image"  
  
export function ChatInterface() {  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({  
    api: "/api/chat",  
  })  
  const messagesEndRef = useRef<HTMLDivElement>(null)  
  
  // Función auxiliar para enviar preguntas frecuentes - CORREGIDA  
  const sendFAQ = (question: string) => {  
    setInput(question) // Usar setInput en lugar de handleInputChange  
    setTimeout(() => handleSubmit(), 0)  
  }  
  
  const scrollToBottom = () => {  
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })  
  }  
  
  useEffect(() => {  
    scrollToBottom()  
  }, [messages])  
  
  return (  
    <Card className="w-full max-w-md h-[600px] flex flex-col rounded-xl shadow-2xl border-none">  
      <CardHeader className="flex flex-row items-center gap-2 p-4 border-b bg-blue-600 text-white rounded-t-xl">  
        <Image src="/images/favicon.png" alt="Solvendo Favicon" width={28} height={28} className="mr-2" style={{ borderRadius: 20 }} />  
        <CardTitle className="text-xl font-semibold">Soporte</CardTitle>  
      </CardHeader>  
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">  
        {messages.length === 0 && (  
          <div className="text-center text-gray-500 mt-10">  
            ¡Hola! Soy tu asistente de Solvendo. ¿En qué puedo ayudarte hoy?  
            <div className="mt-6">  
              <div className="font-semibold mb-2 text-blue-600">Preguntas frecuentes:</div>  
              <div className="flex flex-col gap-2 items-center">  
                <Button variant="outline" size="sm" className="w-full max-w-xs" onClick={() => sendFAQ("¿La demo requiere método de pago?")}>¿La demo requiere método de pago?</Button>  
                <Button variant="outline" size="sm" className="w-full max-w-xs" onClick={() => sendFAQ("¿Qué procesos automatiza Solvendo?")}>¿Qué procesos automatiza Solvendo?</Button>  
                <Button variant="outline" size="sm" className="w-full max-w-xs" onClick={() => sendFAQ("¿Solvendo funciona como software punto de venta (POS)?")}>¿Solvendo funciona como software punto de venta (POS)?</Button>  
              </div>  
            </div>  
          </div>  
        )}  
        {messages.map((m) => (  
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>  
            <div  
              className={`max-w-[75%] p-3 rounded-xl ${  
                m.role === "user"  
                  ? "bg-blue-500 text-white rounded-br-none"  
                  : "bg-white text-gray-800 rounded-tl-none shadow-sm"  
              }`}  
            >  
              {m.content}  
            </div>  
          </div>  
        ))}  
        {isLoading && (  
          <div className="flex justify-start">  
            <div className="max-w-[75%] p-3 rounded-xl bg-white text-gray-800 rounded-tl-none shadow-sm flex items-center gap-2">  
              <Loader2 className="h-4 w-4 animate-spin" />  
              <span>Solvendo está escribiendo...</span>  
            </div>  
          </div>  
        )}  
        <div ref={messagesEndRef} />  
      </CardContent>  
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex items-center space-x-2">  
        <Input  
          className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"  
          value={input}  
          placeholder="Escribe tu mensaje..."  
          onChange={handleInputChange}  
          disabled={isLoading}  
        />  
        <Button  
          type="submit"  
          className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700"  
          disabled={isLoading || !input.trim()}  
        >  
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}  
          <span className="sr-only">Enviar</span>  
        </Button>  
      </form>  
    </Card>  
  )  
}