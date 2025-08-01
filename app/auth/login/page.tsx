import { LoginForm } from "@/components/auth/login-form"
import { Header } from "@/components/layout/header"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <LoginForm />
      </div>
    </div>
  )
}
