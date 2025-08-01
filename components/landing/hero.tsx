"use client"

import Image from "next/image" // Re-added Image import
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            El aliado que hace <span className="text-blue-600">crecer tu negocio</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Mejora tu gestión desde un solo lugar. Administra tus empleados, controla el inventario y gestiona tus
            ventas de forma eficiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Refactored Link and Button usage */}
            <Link href="/demo" passHref>
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                Probar demo
              </Button>
            </Link>
            <Link href="/#tariff-simulator-section" passHref>
              <Button variant="outline" size="lg">
                Simular tarifa
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative">
          <Image
            src="/images/Hero_image.png"
            alt="Solvendo Dashboard y Apps"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg"
            priority
          />
        </div>
      </div>
    </section>
  )
}
