import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script" // Import Script component
import { FloatingChatButton } from "@/components/support/floating-chat-button" // Importa el chat flotante

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Solvendo - El aliado que hace crecer tu negocio",
  description:
    "Mejora tu gestión desde un solo lugar. Administra tus empleados, controla el inventario y gestiona tus ventas de forma eficiente.",
  icons: {
    icon: "/images/favicon.png", // Favicon principal (SVG)
    apple: "/images/favicon.png", // Icono para pantallas de inicio de iOS (PNG)
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="" lang="es" suppressHydrationWarning>
      <head>
        {/* Favicon universal para navegadores y dispositivos Apple */}
        <link rel="icon" type="image/png" href="/images/favicon.png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/images/favicon.png" />
        <link rel="shortcut icon" href="/images/favicon.png" />
        {/* Microsoft Clarity Heatmap Script */}
        <Script
          id="microsoft-clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "s1y8lgdb3r");
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <FloatingChatButton /> {/* Renderiza el chat flotante aquí */}
        </ThemeProvider>
      </body>
    </html>
  )
}
