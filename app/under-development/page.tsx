"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function UnderDevelopmentPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 text-white p-4">
      <div className="bg-white text-gray-800 rounded-lg shadow-xl p-8 md:p-12 max-w-md w-full text-center space-y-6">
        <Image src="/images/logo_negro.svg" alt="Solvendo Logo" width={80} height={80} className="mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold">¡Gracias por tu interés!</h1>
        <p className="text-lg md:text-xl">Has quedado inscrito para ser de los primeros en probar Solvendo.</p>
        <p className="text-2xl md:text-3xl font-semibold text-blue-600">Fecha de lanzamiento: 14 de Julio</p>
        <p className="text-sm text-gray-600">Te notificaremos por correo electrónico cuando estemos listos.</p>
        <p className="text-sm text-gray-600 mt-4">
          No eres cliente todavía,{" "}
          <Link href="/demo" className="text-blue-600 hover:underline font-semibold">
            ven Regístrate con nosotros
          </Link>
        </p>
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/">Volver a la página principal</Link>
        </Button>
      </div>
    </div>
  )
}
