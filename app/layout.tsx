import type { Metadata } from "next"  
import type React from "react"  
import "./globals.css"  
import { Inter } from "next/font/google"  
import { ThemeProvider } from "@/components/theme-provider"  
import { AuthProvider } from "@/contexts/AuthContext"  
import Script from "next/script"  
import { FloatingChatButton } from "@/components/support/floating-chat-button"  
  
const inter = Inter({ subsets: ["latin"] })  
  
export const metadata: Metadata = {  
  title: "Solvendo - El aliado que hace crecer tu negocio",  
  description: "Mejora tu gestión desde un solo lugar. Administra tus empleados, controla el inventario y gestiona tus ventas de forma eficiente.",  
  icons: {  
    icon: "/images/favicon.png",  
    apple: "/images/favicon.png",  
  },  
  generator: 'Solvendo'  
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
        {/* ✅ AuthProvider envuelve todo correctamente */}  
        <AuthProvider>  
          <ThemeProvider   
            attribute="class"   
            defaultTheme="light"   
            enableSystem   
            disableTransitionOnChange  
          >  
            {children}  
            <FloatingChatButton />  
          </ThemeProvider>  
        </AuthProvider>  
      </body>  
    </html>  
  )  
}