"use client"  
import Link from "next/link"  
import { useState } from "react"  
import { Menu, X, User, Settings } from "lucide-react"  
import { Button } from "@/components/ui/button"  
import { usePathname } from "next/navigation"  
import { useAuth } from "@/contexts/AuthContext"  
import Image from "next/image"  
  
interface HeaderProps {  
  onMenuToggle?: () => void  
  currentView?: string  
  user?: any  
}  
  
export function Header({ onMenuToggle, currentView, user: propUser }: HeaderProps) {  
  const [isMenuOpen, setIsMenuOpen] = useState(false)  
  const pathname = usePathname()  
  const { user: contextUser, signOut } = useAuth()  
  
  // Usar el usuario del prop o del contexto  
  const user = propUser || contextUser  
  
  const isActive = (path: string) => {  
    if (path.startsWith("/#")) {  
      return "hover:text-blue-600"  
    }  
    return pathname === path ? "text-blue-600 font-medium" : "hover:text-blue-600"  
  }  
  
  const handleLogout = async () => {  
    try {  
      await signOut()  
    } catch (error) {  
      console.error('Error cerrando sesión:', error)  
    }  
  }  
  
  return (  
    <header className="border-b bg-white sticky top-0 z-50">  
      <div className="container mx-auto flex items-center justify-between p-4">  
        <div className="flex items-center gap-8">  
          <Link href="/" className="flex items-center gap-2">  
            <Image src="/images/logo_negro.svg" alt="Solvendo Logo" width={130} height={54} />  
          </Link>  
            
          {/* Desktop Navigation */}  
          <nav className="hidden md:flex items-center gap-6">  
            <Link href="/#tariff-simulator-section" className={`text-sm ${isActive("/#tariff-simulator-section")}`}>  
              Simular tarifa  
            </Link>  
            <Link href="/#design-features-section" className={`text-sm ${isActive("/#design-features-section")}`}>  
              Herramientas  
            </Link>  
            <Link href="/informacion" className={`text-sm ${isActive("/informacion")}`}>  
              Información  
            </Link>  
          </nav>  
        </div>  
  
        {/* Desktop Actions */}  
        <div className="hidden md:flex items-center gap-4">  
          {user ? (  
            <div className="flex items-center gap-3">  
              {/* Botón de Dashboard */}  
              <Link href="/dashboard">  
                <Button variant="outline" size="sm" className="flex items-center gap-2">  
                  <Settings className="h-4 w-4" />  
                  Dashboard  
                </Button>  
              </Link>  
                
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">  
                <User className="w-4 h-4 text-gray-600" />  
              </div>  
              <div className="hidden sm:block">  
                <p className="text-sm font-medium text-gray-900">  
                  {user.nombres || user.name || 'Usuario'}  
                </p>  
                <button  
                  onClick={handleLogout}  
                  className="text-xs text-gray-500 hover:text-gray-700"  
                >  
                  Cerrar sesión  
                </button>  
              </div>  
            </div>  
          ) : (  
            <>  
              <Link href="/auth/login" className="flex items-center gap-2 text-sm font-medium hover:text-blue-600">  
                <User className="h-4 w-4" />  
                Iniciar sesión  
              </Link>  
              <Button asChild>  
                <Link href="/demo">Probar demo</Link>  
              </Button>  
            </>  
          )}  
        </div>  
  
        {/* Mobile Menu Button */}  
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>  
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}  
        </button>  
      </div>  
  
      {/* Mobile Menu */}  
      {isMenuOpen && (  
        <div className="md:hidden border-t bg-white">  
          <nav className="container mx-auto py-4 space-y-4">  
            <div className="flex justify-center mb-4">  
              <Image src="/images/logo_negro.svg" alt="Solvendo Logo" width={32} height={32} />  
            </div>  
            <Link href="/#tariff-simulator-section" className="block text-sm font-medium hover:text-blue-600">  
              Simular tarifa  
            </Link>  
            <Link href="/#design-features-section" className="block text-sm font-medium hover:text-blue-600">  
              Herramientas  
            </Link>  
            <Link href="/informacion" className="block text-sm font-medium hover:text-blue-600">  
              Información  
            </Link>  
            <hr />  
            {user ? (  
              <div className="space-y-2">  
                {/* Botón de Dashboard para móvil */}  
                <Link href="/dashboard" className="block w-full">  
                  <Button variant="outline" className="w-full flex items-center gap-2">  
                    <Settings className="h-4 w-4" />  
                    Dashboard  
                  </Button>  
                </Link>  
                  
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900">  
                  <User className="h-4 w-4" />  
                  {user.nombres || user.name || 'Usuario'}  
                </div>  
                <button  
                  onClick={handleLogout}  
                  className="block w-full text-left text-sm text-gray-500 hover:text-gray-700"  
                >  
                  Cerrar sesión  
                </button>  
              </div>  
            ) : (  
              <>  
                <Link href="/auth/login" className="flex items-center gap-2 text-sm font-medium hover:text-blue-600">  
                  <User className="h-4 w-4" />  
                  Iniciar sesión  
                </Link>  
                <Button asChild className="w-full">  
                  <Link href="/demo">Probar demo</Link>  
                </Button>  
              </>  
            )}  
          </nav>  
        </div>  
      )}  
    </header>  
  )  
}