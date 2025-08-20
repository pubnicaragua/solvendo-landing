"use client"  
  
import { useState, useEffect } from "react"  
import { useRouter } from "next/navigation"  
import { Button } from "@/components/ui/button"  
import { Input } from "@/components/ui/input"  
import { Label } from "@/components/ui/label"  
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"  
import { useAuth } from "@/contexts/AuthContext"  
import { Eye, EyeOff, Loader2 } from "lucide-react"  
import Link from "next/link"  
  
export function LoginForm() {  
  const [email, setEmail] = useState("")  
  const [password, setPassword] = useState("")  
  const [showPassword, setShowPassword] = useState(false)  
  const [isSubmitting, setIsSubmitting] = useState(false) // ✅ Estado local separado  
  const [error, setError] = useState("")  
  const { signIn, user, loading: authLoading } = useAuth()  
  const router = useRouter()  
  
  // ✅ Efecto optimizado para navegación  
  useEffect(() => {  
    // Solo redirigir si hay usuario Y no estamos en proceso de autenticación  
    if (user && !authLoading && !isSubmitting) {  
      console.log('✅ Usuario autenticado, redirigiendo a dashboard...')  
      router.push('/dashboard')  
    }  
  }, [user, authLoading, isSubmitting, router])  
  
  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault()  
      
    // Prevenir múltiples submissions  
    if (isSubmitting || authLoading) return  
      
    setIsSubmitting(true)  
    setError("")  
  
    try {  
      await signIn(email, password)  
      console.log('✅ Login exitoso')  
      // La navegación se maneja en el useEffect  
    } catch (error: any) {  
      console.error('❌ Error en login:', error)  
      setError(error.message || "Error al iniciar sesión")  
    } finally {  
      setIsSubmitting(false)  
    }  
  }  
  
  // ✅ Estado de loading combinado  
  const isLoading = isSubmitting || authLoading  
  
  return (  
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">  
      <div className="max-w-md w-full space-y-8">  
        <div className="text-center">  
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">  
            Iniciar sesión  
          </h2>  
          <p className="mt-2 text-sm text-gray-600">  
            Accede a tu cuenta de Solvendo  
          </p>  
        </div>  
            
        <Card>  
          <CardHeader>  
            <CardTitle>Bienvenido de vuelta</CardTitle>  
          </CardHeader>  
          <CardContent>  
            <form onSubmit={handleSubmit} className="space-y-6">  
              <div>  
                <Label htmlFor="email">Correo electrónico</Label>  
                <Input  
                  id="email"  
                  type="email"  
                  value={email}  
                  onChange={(e) => setEmail(e.target.value)}  
                  placeholder="correo@ejemplo.com"  
                  required  
                  disabled={isLoading}  
                />  
              </div>  
                  
              <div>  
                <Label htmlFor="password">Contraseña</Label>  
                <div className="relative">  
                  <Input  
                    id="password"  
                    type={showPassword ? "text" : "password"}  
                    value={password}  
                    onChange={(e) => setPassword(e.target.value)}  
                    placeholder="Tu contraseña"  
                    required  
                    disabled={isLoading}  
                  />  
                  <button  
                    type="button"  
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"  
                    onClick={() => setShowPassword(!showPassword)}  
                    disabled={isLoading}  
                  >  
                    {showPassword ? (  
                      <EyeOff className="h-4 w-4 text-gray-400" />  
                    ) : (  
                      <Eye className="h-4 w-4 text-gray-400" />  
                    )}  
                  </button>  
                </div>  
              </div>  
  
              {error && (  
                <div className="text-red-600 text-sm text-center">  
                  {error}  
                </div>  
              )}  
  
              <div className="flex items-center justify-between">  
                <div className="text-sm">  
                  <Link  
                    href="/auth/forgot-password"  
                    className="font-medium text-blue-600 hover:text-blue-500"  
                  >  
                    ¿Olvidaste tu contraseña?  
                  </Link>  
                </div>  
              </div>  
  
              <Button  
                type="submit"  
                className="w-full"  
                disabled={isLoading}  
              >  
                {isLoading ? (  
                  <>  
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />  
                    {isSubmitting ? "Iniciando sesión..." : "Cargando..."}  
                  </>  
                ) : (  
                  "Iniciar sesión"  
                )}  
              </Button>  
            </form>  
  
            <div className="mt-6 text-center">  
              <p className="text-sm text-gray-600">  
                ¿No tienes una cuenta?{" "}  
                <Link  
                  href="/demo"  
                  className="font-medium text-blue-600 hover:text-blue-500"  
                >  
                  Prueba la demo  
                </Link>  
              </p>  
            </div>  
          </CardContent>  
        </Card>  
      </div>  
    </div>  
  )  
}