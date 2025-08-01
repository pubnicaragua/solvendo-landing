"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group" // Import RadioGroup
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

// Función para formatear números al estilo chileno (puntos como separadores de miles)
function formatNumberChilean(num: number | string): string {
  if (typeof num === "string") {
    num = Number(num)
  }
  if (isNaN(num)) {
    return ""
  }
  return num.toLocaleString("es-CL")
}

export function TariffSimulator() {
  const [currentSimulatorStep, setCurrentSimulatorStep] = useState(1) // 1: Solución, 2: Configuración, 3: Resumen
  const router = useRouter()

  const [formData, setFormData] = useState({
    // Corresponde a los campos del Paso 3 del DemoWizard
    businessType: "",
    otherBusinessType: "",
    apps: [] as string[],
    employees: "",
    estimatedEmployees: "",
    branches: 1,
    // Corresponde a los campos del Paso 4 del DemoWizard
    totalBoxes: 1,
    dte: "no",
    skuCount: "",
    estimatedSkuCount: "",
    offlineMode: "no",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const simulatorSteps = [
    { number: 1, title: "Arma tu solución" },
    { number: 2, title: "Configura tu sistema" },
  ]

  // Validaciones simplificadas para el simulador
  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    if (currentSimulatorStep === 1) {
      if (!formData.businessType?.trim()) {
        newErrors.businessType = "El tipo de negocio es requerido."
        isValid = false
      } else if (formData.businessType === "other" && !formData.otherBusinessType?.trim()) {
        newErrors.otherBusinessType = "Especifica el tipo de negocio."
        isValid = false
      }
      if (formData.apps?.length === 0) {
        newErrors.apps = "Selecciona al menos una aplicación."
        isValid = false
      }
      if (!formData.employees?.trim()) {
        newErrors.employees = "La cantidad de colaboradores es requerida."
        isValid = false
      } else if (formData.employees === "+20") {
        if (!formData.estimatedEmployees?.trim()) {
          newErrors.estimatedEmployees = "La cantidad estimada de colaboradores es requerida."
          isValid = false
        } else if (Number(formData.estimatedEmployees) <= 20) {
          newErrors.estimatedEmployees = "La cantidad estimada debe ser mayor a 20."
          isValid = false
        }
      }
      if ((formData.branches || 0) <= 0) {
        newErrors.branches = "La cantidad de sucursales debe ser al menos 1."
        isValid = false
      }
    } else if (currentSimulatorStep === 2) {
      if ((formData.totalBoxes || 0) <= 0) {
        newErrors.totalBoxes = "La cantidad de cajas debe ser al menos 1."
        isValid = false
      }
      if (!formData.dte?.trim()) {
        newErrors.dte = "La opción DTE es requerida."
        isValid = false
      }
      if (!formData.skuCount?.trim()) {
        newErrors.skuCount = "La cantidad de SKU es requerida."
        isValid = false
      } else if (formData.skuCount === "1.500+") {
        if (!formData.estimatedSkuCount?.trim()) {
          newErrors.estimatedSkuCount = "La cantidad estimada de SKU es requerida."
          isValid = false
        } else if (Number(formData.estimatedSkuCount) <= 1500) {
          newErrors.estimatedSkuCount = "La cantidad estimada debe ser mayor a 1.500."
          isValid = false
        }
      }
      if (!formData.offlineMode?.trim()) {
        newErrors.offlineMode = "La opción de modo sin conexión es requerida."
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return // Detener si hay errores de validación
    }
    if (currentSimulatorStep < simulatorSteps.length) {
      setCurrentSimulatorStep(currentSimulatorStep + 1)
    } else {
      // Si es el último paso del simulador, mostrar el resumen
      setCurrentSimulatorStep(simulatorSteps.length + 1) // Paso 3: Resumen
    }
  }

  const handleBack = () => {
    if (currentSimulatorStep > 1) {
      setCurrentSimulatorStep(currentSimulatorStep - 1)
      setErrors({}) // Limpiar errores al retroceder
    }
  }

  const handleAppChange = (app: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({ ...prev, apps: [...prev.apps, app] }))
    } else {
      setFormData((prev) => ({ ...prev, apps: prev.apps.filter((a: string) => a !== app) }))
    }
  }

  const handleContinueDemo = () => {
    // Redirige a la demo con los datos pre-rellenados
    const params = new URLSearchParams({
      businessType: formData.businessType === "other" ? formData.otherBusinessType : formData.businessType,
      apps: formData.apps.join(","),
      employees: formData.employees === "+20" ? formData.estimatedEmployees : formData.employees,
      branches: formData.branches.toString(),
      totalBoxes: formData.totalBoxes.toString(),
      dte: formData.dte,
      skuCount: formData.skuCount === "1.500+" ? formData.estimatedSkuCount : formData.skuCount,
      offlineMode: formData.offlineMode,
    })
    router.push(`/demo?${params.toString()}`)
  }

  // Función para calcular el precio
  const calculatePrice = useMemo(() => {
    let price = 69 // Precio base

    if (formData.apps?.includes("employees")) price += 10
    if (formData.apps?.includes("pos")) price += 15

    if (formData.employees === "+20" && Number(formData.estimatedEmployees) > 20) {
      price += Math.floor((Number(formData.estimatedEmployees) - 20) / 10) * 5 // +$5 por cada 10 empleados adicionales a partir de 20
    }

    if (formData.branches && formData.branches > 1) {
      price += (formData.branches - 1) * 5 // +$5 por sucursal adicional
    }

    if (formData.dte === "yes") price += 20
    if (formData.offlineMode === "yes") price += 10

    if (formData.skuCount === "1.500+" && Number(formData.estimatedSkuCount) > 1500) {
      price += Math.floor((Number(formData.estimatedSkuCount) - 1500) / 500) * 10 // +$10 por cada 500 SKU adicionales
    }

    return price
  }, [formData])

  // Función para generar las características del plan dinámicamente
  const getDynamicPlanFeatures = useMemo(() => {
    const features: string[] = []

    // Características base
    features.push("Límite de 50 colaboradores")
    features.push("Registra más de 200 productos")
    features.push("App backoffice")
    features.push("Integración API con pasarelas")
    features.push("Control de inventario")
    features.push("Asistente con IA")

    // Características condicionales basadas en las selecciones del usuario
    if (formData.employees === "+20" && Number(formData.estimatedEmployees) > 20) {
      features.push(`Gestión de colaboradores para ${formatNumberChilean(formData.estimatedEmployees)} colaboradores`)
    } else if (formData.employees && formData.employees !== "+20") {
      features.push(`Gestión de colaboradores para ${formData.employees} colaboradores`)
    }

    if (formData.branches && formData.branches > 1) {
      features.push(`Gestión de ${formatNumberChilean(formData.branches)} sucursales`)
    }

    if (formData.apps?.includes("employees")) {
      features.push("App Gestión de Colaboradores")
    }
    if (formData.apps?.includes("pos")) {
      features.push("App Punto de Venta")
    }

    if (formData.dte === "yes") {
      features.push("DTE Ilimitadas")
    }
    if (formData.offlineMode === "yes") {
      features.push("Modo sin conexión")
    }
    if (formData.skuCount === "1.500+" && Number(formData.estimatedSkuCount) > 1500) {
      features.push(`Gestión de SKU para más de ${formatNumberChilean(formData.estimatedSkuCount)} productos`)
    } else if (formData.skuCount && formData.skuCount !== "1.500+") {
      features.push(`Gestión de SKU para ${formData.skuCount} productos`)
    }

    return features
  }, [formData])

  return (
    <section id="tariff-simulator-section" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">Simular tarifa</h1>
        <div className="max-w-2xl mx-auto">
          <Card className="p-6 relative">
            {currentSimulatorStep <= simulatorSteps.length ? (
              <>
                {/* Header de pasos del simulador */}
                <div className="flex justify-center items-center gap-4 mb-8">
                  {simulatorSteps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                      <div
                        className={`flex items-center gap-2 ${
                          currentSimulatorStep >= step.number ? "text-blue-600" : "text-gray-400"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            currentSimulatorStep >= step.number ? "bg-blue-600 text-white" : "bg-gray-200"
                          }`}
                        >
                          {step.number}
                        </div>
                        <span className="hidden md:block text-sm font-medium">{step.title}</span>
                      </div>
                      {index < simulatorSteps.length - 1 && (
                        <div
                          className={`w-8 h-0.5 mx-4 ${
                            currentSimulatorStep > step.number ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                      {currentSimulatorStep}
                    </span>
                    {simulatorSteps[currentSimulatorStep - 1].title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Paso 1 del Simulador: Arma tu solución */}
                  {currentSimulatorStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="business-type">¿Qué tipo de negocio es?</Label>
                        <Select
                          value={formData.businessType || ""}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, businessType: value }))}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu tipo de negocio" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minimarket">Minimarket</SelectItem>
                            <SelectItem value="almacen">Almacén</SelectItem>
                            <SelectItem value="almacen-de-barrio">Almacén de barrio</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
                      </div>

                      {formData.businessType === "other" && (
                        <div>
                          <Label htmlFor="other-business-type">Especifica tu tipo de negocio</Label>
                          <Input
                            id="other-business-type"
                            value={formData.otherBusinessType || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, otherBusinessType: e.target.value }))}
                            placeholder="Ej: Ferretería, Panadería, etc."
                            required
                          />
                          {errors.otherBusinessType && (
                            <p className="text-red-500 text-sm mt-1">{errors.otherBusinessType}</p>
                          )}
                        </div>
                      )}

                      <div>
                        <Label>¿Qué aplicaciones necesita tu negocio?</Label>
                        <div className="flex flex-row gap-6 mt-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="employees-app"
                              checked={formData.apps?.includes("employees")}
                              onCheckedChange={(checked) => handleAppChange("employees", checked as boolean)}
                            />
                            <Label htmlFor="employees-app">Gestión de colaboradores</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="pos-app"
                              checked={formData.apps?.includes("pos")}
                              onCheckedChange={(checked) => handleAppChange("pos", checked as boolean)}
                            />
                            <Label htmlFor="pos-app">Punto de venta</Label>
                          </div>
                        </div>
                        {errors.apps && <p className="text-red-500 text-sm mt-1">{errors.apps}</p>}
                      </div>

                      <div>
                        <Label htmlFor="employees-count">¿Cuántos colaboradores tiene tu negocio?</Label>
                        <Select
                          value={formData.employees || ""}
                          onValueChange={(value) => {
                            setFormData((prev) => ({
                              ...prev,
                              employees: value,
                              estimatedEmployees: value === "+20" ? prev.estimatedEmployees : "",
                            }))
                          }}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona cantidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-5">1-5</SelectItem>
                            <SelectItem value="6-10">6-10</SelectItem>
                            <SelectItem value="11-20">11-20</SelectItem>
                            <SelectItem value="+20">+20</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.employees && <p className="text-red-500 text-sm mt-1">{errors.employees}</p>}
                      </div>

                      {formData.employees === "+20" && (
                        <div>
                          <Label htmlFor="estimated-employees-count">Cantidad estimada de colaboradores</Label>
                          <Input
                            id="estimated-employees-count"
                            type="number"
                            min="21"
                            value={formData.estimatedEmployees || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, estimatedEmployees: e.target.value }))}
                            placeholder="Ej: 25"
                            required
                          />
                          {errors.estimatedEmployees && (
                            <p className="text-red-500 text-sm mt-1">{errors.estimatedEmployees}</p>
                          )}
                        </div>
                      )}

                      <div>
                        <Label htmlFor="branches">Cantidad de sucursales</Label>
                        <Input
                          id="branches"
                          type="number"
                          min="1"
                          value={formData.branches || 1}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, branches: Number.parseInt(e.target.value) || 1 }))
                          }
                          required
                        />
                        {errors.branches && <p className="text-red-500 text-sm mt-1">{errors.branches}</p>}
                      </div>
                    </div>
                  )}

                  {/* Paso 2 del Simulador: Configura tu sistema */}
                  {currentSimulatorStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="total-boxes">Cantidad de cajas totales</Label>
                        <Input
                          id="total-boxes"
                          type="number"
                          min="1"
                          value={formData.totalBoxes || 1}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, totalBoxes: Number.parseInt(e.target.value) || 1 }))
                          }
                          required
                        />
                        {errors.totalBoxes && <p className="text-red-500 text-sm mt-1">{errors.totalBoxes}</p>}
                      </div>
                      <div>
                        <Label>¿Desea Documento Tributario Electrónico?</Label>
                        <RadioGroup
                          defaultValue={formData.dte || "no"}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, dte: value }))}
                          className="flex space-x-4 mt-2"
                          required
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="dte-yes" />
                            <Label htmlFor="dte-yes">Sí</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="dte-no" />
                            <Label htmlFor="dte-no">No</Label>
                          </div>
                        </RadioGroup>
                        {errors.dte && <p className="text-red-500 text-sm mt-1">{errors.dte}</p>}
                      </div>
                      <div>
                        <Label htmlFor="sku-count">Cantidad de SKU (productos)</Label>
                        <Select
                          value={formData.skuCount || ""}
                          onValueChange={(value) => {
                            setFormData((prev) => ({
                              ...prev,
                              skuCount: value,
                              estimatedSkuCount: value === "1.500+" ? prev.estimatedSkuCount : "",
                            }))
                          }}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona cantidad" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-300">1-300</SelectItem>
                            <SelectItem value="300-650">300-650</SelectItem>
                            <SelectItem value="650-1.500">650-1.500</SelectItem>
                            <SelectItem value="1.500+">Más de 1.500</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.skuCount && <p className="text-red-500 text-sm mt-1">{errors.skuCount}</p>}
                      </div>
                      {formData.skuCount === "1.500+" && (
                        <div>
                          <Label htmlFor="estimated-sku-count">Cantidad estimada de SKU</Label>
                          <Input
                            id="estimated-sku-count"
                            type="number"
                            min="1501"
                            value={formData.estimatedSkuCount || ""}
                            onChange={(e) => setFormData((prev) => ({ ...prev, estimatedSkuCount: e.target.value }))}
                            placeholder="Ej: 2000"
                            required
                          />
                          {errors.estimatedSkuCount && (
                            <p className="text-red-500 text-sm mt-1">{errors.estimatedSkuCount}</p>
                          )}
                        </div>
                      )}
                      <div>
                        <Label>¿Desea modo sin conexión?</Label>
                        <RadioGroup
                          defaultValue={formData.offlineMode || "no"}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, offlineMode: value }))}
                          className="flex space-x-4 mt-2"
                          required
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="offline-yes" />
                            <Label htmlFor="offline-yes">Sí</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="offline-no" />
                            <Label htmlFor="offline-no">No</Label>
                          </div>
                        </RadioGroup>
                        {errors.offlineMode && <p className="text-red-500 text-sm mt-1">{errors.offlineMode}</p>}
                      </div>
                    </div>
                  )}

                  {/* Navegación de pasos del simulador */}
                  <div className="flex justify-between pt-6">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      disabled={currentSimulatorStep === 1}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <Button onClick={handleNext} className="flex items-center gap-2">
                      {currentSimulatorStep === simulatorSteps.length ? "Ver resumen" : "Siguiente"}
                      {currentSimulatorStep !== simulatorSteps.length && <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              // Resumen del plan (Paso 3 del Simulador)
              <CardContent className="space-y-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-blue-600">¡Tu plan Solvendo!</h2>
                <p className="text-lg text-gray-700">
                  Basado en tus necesidades, estas son las herramientas que podrás usar:
                </p>
                <ul className="list-disc list-inside text-left mx-auto max-w-md space-y-2 text-gray-800">
                  {getDynamicPlanFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2 text-blue-600">✔</span> {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-2xl font-bold text-green-600 mt-8">GRATIS hasta el 14 de septiembre</div>
               
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button variant="outline" onClick={() => setCurrentSimulatorStep(1)} size="lg">
                    Volver a simular
                  </Button>
                  <Button onClick={handleContinueDemo} className="bg-blue-600 hover:bg-blue-700" size="lg">
                    Continuar con la demo
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </section>
  )
}
