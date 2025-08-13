// app/auth/forgot-password/page.tsx  
"use client"  
  
import { useState } from "react"  
import { Button } from "@/components/ui/button"  
import { Input } from "@/components/ui/input"  
import { Label } from "@/components/ui/label"  
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"  
import { supabase } from "@/lib/supabase"  
import { ArrowLeft, Mail, CheckCircle, Loader2 } from "lucide-react"  
import Link from "next/link"  
  
export default function ForgotPasswordPage() {  
  const [email, setEmail] = useState("")  
  const [loading, setLoading] = useState(false)  
  const [message, setMessage] = useState("")  
  const [error, setError] = useState("")  
  const [emailSent, setEmailSent] = useState(false)  
  
  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault()  
    setLoading(true)  
    setError("")  
    setMessage("")  
  
    try {  
      const { error } = await supabase.auth.resetPasswordForEmail(email, {  
        redirectTo: `${window.location.origin}/auth/reset-password`  
      })  
  
      if (error) {  
        throw error  
      }  
  
      setEmailSent(true)  
      setMessage("Se ha enviado un enlace de recuperación a tu correo electrónico")  
    } catch (error: any) {  
      setError(error.message || "Error al enviar el correo de recuperación")  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  if (emailSent) {  
    return (  
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">  
        <div className="max-w-md w-full space-y-8">  
          <Card>  
            <CardContent className="pt-6">  
              <div className="text-center">  
                <CheckCircle className="mx-auto h-12 w-12 text-green-600" />  
                <h2 className="mt-4 text-2xl font-bold text-gray-900">  
                  Correo enviado  
                </h2>  
                <p className="mt-2 text-sm text-gray-600">  
                  Hemos enviado un enlace de recuperación a <strong>{email}</strong>  
                </p>  
                <p className="mt-4 text-sm text-gray-500">  
                  Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.  
                </p>  
                  
                <div className="mt-6 space-y-4">  
                  <Button  
                    onClick={() => {  
                      setEmailSent(false)  
                      setEmail("")  
                      setMessage("")  
                    }}  
                    variant="outline"  
                    className="w-full"  
                  >  
                    Enviar a otro correo  
                  </Button>  
                    
                  <Link href="/auth/login">  
                    <Button variant="ghost" className="w-full">  
                      <ArrowLeft className="mr-2 h-4 w-4" />  
                      Volver al login  
                    </Button>  
                  </Link>  
                </div>  
              </div>  
            </CardContent>  
          </Card>  
        </div>  
      </div>  
    )  
  }  
  
  return (  
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">  
      <div className="max-w-md w-full space-y-8">  
        <div className="text-center">  
          <Mail className="mx-auto h-12 w-12 text-blue-600" />  
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">  
            Recuperar contraseña  
          </h2>  
          <p className="mt-2 text-sm text-gray-600">  
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña  
          </p>  
        </div>  
          
        <Card>  
          <CardHeader>  
            <CardTitle>Restablecer contraseña</CardTitle>  
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
                  disabled={loading}  
                />  
              </div>  
  
              {error && (  
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">  
                  {error}  
                </div>  
              )}  
  
              {message && (  
                <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-md">  
                  {message}  
                </div>  
              )}  
  
              <Button  
                type="submit"  
                className="w-full"  
                disabled={loading}  
              >  
                {loading ? (  
                  <>  
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />  
                    Enviando...  
                  </>  
                ) : (  
                  "Enviar enlace de recuperación"  
                )}  
              </Button>  
            </form>  
  
            <div className="mt-6 text-center">  
              <Link   
                href="/auth/login"   
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"  
              >  
                <ArrowLeft className="mr-2 h-4 w-4" />  
                Volver al login  
              </Link>  
            </div>  
          </CardContent>  
        </Card>  
      </div>  
    </div>  
  )  
}