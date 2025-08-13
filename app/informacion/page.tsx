import { Header } from "@/components/layout/header"
import { About } from "@/components/landing/about"
import { DetailedApps } from "@/components/informacion/detailed-apps" // New component
import { FAQ } from "@/components/landing/faq"
import { Footer } from "@/components/landing/footer"

export default function InformacionPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <About />
        <DetailedApps /> {/* New detailed apps section */}
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
