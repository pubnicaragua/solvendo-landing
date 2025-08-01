"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, X } from "lucide-react"
import { ChatInterface } from "./chat-interface" // Importa el componente de chat

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-[100] w-full max-w-md h-[600px] shadow-lg rounded-xl overflow-hidden">
          <ChatInterface />
        </div>
      )}
      <Button
        className="fixed bottom-4 right-4 z-[101] rounded-full w-16 h-16 flex items-center justify-center shadow-xl bg-blue-600 hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar chat de soporte" : "Abrir chat de soporte"}
      >
        {isOpen ? <X className="h-8 w-8 text-white" /> : <MessageSquare className="h-8 w-8 text-white" />}
      </Button>
    </>
  )
}
