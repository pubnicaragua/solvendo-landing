"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function DarkBanner() {
  return (
    <section className="bg-black text-white py-16 md:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-xl md:text-2xl font-normal mb-4">Todo lo que tu tienda necesita, en un solo sistema,</h2>
        <p className="text-xl md:text-2xl font-bold mb-8">seguro, simple y poderoso</p>
        <Link href="#detailed-features" passHref>
          <Button size="lg">Ver herramientas</Button>
        </Link>
      </div>
    </section>
  )
}
