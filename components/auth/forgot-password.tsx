import React, { useState } from 'react'  
import { Button } from "@/components/ui/button"  
import { Input } from "@/components/ui/input"  
import { Label } from "@/components/ui/label"  
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"  
import { supabase } from "@/lib/supabase"  
import Link from "next/link"  
  
export function ForgotPasswordForm() {  
    const [email, setEmail] = useState('')  
    const [loading, setLoading] = useState(false)  
    const [message, setMessage] = useState('')  
    const [error, setError] = useState('')  
  
    const handleSubmit = async (e: React.FormEvent) => {  
        e.preventDefault()  
        setLoading(true)  
        setError('')  
        setMessage('')  
  
        try {  
            const { error } = await supabase.auth.resetPasswordForEmail(email, {  
                redirectTo: `${window.location.origin}/auth/reset-password`,  
            })  
  
            if (error) throw error  
  
            setMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.')  
        } catch (error: any) {  
            setError(error.message || 'Error al enviar el correo de recuperación')  
        } finally {  
            setLoading(false)  
        }  
    }  
  
    return (  
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">  
            <div className="max-w-md w-full space-y-8">  
                <div className="text-center">  
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">  
                        Recuperar contraseña  
                    </h2>  
                    <p className="mt-2 text-sm text-gray-600">  
                        Ingresa tu correo electrónico para recibir un enlace de recuperación  
                    </p>  
                </div>  
                  
                <Card>  
                    <CardHeader>  
                        <CardTitle>Recuperación de contraseña</CardTitle>  
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
                                <div className="text-red-600 text-sm text-center">  
                                    {error}  
                                </div>  
                            )}  
  
                            {message && (  
                                <div className="text-green-600 text-sm text-center">  
                                    {message}  
                                </div>  
                            )}  
  
                            <Button  
                                type="submit"  
                                className="w-full"  
                                disabled={loading}  
                            >  
                                {loading ? "Enviando..." : "Enviar enlace de recuperación"}  
                            </Button>  
                        </form>  
  
                        <div className="mt-6 text-center">  
                            <Link   
                                href="/auth/login"   
                                className="text-sm text-blue-600 hover:text-blue-500"  
                            >  
                                Volver al inicio de sesión  
                            </Link>  
                        </div>  
                    </CardContent>  
                </Card>  
            </div>  
        </div>  
    )  
}