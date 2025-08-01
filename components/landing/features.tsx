"use client"

import Image from "next/image" // Re-added Image import
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Features() {
  return (
    <>
      {/* Features Detail - This section now only contains the detailed features */}
      <section id="detailed-features" className="py-16 md:py-24">
        <div className="container mx-auto px-4 space-y-24">
          {/* Employee Management */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold">Gestión de colaboradores APP</h3>
              <p className="text-lg text-gray-600">
                Muestra turnos, controla asistencia y gestiona solicitudes desde un solo lugar. Toda la operación de tu
                personal conectada con tu negocio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Refactored Link and Button usage */}
                <Link href="/demo" passHref>
                  <Button>Probar demo</Button>
                </Link>
                <Link href="/informacion" passHref>
                  <Button variant="outline">Ver más información</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/Colaboradores.png"
                alt="Gestión de empleados APP"
                width={150}
                height={300}
                className="w-full h-auto rounded-lg max-w-xs mx-auto"
              />
            </div>
          </div>

          {/* POS System */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <Image
                src="/images/POS.png"
                alt="Punto de venta SOLVENDO"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold">Punto de venta SOLVENDO</h3>
              <p className="text-lg text-gray-600">
                Venda de forma rápida y organizada con un sistema de punto de venta diseñado para optimizar su negocio.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Refactored Link and Button usage */}
                <Link href="/demo" passHref>
                  <Button>Probar demo</Button>
                </Link>
                <Link href="/informacion" passHref>
                  <Button variant="outline">Ver más información</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Backoffice */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold">Backoffice GE/POS APP</h3>
              <p className="text-lg text-gray-600">
                Controle su negocio desde un solo lugar: inventario, ventas y reportes con un asistente inteligente que
                agiliza decisiones y automatiza las tareas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Refactored Link and Button usage */}
                <Link href="/demo" passHref>
                  <Button>Probar demo</Button>
                </Link>
                <Link href="/informacion" passHref>
                  <Button variant="outline">Ver más información</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/Backoffice.png"
                alt="Backoffice GE/POS APP"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
