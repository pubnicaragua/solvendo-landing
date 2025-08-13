"use client"

import { useSearchParams } from "next/navigation"
import { DemoWizard } from "@/components/demo/demo-wizard"
import { Header } from "@/components/layout/header"

export default function DemoPage() {
  const searchParams = useSearchParams()
  const initialData = {
    businessType: searchParams.get("businessType") || "",
    apps: searchParams.get("apps")?.split(",") || [],
    employees: searchParams.get("employees") || "",
    branches: Number.parseInt(searchParams.get("branches") || "1"),
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <DemoWizard initialData={initialData} />
    </div>
  )
}
