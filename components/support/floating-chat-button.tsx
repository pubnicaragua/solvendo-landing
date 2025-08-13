"use client"  
  
import { useState } from "react"  
import { MessageCircle } from "lucide-react"  
import { ChatInterface } from "./chat-interface"  
import { Button } from "@/components/ui/button"  
import Image from "next/image"  
  
export function FloatingChatButton() {  
  const [isOpen, setIsOpen] = useState(false)  
  
  return (  
    <>  
      <Button  
        onClick={() => setIsOpen(true)}  
        className="fixed bottom-4 right-4 z-40 rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all hover:scale-110 p-2"  
        size="icon"  
      >  
        <Image  
          src="/images/favicon.png"  
          alt="Solvendo Chat"  
          width={32}  
          height={32}  
          className="rounded-full"  
        />  
      </Button>  
        
      <ChatInterface   
        isOpen={isOpen}  
        onClose={() => setIsOpen(false)}  
      />  
    </>  
  )  
}