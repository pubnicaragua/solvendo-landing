"use client" // Added 'use client'
import Image from "next/image" // Re-added Image import

export function DesignFeaturesBanner() {
  return (
    <section id="design-features-section" className="bg-black text-white py-12 md:py-20">
      {" "}
      {/* Altura reducida */}
      <div className="container mx-auto px-4">
        {/* Eliminado: <h3 className="text-2xl md:text-3xl font-bold text-center mb-12">Nuestra metodología</h3> */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto flex items-center justify-center">
              <Image src="/images/diseño.svg" alt="Diseño intuitivo" width={32} height={32} />
            </div>
            <h4 className="font-semibold">Diseño intuitivo</h4> {/* Título corregido */}
            <p className="text-gray-400 text-sm">Hecho para todo tipo de usuario.</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto flex items-center justify-center">
              <Image src="/images/atencion.svg" alt="Atención al cliente" width={32} height={32} />
            </div>
            <h4 className="font-semibold">Atención al cliente</h4> {/* Título corregido */}
            <p className="text-gray-400 text-sm">Soporte 24/7</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto flex items-center justify-center">
              <Image src="/images/automatiza.svg" alt="Automatización inteligente" width={32} height={32} />
            </div>
            <h4 className="font-semibold">Automatización inteligente</h4>
            <p className="text-gray-400 text-sm">Gestiona tareas repetitivas con IA.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
