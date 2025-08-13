"use client"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { YoutubeReminderPopup } from "./youtube-reminder-popup" // Import the new popup component

export function Footer() {
  const [isYoutubePopupOpen, setIsYoutubePopupOpen] = useState(false)

  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo_blanco.svg" alt="Solvendo Logo" width={130} height={54} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-8">
          <div>
            <h3 className="font-medium mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/informacion" className="text-gray-400 hover:text-white text-sm">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <a
                  href="mailto:contacto@solvendo.cl"
                  className="text-gray-400 hover:text-white text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Herramientas</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/informacion#pos" className="text-gray-400 hover:text-white text-sm">
                  POS
                </Link>
              </li>
              <li>
                <Link href="/informacion#employees" className="text-gray-400 hover:text-white text-sm">
                  Gestión de colaboradores
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/informacion#faq-section" className="text-gray-400 hover:text-white text-sm">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-gray-400 hover:text-white text-sm">
                  Probar demo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terminos-servicio" className="text-gray-400 hover:text-white text-sm">
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidad" className="text-gray-400 hover:text-white text-sm">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400 mb-2">Contacto:</p>
              <p className="text-sm">
                <a
                  href="mailto:Soporte@solvendo.cl"
                  className="hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Soporte@solvendo.cl
                </a>
              </p>
      
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/solvendo.cl?igsh=ZXd4cDI3cng0dXFq&utm_source=qr"
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/share/196Gsr7nxR/?mibextid=wwXIfr"
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/solvendo-cl/"
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <button
                onClick={() => setIsYoutubePopupOpen(true)}
                className="text-gray-400 hover:text-white"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-400">Copyright © 2025 Solvendo SpA</p>
          </div>
        </div>
      </div>
      <YoutubeReminderPopup isOpen={isYoutubePopupOpen} onClose={() => setIsYoutubePopupOpen(false)} />
    </footer>
  )
}
