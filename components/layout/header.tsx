"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Image from "next/image" // Re-added Image import

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    // If it's a hash link, only apply hover styles, do not mark as active.
    if (path.startsWith("/#")) {
      return "hover:text-blue-600"
    }
    // For regular page links, mark as active if pathname matches.
    return pathname === path ? "text-blue-600 font-medium" : "hover:text-blue-600"
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo_negro.svg" alt="Solvendo Logo" width={130} height={54} />
            {/* Removed the "Solvendo" text next to the logo */}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#tariff-simulator-section" className={`text-sm ${isActive("/#tariff-simulator-section")}`}>
              Simular tarifa
            </Link>
            <Link href="/#design-features-section" className={`text-sm ${isActive("/#design-features-section")}`}>
              Herramientas
            </Link>
            <Link href="/informacion" className={`text-sm ${isActive("/informacion")}`}>
              Información
            </Link>
            {/* Eliminado: <Link href="/support" className={`text-sm ${isActive("/support")}`}>Soporte</Link> */}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/login" className="flex items-center gap-2 text-sm font-medium hover:text-blue-600">
            <User className="h-4 w-4" />
            Iniciar sesión
          </Link>
          <Button asChild>
            <Link href="/demo">Probar demo</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto py-4 space-y-4">
            <div className="flex justify-center mb-4">
              <Image src="/images/logo_negro.svg" alt="Solvendo Logo" width={32} height={32} />
            </div>
            <Link href="/#tariff-simulator-section" className="block text-sm font-medium hover:text-blue-600">
              Simular tarifa
            </Link>
            <Link href="/#design-features-section" className="block text-sm font-medium hover:text-blue-600">
              Herramientas
            </Link>
            <Link href="/informacion" className="block text-sm font-medium hover:text-blue-600">
              Información
            </Link>
            {/* Eliminado: <Link href="/support" className="block text-sm font-medium hover:text-blue-600">Soporte</Link> */}
            <hr />
            <Link href="/auth/login" className="flex items-center gap-2 text-sm font-medium hover:text-blue-600">
              <User className="h-4 w-4" />
              Iniciar sesión
            </Link>
            <Button asChild className="w-full">
              <Link href="/demo">Probar demo</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
