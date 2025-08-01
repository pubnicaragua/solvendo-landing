"use client"

import { useState, useEffect } from "react" // Import useEffect
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function DetailedApps() {
  const [activeApp, setActiveApp] = useState("employees")

  useEffect(() => {
    // Read hash from URL on component mount
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "")
      if (hash) {
        const foundApp = apps.find((app) => app.id === hash)
        if (foundApp) {
          setActiveApp(foundApp.id)
          // Optional: Scroll into view if the browser didn't do it automatically
          const element = document.getElementById(foundApp.id)
          if (element) {
            element.scrollIntoView({ behavior: "smooth" })
          }
        }
      }
    }
  }, [])

  const apps = [
    {
      id: "employees",
      title: "Gestión de colaboradores APP",
      image: "/images/Colaboradores.png",
      details: [
        {
          text: "Control de asistencia con geolocalización: Toma la entrada, salida, traslados entre sucursales y tiempos de colación de sus trabajadores de manera exacta, a través de geolocalización y biometría. Cumple con la norma 38 de la DT.",
        },
        {
          text: "Ingreso de solicitudes: Permite una comunicación ágil y efectiva dentro de su negocio, este módulo permite el ingreso de todo tipo de solicitudes, las cuáles serán directamente enviadas al superior correspondiente.",
        },
        {
          text: "Diseño adaptado: Da seguimiento estricto de las actividades de sus colaboradores durante horarios laborales de manera intuitiva.",
        },
        {
          text: "Recepción de pedidos: Digitaliza la recepción de pedidos, escanea la guía, valida productos y cantidades, actualiza el inventario en tiempo real y registra automáticamente al colaborador que recibe cada entrega.",
        },
        {
          text: "Tareas y turnos: Los trabajadores podrán ver turnos y tareas semanales dentro de la aplicación. Así, organizando funciones y optimizando los tiempos de trabajo.",
        },
        {
          text: "Historial: Permite una visualización simple de información relevante, historial de horas trabajadas, días trabajados, entre otros.",
        },
      ],
    },
    {
      id: "pos",
      title: "Punto De Venta SOLVENDO",
      image: "/images/POS.png",
      details: [
        {
          text: "Venda de forma rápida y organizada con un sistema de punto de venta diseñado para optimizar su negocio.",
        },
        { text: "Gestión de inventario en tiempo real: Controla tu stock al instante." },
        { text: "Integración con medios de pago: Acepta diversas formas de pago." },
        { text: "Reportes de ventas detallados: Analiza el rendimiento de tu negocio." },
        { text: "Interfaz intuitiva: Fácil de usar para cualquier empleado." },
        { text: "DTE: Emisión automatizada de DTE con el SII, y registro auditable." },
      ],
    },
    {
      id: "backoffice",
      title: "Backoffice GE/POS APP",
      image: "/images/Backoffice.png",
      details: [
        {
          text: "Controle su negocio desde un solo lugar: inventario, ventas y reportes con un asistente inteligente que agiliza decisiones y automatiza las tareas.",
        },
        { text: "Análisis de datos avanzado: Obtén insights valiosos para tu negocio." },
        { text: "Automatización de tareas administrativas: Reduce el trabajo manual." },
        { text: "Gestión centralizada: Administra múltiples sucursales desde un solo panel." },
        { text: "Alertas inteligentes: Recibe notificaciones sobre eventos importantes." },
      ],
    },
  ]

  const currentApp = apps.find((app) => app.id === activeApp)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          Conectamos todas las áreas clave de tu operación a través de un ecosistema de tres aplicaciones especializadas
        </h2>

        <div className="grid md:grid-cols-[2fr_1fr] gap-12">
          {/* Left Column: App Details */}
          <div className="space-y-8">
            {currentApp && (
              <div id={currentApp.id}>
                {" "}
                {/* Added ID for direct linking */}
                <h3 className="text-3xl md:text-4xl font-bold">{currentApp.title}</h3>
                <div className="relative flex justify-center mb-8">
                  <Image
                    src={currentApp.image || "/placeholder.svg"}
                    alt={currentApp.title}
                    width={currentApp.id === "employees" ? 200 : 600} // Adjust width for mobile app image
                    height={currentApp.id === "employees" ? 400 : 400} // Adjust height for mobile app image
                    className={`rounded-lg ${currentApp.id === "employees" ? "max-w-xs" : "max-w-lg"}`}
                  />
                </div>
                <div className="space-y-4 text-base text-gray-600">
                  {currentApp.details.map((detail, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                      <p>{detail.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Navigation and Call to Action */}
          <div className="space-y-8">
            <div className="border rounded-lg overflow-hidden">
              {apps.map((app) => (
                <Button
                  key={app.id}
                  variant="ghost"
                  className={`w-full justify-start text-left py-4 px-6 rounded-none border-b last:border-b-0
                    ${activeApp === app.id ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-gray-100"}`}
                  onClick={() => setActiveApp(app.id)}
                >
                  {app.title}
                </Button>
              ))}
            </div>

            {/* Quieres adquirir nuestro servicio? */}
            <Card className="bg-blue-600 text-white p-6 text-center">
              <CardContent className="p-0 space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold">¿Quieres adquirir nuestro servicio?</h3>
                <p className="text-base">
                  Nuestra experiencia nos respalda, por ello, te animamos a disfrutar de nuestra calidad de servicio.
                </p>
                <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link href="/demo">Probar demo</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
