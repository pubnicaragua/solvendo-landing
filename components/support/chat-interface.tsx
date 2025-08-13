"use client"  
  
import { useState, useEffect, useRef } from "react"  
import { Button } from "@/components/ui/button"  
import { Input } from "@/components/ui/input"  
import { Card, CardContent, CardHeader } from "@/components/ui/card"  
import { Badge } from "@/components/ui/badge"  
import {   
  MessageCircle,   
  Send,   
  X,   
  Minimize2,   
  Maximize2,  
  Bot,  
  User,  
  ThumbsUp,  
  ThumbsDown,  
  Paperclip,  
  Smile,  
  Settings,  
  Volume2,  
  VolumeX,  
  Zap  
} from "lucide-react"  
import Image from "next/image"  
  
interface ChatInterfaceProps {  
  isOpen: boolean  
  onClose: () => void  
  user?: any  
}  
  
interface Message {  
  id: string  
  content: string  
  sender: 'user' | 'agent' | 'bot'  
  timestamp: Date  
  type: 'text' | 'image' | 'file'  
  status?: 'sending' | 'sent' | 'delivered' | 'read'  
  metadata?: {  
    agentName?: string  
    agentAvatar?: string  
    rating?: number  
  }  
}  
  
interface ChatSession {  
  id: string  
  user_id: string  
  status: 'waiting' | 'active' | 'resolved' | 'closed'  
  category: string  
  created_at: string  
  messages: Message[]  
}  
  
const QUICK_RESPONSES = [  
  "¿Qué es Solvendo? Lo necesito para mi negocio",  
  "¿Cómo funciona el sistema POS?",  
  "¿Qué incluye la facturación electrónica?",  
  "¿Cómo gestiono el inventario?",  
  "¿Puedo manejar múltiples sucursales?",  
  "¿Cuáles son los precios y planes?",  
  "¿Cómo solicito una demo?",  
  "¿Qué soporte técnico ofrecen?"  
]  
  
const CATEGORIES = [  
  { id: 'general', name: 'Consulta General', color: 'bg-blue-100 text-blue-800' },  
  { id: 'technical', name: 'Soporte Técnico', color: 'bg-green-100 text-green-800' },  
  { id: 'sales', name: 'Ventas', color: 'bg-purple-100 text-purple-800' },  
  { id: 'demo', name: 'Demo', color: 'bg-orange-100 text-orange-800' }  
]  
  
// Clave para localStorage  
const CHAT_STORAGE_KEY = 'solvendo_chat_session'  
  
