import { RegisterForm } from "@/components/auth/register-form"
import { Header } from "@/components/layout/header"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <RegisterForm />
      </div>
    </div>
  )
}
