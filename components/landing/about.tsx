import Image from "next/image" // Re-added Image import
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function About() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">¿Qué es Solvendo?</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Solvendo es un sistema simple de usar y eficaz, que permite controlar inventario, ventas y compras de
              forma eficiente, ahorrando tiempo y reduciendo errores operativos en tu negocio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-blue-500 hover:bg-blue-600">
                <Link href="/demo">Probar demo</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/simular-tarifa">Simular tarifa</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="flex justify-center">
              <Image
                src="/images/POS.png" // Updated path and content
                alt="Solvendo Dashboard"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Methodology - Styled to match Figma design for 'Información' page */}
        <div className="bg-gray-900 text-white py-12 rounded-lg mb-16">
          {" "}
          {/* Added dark background and padding */}
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">Nuestra metodología</h3>
          <div className="grid md:grid-cols-3 gap-8 px-8">
            {" "}
            {/* Added horizontal padding */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center space-y-4">
              {" "}
              {/* Dark card for each item */}
              <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                {" "}
                {/* Re-added bg-blue-600 and rounded-full */}
                <Image
                  src="/images/automatiza.svg"
                  alt="Automatización inteligente"
                  className="h-8 w-8"
                  width={32}
                  height={32}
                />
              </div>
              <h4 className="font-semibold text-white">Automatización inteligente</h4>
              <p className="text-gray-400 text-sm">
                Usamos inteligencia artificial para automatizar tareas repetitivas, detectar patrones y ayudarte a tomar
                mejores decisiones.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center space-y-4">
              <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                {" "}
                {/* Re-added bg-blue-600 and rounded-full */}
                <Image
                  src="/images/adapt.svg"
                  alt="Integraciones flexibles"
                  className="h-8 w-8"
                  width={32}
                  height={32}
                />
              </div>
              <h4 className="font-semibold text-white">Integraciones flexibles</h4>
              <p className="text-gray-400 text-sm">
                Desarrollamos integraciones flexibles que se adaptan a tu negocio, no al revés.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center space-y-4">
              <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                {" "}
                {/* Re-added bg-blue-600 and rounded-full */}
                <Image
                  src="/images/diseño.svg"
                  alt="Experiencia del usuario"
                  className="h-8 w-8"
                  width={32}
                  height={32}
                />
              </div>
              <h4 className="font-semibold text-white">Experiencia del usuario</h4>
              <p className="text-gray-400 text-sm">
                Diseñamos con foco en la experiencia del usuario, para que cualquier miembro de tu equipo pueda utilizar
                nuestras apps sin fricciones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