export function ChatInterface({ isOpen, onClose, user }: ChatInterfaceProps) {  
  const [messages, setMessages] = useState<Message[]>([])  
  const [newMessage, setNewMessage] = useState("")  
  const [isMinimized, setIsMinimized] = useState(false)  
  const [isTyping, setIsTyping] = useState(false)  
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)  
  const [selectedCategory, setSelectedCategory] = useState<string>("general")  
  const [showQuickResponses, setShowQuickResponses] = useState(true)  
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')  
  const [unreadCount, setUnreadCount] = useState(0)  
  const [soundEnabled, setSoundEnabled] = useState(true)  
    
  const messagesEndRef = useRef<HTMLDivElement>(null)  
  const fileInputRef = useRef<HTMLInputElement>(null)  
  
  // Auto-scroll to bottom  
  const scrollToBottom = () => {  
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })  
  }  
  
  useEffect(() => {  
    scrollToBottom()  
  }, [messages])  
  
  // Cargar sesión persistente al abrir  
  useEffect(() => {  
    if (isOpen) {  
      loadPersistedSession()  
    }  
  }, [isOpen])  
  
  // Guardar sesión en localStorage cuando cambian los mensajes  
  useEffect(() => {  
    if (chatSession && messages.length > 0) {  
      saveSessionToStorage()  
    }  
  }, [messages, chatSession])  
  
  // Reproducir sonido de notificación  
  const playNotificationSound = () => {  
    if (soundEnabled) {  
      try {  
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()  
        const oscillator = audioContext.createOscillator()  
        const gainNode = audioContext.createGain()  
          
        oscillator.connect(gainNode)  
        gainNode.connect(audioContext.destination)  
          
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)  
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)  
          
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)  
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)  
          
        oscillator.start(audioContext.currentTime)  
        oscillator.stop(audioContext.currentTime + 0.2)  
      } catch (error) {  
        console.log('Audio not supported')  
      }  
    }  
  }  
  
  // Cargar sesión persistente  
  const loadPersistedSession = () => {  
    try {  
      const savedSession = localStorage.getItem(CHAT_STORAGE_KEY)  
      if (savedSession) {  
        const parsedSession: ChatSession = JSON.parse(savedSession)  
          
        const messagesWithDates = parsedSession.messages.map(msg => ({  
          ...msg,  
          timestamp: new Date(msg.timestamp)  
        }))  
          
        setChatSession(parsedSession)  
        setMessages(messagesWithDates)  
        setShowQuickResponses(messagesWithDates.length === 0)  
        setConnectionStatus('connected')  
          
        console.log('Sesión de chat restaurada:', parsedSession.id)  
      } else {  
        initializeChatSession()  
      }  
    } catch (error) {  
      console.error('Error cargando sesión persistente:', error)  
      initializeChatSession()  
    }  
  }  
  
  // Guardar sesión en localStorage  
  const saveSessionToStorage = () => {  
    if (chatSession) {  
      const sessionToSave = {  
        ...chatSession,  
        messages: messages  
      }  
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessionToSave))  
    }  
  }  
  
  // Limpiar sesión persistente  
  const clearPersistedSession = () => {  
    localStorage.removeItem(CHAT_STORAGE_KEY)  
    setMessages([])  
    setChatSession(null)  
    setShowQuickResponses(true)  
    initializeChatSession()  
  }  
  
  const initializeChatSession = async () => {  
    try {  
      const newSession: ChatSession = {  
        id: `session_${Date.now()}`,  
        user_id: user?.id || 'anonymous',  
        status: 'active',  
        category: 'general',  
        created_at: new Date().toISOString(),  
        messages: []  
      }  
  
      setChatSession(newSession)  
      setConnectionStatus('connecting')  
        
      setTimeout(() => {  
        setConnectionStatus('connected')  
        addWelcomeMessage()  
      }, 300)  
    } catch (error) {  
      console.error('Error initializing chat session:', error)  
    }  
  }  
  
  const addWelcomeMessage = () => {  
    const welcomeMessage: Message = {  
      id: `msg_${Date.now()}`,  
      content: `Hola${user?.name ? ` ${user.name}` : ''}! Soy SolvIA, tu asistente de Solvendo.  
  
Estoy aquí para ayudarte con cualquier consulta sobre nuestra plataforma de gestión empresarial.  
  
¿En qué puedo ayudarte hoy?`,  
      sender: 'bot',  
      timestamp: new Date(),  
      type: 'text',  
      status: 'delivered',  
      metadata: {  
        agentName: 'SolvIA',  
        agentAvatar: '/images/favicon.png'  
      }  
    }  
    setMessages([welcomeMessage])  
    playNotificationSound()  
  }  
  
  const sendMessage = async (content: string, type: 'text' | 'image' | 'file' = 'text') => {  
    if (!content.trim() && type === 'text') return  
  
    const userMessage: Message = {  
      id: `msg_${Date.now()}`,  
      content,  
      sender: 'user',  
      timestamp: new Date(),  
      type,  
      status: 'sending'  
    }  
  
    setMessages(prev => [...prev, userMessage])  
    setNewMessage("")  
    setShowQuickResponses(false)  
  
    setTimeout(() => {  
      setMessages(prev =>   
        prev.map(msg =>   
          msg.id === userMessage.id   
            ? { ...msg, status: 'delivered' as const }  
            : msg  
        )  
      )  
    }, 100)  
  
    await callOpenAIResponse(content)  
  }  
  
  const callOpenAIResponse = async (userMessage: string) => {  
    setIsTyping(true)  
      
    try {  
      const context = {  
        user: user?.name || 'Usuario',  
        categoria: selectedCategory,  
        session_id: chatSession?.id  
      }  
  
      const response = await fetch('/api/chat', {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({  
          message: userMessage,  
          context: context  
        })  
      })  
  
      if (!response.ok) {  
        throw new Error(`HTTP error! status: ${response.status}`)  
      }  
  
      const data = await response.json()  
        
      const aiMessage: Message = {  
        id: `msg_${Date.now()}`,  
        content: data.response || 'Lo siento, no pude procesar tu consulta.',  
        sender: 'agent',  
        timestamp: new Date(),  
        type: 'text',  
        status: 'delivered',  
        metadata: {  
          agentName: 'SolvIA',  
          agentAvatar: '/images/favicon.png'  
        }  
      }  
        
      setMessages(prev => [...prev, aiMessage])  
      playNotificationSound()  
        
      if (isMinimized) {  
        setUnreadCount(prev => prev + 1)  
      }  
    } catch (error) {  
      console.error('Error calling OpenAI:', error)  
      const errorMessage: Message = {  
        id: `msg_${Date.now()}`,  
        content: 'Lo siento, hay un problema de conexión. Por favor intenta de nuevo.',  
        sender: 'agent',  
        timestamp: new Date(),  
        type: 'text',  
        status: 'delivered',  
        metadata: {  
          agentName: 'SolvIA',  
          agentAvatar: '/images/favicon.png'  
        }  
      }  
      setMessages(prev => [...prev, errorMessage])  
    } finally {  
      setIsTyping(false)  
    }  
  }  
  
  const handleQuickResponse = (response: string) => {  
    sendMessage(response)  
  }  
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {  
    const file = event.target.files?.[0]  
    if (!file) return  
  
    const fileName = file.name  
    sendMessage(`Archivo adjunto: ${fileName}`, 'file')  
  }  
  
  const rateMessage = async (messageId: string, rating: number) => {  
    setMessages(prev =>  
      prev.map(msg =>  
        msg.id === messageId  
          ? { ...msg, metadata: { ...msg.metadata, rating } }  
          : msg  
      )  
    )  
  }  
  
  const endChat = async () => {  
    if (chatSession) {  
      setChatSession({  
        ...chatSession,  
        status: 'resolved'  
      })  
        
      const endMessage: Message = {  
        id: `msg_${Date.now()}`,  
        content: "Gracias por contactarnos! Tu consulta ha sido marcada como resuelta. Si necesitas más ayuda, no dudes en escribirnos nuevamente.",  
        sender: 'agent',  
        timestamp: new Date(),  
        type: 'text',  
        status: 'delivered',  
        metadata: {  
          agentName: 'SolvIA',  
          agentAvatar: '/images/favicon.png'  
        }  
      }  
        
      setMessages(prev => [...prev, endMessage])  
    }  
  }  
  
  const handleMinimize = () => {  
    setIsMinimized(!isMinimized)  
    if (!isMinimized) {  
      setUnreadCount(0)  
    }  
  }  
  
  if (!isOpen) return null  
  
  return (  
    <>  
      <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${  
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'  
      }`}>  
        <Card className="h-full flex flex-col shadow-2xl border-2 border-blue-200 bg-white backdrop-blur-sm">  
          {/* Header Profesional */}  
          <CardHeader className="p-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white rounded-t-lg relative overflow-hidden">  
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>  
              
            <div className="flex items-center justify-between relative z-10">  
              <div className="flex items-center space-x-3">  
                <div className="relative">  
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">  
                    <Image  
                      src="/images/favicon.png"  
                      alt="Solvendo Logo"  
                      width={24}  
                      height={24}  
                      className="rounded-full"  
                    />  
                  </div>  
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${  
                    connectionStatus === 'connected' ? 'bg-green-400' :  
                    connectionStatus === 'connecting' ? 'bg-yellow-400' :  
                    'bg-red-400'  
                  }`} />  
                </div>  
                <div>  
                  <h3 className="font-bold text-sm">Soporte Solvendo</h3>  
                  <p className="text-xs opacity-90 flex items-center space-x-1">  
                    <Zap className="w-3 h-3" />  
                    <span>  
                      {connectionStatus === 'connected' ? 'SolvIA - Asistente IA' :  
                       connectionStatus === 'connecting' ? 'Conectando...' :  
                       'Desconectado'}  
                    </span>  
                  </p>
                  </div>  
              </div>  
              <div className="flex items-center space-x-1">  
                {unreadCount > 0 && (  
                  <Badge variant="secondary" className="bg-red-500 text-white text-xs animate-bounce">  
                    {unreadCount}  
                  </Badge>  
                )}  
                <Button  
                  variant="ghost"  
                  size="sm"  
                  onClick={() => setSoundEnabled(!soundEnabled)}  
                  className="text-white hover:bg-white/20 transition-colors"  
                  title={soundEnabled ? "Desactivar sonido" : "Activar sonido"}  
                >  
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}  
                </Button>  
                <Button  
                  variant="ghost"  
                  size="sm"  
                  onClick={handleMinimize}  
                  className="text-white hover:bg-white/20 transition-colors"  
                  title={isMinimized ? "Maximizar" : "Minimizar"}  
                >  
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}  
                </Button>  
                <Button  
                  variant="ghost"  
                  size="sm"  
                  onClick={clearPersistedSession}  
                  className="text-white hover:bg-white/20 transition-colors"  
                  title="Nuevo chat"  
                >  
                  <Settings className="w-4 h-4" />  
                </Button>  
                <Button  
                  variant="ghost"  
                  size="sm"  
                  onClick={onClose}  
                  className="text-white hover:bg-white/20 transition-colors"  
                  title="Cerrar chat"  
                >  
                  <X className="w-4 h-4" />  
                </Button>  
              </div>  
            </div>  
          </CardHeader>  
  
          {/* Chat Body - Only show when not minimized */}  
          {!isMinimized && (  
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">  
              {/* Category Selection */}  
              {showQuickResponses && (  
                <div className="space-y-3 animate-fadeIn">  
                  <div className="text-sm font-semibold text-gray-700 flex items-center space-x-2">  
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>  
                    <span>Categoría de consulta:</span>  
                  </div>  
                  <div className="flex flex-wrap gap-2">  
                    {CATEGORIES.map((category) => (  
                      <Badge  
                        key={category.id}  
                        variant={selectedCategory === category.id ? "default" : "outline"}  
                        className={`cursor-pointer text-xs transition-all hover:scale-105 hover:shadow-md ${  
                          selectedCategory === category.id   
                            ? `${category.color} shadow-md`   
                            : 'hover:bg-blue-50'  
                        }`}  
                        onClick={() => setSelectedCategory(category.id)}  
                      >  
                        {category.name}  
                      </Badge>  
                    ))}  
                  </div>  
                </div>  
              )}  
  
              {/* Quick Responses */}  
              {showQuickResponses && (  
                <div className="space-y-3 animate-fadeIn">  
                  <div className="text-sm font-semibold text-gray-700 flex items-center space-x-2">  
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>  
                    <span>Consultas frecuentes:</span>  
                  </div>  
                  <div className="grid grid-cols-1 gap-2">  
                    {QUICK_RESPONSES.map((response, index) => (  
                      <Button  
                        key={index}  
                        variant="outline"  
                        size="sm"  
                        className="text-left justify-start h-auto py-3 px-4 text-xs hover:bg-blue-50 hover:border-blue-300 transition-all hover:shadow-sm"  
                        onClick={() => handleQuickResponse(response)}  
                      >  
                        <span className="text-blue-600 mr-2">•</span>  
                        {response}  
                      </Button>  
                    ))}  
                  </div>  
                </div>  
              )}  
  
              {/* Messages */}  
              {messages.map((message) => (  
                <div  
                  key={message.id}  
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}  
                >  
                  <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>  
                    {/* Agent/Bot Avatar and Name */}  
                    {message.sender !== 'user' && (  
                      <div className="flex items-center space-x-2 mb-2">  
                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md border border-gray-200 p-1">  
                          <Image  
                            src="/images/favicon.png"  
                            alt="SolvIA"  
                            width={20}  
                            height={20}  
                            className="rounded-full"  
                          />  
                        </div>  
                        <span className="text-xs text-gray-600 font-semibold">  
                          {message.metadata?.agentName || 'SolvIA'}  
                        </span>  
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>  
                      </div>  
                    )}  
  
                    {/* Message Bubble */}  
                    <div  
                      className={`px-4 py-3 rounded-2xl shadow-sm transition-all hover:shadow-md ${  
                        message.sender === 'user'  
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white ml-4'  
                          : 'bg-white text-gray-800 border border-gray-200 mr-4'  
                      }`}  
                    >  
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>  
                        
                      {/* Message Status */}  
                      <div className={`flex items-center justify-between mt-2 ${  
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'  
                      }`}>  
                        <span className="text-xs font-medium">  
                          {message.timestamp.toLocaleTimeString('es-CL', {   
                            hour: '2-digit',   
                            minute: '2-digit'   
                          })}  
                        </span>  
                        {message.sender === 'user' && (  
                          <span className="text-xs">  
                            {message.status === 'sending' && '⏳'}  
                            {message.status === 'sent' && '✓'}  
                            {message.status === 'delivered' && '✓✓'}  
                            {message.status === 'read' && '✓✓'}  
                          </span>  
                        )}  
                      </div>  
                    </div>  
  
                    {/* Rating for Agent Messages */}  
                    {message.sender !== 'user' && !message.metadata?.rating && (  
                      <div className="flex items-center space-x-2 mt-2 ml-9">  
                        <span className="text-xs text-gray-500">¿Te ayudó esta respuesta?</span>  
                        <Button  
                          variant="ghost"  
                          size="sm"  
                          className="h-6 w-6 p-0 hover:bg-green-100 transition-colors"  
                          onClick={() => rateMessage(message.id, 1)}  
                        >  
                          <ThumbsUp className="w-3 h-3 text-green-600" />  
                        </Button>  
                        <Button  
                          variant="ghost"  
                          size="sm"  
                          className="h-6 w-6 p-0 hover:bg-red-100 transition-colors"  
                          onClick={() => rateMessage(message.id, -1)}  
                        >  
                          <ThumbsDown className="w-3 h-3 text-red-600" />  
                        </Button>  
                      </div>  
                    )}  
  
                    {/* Show Rating */}  
                    {message.metadata?.rating && (  
                      <div className="flex items-center space-x-1 mt-2 ml-9">  
                        <span className="text-xs text-gray-500">Calificación:</span>  
                        {message.metadata.rating > 0 ? (  
                          <ThumbsUp className="w-3 h-3 text-green-600" />  
                        ) : (  
                          <ThumbsDown className="w-3 h-3 text-red-600" />  
                        )}  
                      </div>  
                    )}  
                  </div>  
                </div>  
              ))}  
  
              {/* Typing Indicator */}  
              {isTyping && (  
                <div className="flex justify-start animate-fadeIn">  
                  <div className="flex items-center space-x-2">  
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md border border-gray-200 p-1">  
                      <Image  
                        src="/images/favicon.png"  
                        alt="SolvIA"  
                        width={20}  
                        height={20}  
                        className="rounded-full"  
                      />  
                    </div>  
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-sm">  
                      <div className="flex space-x-1">  
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>  
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>  
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>  
                      </div>  
                    </div>  
                  </div>  
                </div>  
              )}  
  
              <div ref={messagesEndRef} />  
            </CardContent>  
          )}  
  
          {/* Input Area */}  
          {!isMinimized && (  
            <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">  
              {/* Chat Actions */}  
              <div className="flex items-center justify-between mb-3">  
                <div className="flex items-center space-x-2">  
                  <Button  
                    variant="ghost"  
                    size="sm"  
                    onClick={() => fileInputRef.current?.click()}  
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"  
                    title="Adjuntar archivo"  
                  >  
                    <Paperclip className="w-4 h-4" />  
                  </Button>  
                  <input  
                    ref={fileInputRef}  
                    type="file"  
                    className="hidden"  
                    onChange={handleFileUpload}  
                    accept="image/*,.pdf,.doc,.docx,.txt"  
                  />  
                  <Button  
                    variant="ghost"  
                    size="sm"  
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"  
                    title="Emojis"  
                  >  
                    <Smile className="w-4 h-4" />  
                  </Button>  
                </div>  
                  
                {chatSession?.status === 'active' && (  
                  <Button  
                    variant="ghost"  
                    size="sm"  
                    onClick={endChat}  
                    className="text-green-600 hover:text-green-700 text-xs hover:bg-green-50 transition-colors"  
                  >  
                    Marcar como resuelto  
                  </Button>  
                )}  
              </div>  
  
              {/* Message Input */}  
              <div className="flex space-x-2">  
                <Input  
                  value={newMessage}  
                  onChange={(e) => setNewMessage(e.target.value)}  
                  placeholder="Escribe tu mensaje..."  
                  className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"  
                  onKeyPress={(e) => {  
                    if (e.key === 'Enter' && !e.shiftKey) {  
                      e.preventDefault()  
                      sendMessage(newMessage)  
                    }  
                  }}  
                  disabled={isTyping || chatSession?.status === 'resolved'}  
                />  
                <Button  
                  onClick={() => sendMessage(newMessage)}  
                  disabled={!newMessage.trim() || isTyping || chatSession?.status === 'resolved'}  
                  className="px-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all"  
                >  
                  <Send className="w-4 h-4" />  
                </Button>  
              </div>  
  
              {/* Connection Status */}  
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">  
                <div className="flex items-center space-x-1">  
                  <div className={`w-2 h-2 rounded-full ${  
                    connectionStatus === 'connected' ? 'bg-green-400' :  
                    connectionStatus === 'connecting' ? 'bg-yellow-400' :  
                    'bg-red-400'  
                  }`} />  
                  <span>  
                    {connectionStatus === 'connected' ? 'Conectado con OpenAI' :  
                     connectionStatus === 'connecting' ? 'Conectando...' :  
                     'Desconectado'}  
                  </span>  
                </div>  
                  
                {chatSession && (  
                  <Badge variant="outline" className="text-xs">  
                    {chatSession.status === 'waiting' && 'En espera'}  
                    {chatSession.status === 'active' && 'Activo'}  
                    {chatSession.status === 'resolved' && 'Resuelto'}  
                    {chatSession.status === 'closed' && 'Cerrado'}  
                  </Badge>  
                )}  
              </div>  
            </div>  
          )}  
  
          {/* Minimized State */}  
          {isMinimized && (  
            <CardContent className="flex-1 flex items-center justify-between px-4 py-3">  
              <div className="flex items-center space-x-2">  
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md border border-gray-200 p-1">  
                  <Image  
                    src="/images/favicon.png"  
                    alt="Solvendo"  
                    width={16}  
                    height={16}  
                    className="rounded-full"  
                  />  
                </div>  
                <span className="text-sm font-medium">Chat de Soporte</span>  
              </div>  
              {unreadCount > 0 && (  
                <Badge variant="secondary" className="bg-red-500 text-white text-xs animate-pulse">  
                  {unreadCount}  
                </Badge>  
              )}  
            </CardContent>  
          )}  
        </Card>  
      </div>  
  
      {/* CSS personalizado para animaciones */}  
      <style jsx>{`  
        @keyframes fadeIn {  
          from { opacity: 0; transform: translateY(10px); }  
          to { opacity: 1; transform: translateY(0); }  
        }  
        .animate-fadeIn {  
          animation: fadeIn 0.3s ease-out;  
        }  
      `}</style>  
    </>  
  )  
}