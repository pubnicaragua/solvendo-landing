"use client"  
import { useEffect } from "react"  
import { useRouter } from "next/navigation"  
import { UserDashboard } from "@/components/dashboard/user-dashboard"  
import { Header } from "@/components/layout/header"  
import { useAuth } from "@/contexts/AuthContext"  
  
export default function DashboardPage() {  
  const { user, loading } = useAuth()  
  const router = useRouter()  
  
  useEffect(() => {  
    // Solo redirigir si estamos seguros de que no hay usuario y no está cargando  
    if (!loading && !user) {  
      console.log('🚪 No user found, redirecting to login...')  
      router.replace('/auth/login')  
    }  
  }, [user, loading, router])  
  
  // Mostrar loading mientras se verifica la autenticación  
  if (loading) {  
    return (  
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">  
        <div className="text-center">  
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>  
          <p className="text-gray-600">Cargando...</p>  
        </div>  
      </div>  
    )  
  }  
  
  // No renderizar nada mientras se redirige  
  if (!user) {  
    return null  
  }  
  
  // Usuario autenticado, renderizar dashboard  
  return (  
    <div className="min-h-screen bg-gray-50">  
      <Header onMenuToggle={() => {}} currentView="dashboard" user={user} />  
      <UserDashboard />  
    </div>  
  )  
}