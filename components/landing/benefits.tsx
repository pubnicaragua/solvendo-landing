"use client" // Added 'use client'
import Image from "next/image" // Re-added Image import

export function Benefits() {
  const benefits = [
    {
      iconSrc: "/images/material-symbols_sell.svg", // Updated to new SVG
      title: "Vende rápido y simple",
      description: "Sistema de punto de venta optimizado para maximizar tus ventas",
    },
    {
      iconSrc: "/images/Asistente.svg", // Reverted to original SVG path
      title: "Entiende tu negocio con un asistente inteligente",
      description: "IA que analiza patrones y te ayuda a tomar mejores decisiones",
    },
    {
      iconSrc: "/images/Gestiona.svg", // Reverted to original SVG path
      title: "Gestiona todo en un solo lugar",
      description: "Centraliza empleados, inventario y ventas en una plataforma",
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-16">Únete al cambio, transforma tu gestión con Solvendo</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center space-y-4 p-6">
              <div className="w-16 h-16 mx-auto flex items-center justify-center">
                {" "}
                {/* Removed bg-blue-100 and rounded-full */}
                <Image src={benefit.iconSrc || "/placeholder.svg"} alt={benefit.title} width={32} height={32} />
              </div>
              <h3 className="text-xl font-semibold">{benefit.title}</h3>
              <p className="text-gray-600 text-center">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
