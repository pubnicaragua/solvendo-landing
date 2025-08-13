"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "¿Es necesario ingresar un método de pago para probar la demo?",
      answer:
        "No, en Solvendo puedes acceder a la demo sin ingresar ningún método de pago. Queremos que pruebes nuestra plataforma sin compromisos.",
    },
    {
      question: "¿Cómo puede ayudarme Solvendo a ahorrar tiempo y recursos?",
      answer:
        "Automatizamos tareas clave como el ingreso de facturas, el control de asistencia, la recepción de pedidos y la consolidación de ventas. Esto reduce errores y te permite enfocarte en lo estratégico, no en lo operativo.",
    },
    {
      question: "¿Por qué es importante llevar un control de inventario y asistencia en mi negocio?",
      answer:
        "Porque te ayuda a evitar quiebres de stock, detectar pérdidas, mejorar la gestión de turnos y cumplir con la normativa, como la norma 38 de la Dirección del Trabajo. Solvendo automatiza ambos procesos y te alerta ante movimientos inusuales.",
    },
    {
      question: "¿Necesito conocimientos técnicos para usar Solvendo?",
      answer:
        "No. Nuestra plataforma es intuitiva y fácil de usar. Además, ofrecemos soporte 24/7 para acompañarte siempre que lo necesites.",
    },
    {
      question: "¿Cómo puedo obtener las apps de Solvendo?",
      answer:
        "Una vez crees tu cuenta, tendrás acceso a todas las aplicaciones y enlaces de descarga disponibles. La aplicación de Colaboradores es de acceso público y puedes descargarla directamente desde la App Store y Google Play.",
    },
  ]

  return (
    <section id="faq-section" className="py-16 md:py-24 bg-gray-50">
      {" "}
      {/* Added ID for direct linking */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border">
              <button
                className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
