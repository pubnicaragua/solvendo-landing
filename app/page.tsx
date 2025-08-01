import { Header } from "@/components/layout/header"
import { Hero } from "@/components/landing/hero"
import { Benefits } from "@/components/landing/benefits"
import { DarkBanner } from "@/components/landing/dark-banner"
import { TariffSimulator } from "@/components/landing/tariff-simulator"
import { DesignFeaturesBanner } from "@/components/landing/design-features-banner" // New component for design features
import { Features } from "@/components/landing/features" // Features now only contains the detailed features
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <DarkBanner />
        {/* TariffSimulator reemplaza DemoWizard para mostrar el simulador de tarifas */}
        <div className="container mx-auto py-10">
          <TariffSimulator />
        </div>
        <DesignFeaturesBanner />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
