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
  const [currentSimulatorStep, setCurrentSimulatorStep] = useState(1) // 1: Arma tu solución, 2: Configura tu sistema, 3: Información de registro, 4: Información del negocio
  const router = useRouter()
 
  const [formData, setFormData] = useState({
    // Step 1: Arma tu solución
    businessType: "",
    otherBusinessType: "",
    apps: [] as string[], // Correctly typed as string[]
    employees: "",
    estimatedEmployees: "",
    branches: 1,
    // Step 2: Configura tu sistema
    totalBoxes: 1,
    dte: "no",
    skuCount: "",
    estimatedSkuCount: "",
    offlineMode: "no",
    // Step 3: Información de registro
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Step 4: Información del negocio
    rut: "",
    razonSocial: "",
    direccion: "",
    region: "",
    comuna: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const simulatorSteps = [
    { number: 1, title: "Arma tu solución" },
    { number: 2, title: "Configura tu sistema" },
    { number: 3, title: "Información de registro" },
    { number: 4, title: "Información del negocio" },
  ]

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    if (currentSimulatorStep === 3) {
      if (!formData.name?.trim()) {
        newErrors.name = "El nombre es requerido."
        isValid = false
      }
      if (!formData.email?.trim() || !validateEmail(formData.email)) {
        newErrors.email = "El correo electrónico es inválido."
        isValid = false
      }
      if (!formData.password?.trim() || formData.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres."
        isValid = false
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden."
        isValid = false
      }
    }

    if (currentSimulatorStep === 4) {
      if (!formData.rut?.trim()) {
        newErrors.rut = "El RUT es requerido."
        isValid = false
      }
      if (!formData.razonSocial?.trim()) {
        newErrors.razonSocial = "La razón social es requerida."
        isValid = false
      }
      if (!formData.direccion?.trim()) {
        newErrors.direccion = "La dirección es requerida."
        isValid = false
      }
      if (!formData.region?.trim()) {
        newErrors.region = "La región es requerida."
        isValid = false
      }
      if (!formData.comuna?.trim()) {
        newErrors.comuna = "La comuna es requerida."
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
    // Logic for handling demo continuation can be adjusted here if needed.
    console.log('Continuing demo with pre-filled data:', formData);
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

    // Colaboradores
    if (formData.employees === "+20" && Number(formData.estimatedEmployees) > 20) {
      features.push(`Gestión de colaboradores para ${formatNumberChilean(formData.estimatedEmployees)} colaboradores`)
    } else if (formData.employees && formData.employees !== "") {
      features.push(`Gestión de colaboradores para ${formData.employees} colaboradores`)
    }

    // Sucursales
    if (formData.branches && formData.branches > 1) {
      features.push(`Gestión de ${formatNumberChilean(formData.branches)} sucursales`)
    }

    // Apps seleccionadas
    if (formData.apps?.includes("employees")) {
      features.push("App Gestión de Colaboradores")
    }
    if (formData.apps?.includes("pos")) {
      features.push("App Punto de Venta")
    }

    // DTE
    if (formData.dte === "yes") {
      features.push("DTE Ilimitadas")
    }

    // Modo sin conexión
    if (formData.offlineMode === "yes") {
      features.push("Modo sin conexión")
    }

    // SKU
    if (formData.skuCount === "1.500+" && Number(formData.estimatedSkuCount) > 1500) {
      features.push(`Gestión de SKU para más de ${formatNumberChilean(formData.estimatedSkuCount)} productos`)
    } else if (formData.skuCount && formData.skuCount !== "") {
      features.push(`Gestión de SKU para ${formData.skuCount} productos`)
    }

    return features
  }, [formData])

  const renderSummary = () => {
    return (
      <div className="p-4 border rounded-lg bg-gray-100">
        <h3 className="text-lg font-bold mb-2">Resumen</h3>
        <ul className="space-y-2">
          {formData.businessType && <li>Tipo de negocio: {formData.businessType}</li>}
          {formData.apps.length > 0 && <li>Aplicaciones seleccionadas: {formData.apps.join(", ")}</li>}
          {formData.employees && <li>Colaboradores: {formData.employees}</li>}
          {formData.branches > 1 && <li>Sucursales: {formData.branches}</li>}
          {formData.totalBoxes > 0 && <li>Cajas totales: {formData.totalBoxes}</li>}
          {formData.skuCount && <li>SKUs: {formData.skuCount}</li>}
        </ul>
      </div>
    )
  }

  return (
    <section id="tariff-simulator-section" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">Simular tarifa</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <Card className="p-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{simulatorSteps[currentSimulatorStep - 1].title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Render content for the current step */}
                {/* Eliminado campo duplicado de 'Cantidad de cajas totales' */}

                {/* Otros pasos */}
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
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, estimatedSkuCount: e.target.value }))
                          }
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

                {/* Paso 3 del Simulador: Información de registro */}
                {currentSimulatorStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Ingresa tu nombre"
                        required
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Ingresa tu correo electrónico"
                        required
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        placeholder="Ingresa una contraseña"
                        required
                      />
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirma tu contraseña"
                        required
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Paso 4 del Simulador: Información del negocio */}
                {currentSimulatorStep === 4 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rut">RUT</Label>
                      <Input
                        id="rut"
                        value={formData.rut}
                        onChange={(e) => setFormData((prev) => ({ ...prev, rut: e.target.value }))}
                        placeholder="Ingresa tu RUT"
                        required
                      />
                      {errors.rut && <p className="text-red-500 text-sm mt-1">{errors.rut}</p>}
                    </div>
                    <div>
                      <Label htmlFor="razon-social">Razón Social</Label>
                      <Input
                        id="razon-social"
                        value={formData.razonSocial}
                        onChange={(e) => setFormData((prev) => ({ ...prev, razonSocial: e.target.value }))}
                        placeholder="Ingresa la razón social"
                        required
                      />
                      {errors.razonSocial && <p className="text-red-500 text-sm mt-1">{errors.razonSocial}</p>}
                    </div>
                    <div>
                      <Label htmlFor="direccion">Dirección</Label>
                      <Input
                        id="direccion"
                        value={formData.direccion}
                        onChange={(e) => setFormData((prev) => ({ ...prev, direccion: e.target.value }))}
                        placeholder="Ingresa tu dirección"
                        required
                      />
                      {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>}
                    </div>
                    <div>
                      <Label htmlFor="region">Región</Label>
                      <Input
                        id="region"
                        value={formData.region}
                        onChange={(e) => setFormData((prev) => ({ ...prev, region: e.target.value }))}
                        placeholder="Ingresa tu región"
                        required
                      />
                      {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
                    </div>
                    <div>
                      <Label htmlFor="comuna">Comuna</Label>
                      <Input
                        id="comuna"
                        value={formData.comuna}
                        onChange={(e) => setFormData((prev) => ({ ...prev, comuna: e.target.value }))}
                        placeholder="Ingresa tu comuna"
                        required
                      />
                      {errors.comuna && <p className="text-red-500 text-sm mt-1">{errors.comuna}</p>}
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
                    {currentSimulatorStep === simulatorSteps.length ? "Finalizar" : "Siguiente"}
                    {currentSimulatorStep !== simulatorSteps.length && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full md:w-1/3">
            <Card className="p-6 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Resumen de plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg font-bold text-blue-600">Tu tarifa mensual sería:</p>
                <p className="text-4xl font-bold text-center text-blue-600"> </p>
                <p className="text-sm text-center text-gray-500">Prueba de 14 días gratis</p>
                {/* Resumen dinámico en base a respuestas del usuario */}
                <div className="mb-4">
                  <ul className="space-y-2">
                    {formData.businessType && <li><b>Tipo de negocio:</b> {formData.businessType === "other" ? formData.otherBusinessType : formData.businessType}</li>}
                    {formData.apps.length > 0 && (
                      <li><b>Apps:</b> {formData.apps.map(app => app === "employees" ? "Gestión de colaboradores" : app === "pos" ? "Punto de venta" : app).join(", ")}</li>
                    )}
                    {formData.employees && (
                      <li><b>Colaboradores:</b> {formData.employees === "+20" ? formData.estimatedEmployees : formData.employees}</li>
                    )}
                    {formData.branches && <li><b>Sucursales:</b> {formData.branches}</li>}
                    {formData.totalBoxes && <li><b>Cajas totales:</b> {formData.totalBoxes}</li>}
                    {formData.dte === "yes" && <li><b>DTE:</b> Sí</li>}
                    {formData.skuCount && <li><b>SKU:</b> {formData.skuCount === "1.500+" ? formData.estimatedSkuCount : formData.skuCount}</li>}
                    {formData.offlineMode === "yes" && <li><b>Modo sin conexión:</b> Sí</li>}
                  </ul>
                </div>
                <ul className="list-disc list-inside space-y-2">
                  {getDynamicPlanFeatures.map((feature, index) => (
                    <li key={index} className="text-gray-700">{feature}</li>
                  ))}
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Probar demo ahora</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
