"use client"  
import { useState, useMemo } from "react"  
import { Button } from "@/components/ui/button"  
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"  
import { Input } from "@/components/ui/input"  
import { Label } from "@/components/ui/label"  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"  
import { Checkbox } from "@/components/ui/checkbox"  
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"  
import { ArrowLeft, ArrowRight } from "lucide-react"  
import Image from "next/image"  
import { useRouter } from "next/navigation"  
import { saveDemoProgress } from "@/actions/save-demo-progress"  
import { chileanRegionsAndCommunes } from "@/data/chilean-regions-communes"  
  
interface DemoWizardProps {  
  initialData: any  
}  
  
interface PasswordRequirementsProps {  
  password: string  
}  
  
function PasswordRequirements({ password }: PasswordRequirementsProps) {  
  const requirements = [  
    {  
      text: "Mínimo 6 caracteres",  
      met: password.length >= 6  
    },  
    {  
      text: "Al menos 1 letra mayúscula",  
      met: /[A-Z]/.test(password)  
    },  
    {  
      text: "Al menos 1 número",  
      met: /[0-9]/.test(password)  
    },  
    {  
      text: "Al menos 1 símbolo (!@#$%^&*)",  
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password)  
    }  
  ]  
  
  return (  
    <div className="mt-2 space-y-1">  
      {requirements.map((req, index) => (  
        <div key={index} className="flex items-center gap-2 text-sm">  
          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${  
            req.met ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'  
          }`}>  
            {req.met ? '✓' : '○'}  
          </div>  
          <span className={req.met ? 'text-green-600' : 'text-gray-500'}>  
            {req.text}  
          </span>  
        </div>  
      ))}  
    </div>  
  )  
}  
  
function formatNumberChilean(num: number | string): string {  
  if (typeof num === "string") {  
    num = Number(num)  
  }  
  if (isNaN(num)) {  
    return ""  
  }  
  return num.toLocaleString("es-CL")  
}  
  
export function DemoWizard({ initialData }: DemoWizardProps) {  
  const [currentStep, setCurrentStep] = useState(1)  
  const router = useRouter()  
  
  const [formData, setFormData] = useState({  
    // Step 1: Registration  
    name: "",  
    email: "",  
    password: "",  
    confirmPassword: "",  
    // Step 2: Business Info  
    rut: "",  
    razonSocial: "",  
    direccion: "",  
    region: "",  
    comuna: "",  
    // Step 3: Solution  
    businessType: initialData.businessType || "",  
    otherBusinessType: "",  
    apps: initialData.apps || [],  
    employees: initialData.employees || "",  
    estimatedEmployees: "",  
    branches: initialData.branches || 1,  
    // Step 4: Configuration  
    totalBoxes: 1,  
    dte: "no",  
    skuCount: "",  
    estimatedSkuCount: "",  
    offlineMode: "no",  
  })  
  
  const [errors, setErrors] = useState<Record<string, string>>({})  
  
  const steps = [  
    { number: 1, title: "Información de registro" },  
    { number: 2, title: "Información del negocio" },  
    { number: 3, title: "Arma tu solución" },  
    { number: 4, title: "Configura tu sistema" },  
  ]  
  
  const validateEmail = (email: string) => {  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/  
    return emailRegex.test(email)  
  }  
  
  const validatePassword = (password: string) => {  
    if (password.length < 6) {  
      return "La contraseña debe tener al menos 6 caracteres."  
    }  
    if (!/[0-9]/.test(password)) {  
      return "La contraseña debe contener al menos un número."  
    }  
    if (!/[A-Z]/.test(password)) {  
      return "La contraseña debe contener al menos una letra mayúscula."  
    }  
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {  
      return "La contraseña debe contener al menos un símbolo."  
    }  
    return ""  
  }  
  
  const validateRut = (rut: string) => {  
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) return false  
    const tmp = rut.split("-")  
    let digv = tmp[1]  
    const body = tmp[0]  
    if (digv == "K") digv = "k"  
    return calculateDv(body) == digv  
  }  
  
  const calculateDv = (bodyStr: string) => {  
    let T = parseInt(bodyStr, 10)  
    if (isNaN(T)) return "k"  
    let M = 0, S = 1  
    for (; T; T = Math.floor(T / 10))  
      S = (S + (T % 10) * (9 - (M++ % 6))) % 11  
    return S ? String(S - 1) : "k"  
  }  
  
  const validateCurrentStep = () => {  
    const newErrors: Record<string, string> = {}  
    let isValid = true  
  
    if (currentStep === 1) {  
      if (!formData.name.trim()) {  
        newErrors.name = "El nombre es requerido."  
        isValid = false  
      }  
      if (!formData.email.trim()) {  
        newErrors.email = "El correo electrónico es requerido."  
        isValid = false  
      } else if (!validateEmail(formData.email)) {  
        newErrors.email = "Formato de correo electrónico inválido."  
        isValid = false  
      }  
      const passwordError = validatePassword(formData.password)  
      if (passwordError) {  
        newErrors.password = passwordError  
        isValid = false  
      }  
      if (!formData.confirmPassword.trim()) {  
        newErrors.confirmPassword = "Confirmar contraseña es requerido."  
        isValid = false  
      } else if (formData.password !== formData.confirmPassword) {  
        newErrors.confirmPassword = "Las contraseñas no coinciden."  
        isValid = false  
      }  
    } else if (currentStep === 2) {  
      if (!formData.rut?.trim()) {  
        newErrors.rut = "El RUT es requerido."  
        isValid = false  
      } else if (!validateRut(formData.rut)) {  
        newErrors.rut = "Formato de RUT inválido."  
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
    } else if (currentStep === 3) {  
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
    } else if (currentStep === 4) {  
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
  
  // ✅ COMPLETAMENTE DINÁMICO: Crear empresa individual para cada usuario  
  const handleNext = async () => {  
    if (!validateCurrentStep()) {  
      return  
    }  
  
    if (currentStep < 4) {  
      const saveResult = await saveDemoProgress({  
        formData: formData,  
        currentStep: currentStep,  
        isFinalSubmission: false,  
      })  
  
      if (!saveResult.success) {  
        alert(saveResult.message)  
        return  
      }  
  
      setCurrentStep(currentStep + 1)  
    } else {  
      // ✅ STEP 4: Crear empresa individual y usuario  
      try {  
        console.log('🔄 Creando empresa individual y usuario...')  
          
        // ✅ PASO 1: Crear empresa individual para este usuario  
        const empresaResponse = await fetch('/api/create-demo-company', {  
          method: 'POST',  
          headers: { 'Content-Type': 'application/json' },  
          body: JSON.stringify({  
            razon_social: formData.razonSocial,  
            rut: formData.rut,  
            direccion: formData.direccion,  
            region: formData.region,  
            comuna: formData.comuna,  
            businessType: formData.businessType,  
            apps: formData.apps,  
            employees: formData.employees,  
            estimatedEmployees: formData.estimatedEmployees,  
            branches: formData.branches,  
            dte: formData.dte,  
            skuCount: formData.skuCount,  
            estimatedSkuCount: formData.estimatedSkuCount,  
            offlineMode: formData.offlineMode  
          })  
        })  
  
        const empresaResult = await empresaResponse.json()  
          
        if (!empresaResult.success) {  
          throw new Error(empresaResult.error || 'Error creando empresa')  
        }  
  
        const { empresaId, sucursalId } = empresaResult  
  
        // ✅ PASO 2: Crear usuario con su empresa individual  
        const edgeFunctionData = {  
          p_nombres: formData.name.split(' ')[0] || 'Usuario',  
          p_apellidos: formData.name.split(' ').slice(1).join(' ') || 'Demo',  
          p_rut: formData.rut,  
          p_email: formData.email,  
          p_telefono: '',  
          p_direccion: formData.direccion,  
          p_fecha_nacimiento: null,  
          p_password: formData.password,  
          p_empresa_id: empresaId, // ✅ Su propia empresa  
          p_sucursal_id: sucursalId, // ✅ Su propia sucursal  
          p_rol: 'administrador'  
        }  
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/crear_usuario_con_password`, {  
          method: 'POST',  
          headers: {  
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,  
            'Content-Type': 'application/json'  
          },  
          body: JSON.stringify(edgeFunctionData)  
        })  
  
        const result = await response.json()  
  
        if (result.success) {  
          await saveDemoProgress({  
            formData: formData,  
            currentStep: currentStep,  
            isFinalSubmission: true,  
          })  
  
          console.log('✅ Usuario y empresa creados exitosamente')  
          router.push("/auth/login")  
        } else {  
          throw new Error(result.error || 'Error creando usuario')  
        }  
      } catch (error) {  
        console.error('❌ Error creando usuario:', error)  
        alert('Error al crear el usuario. Por favor intenta nuevamente.')  
      }  
    }  
  }  
  
  const handleBack = () => {  
    if (currentStep > 1) {  
      setCurrentStep(currentStep - 1)  
      setErrors({})  
    }  
  }  
  
  const handleAppChange = (app: string, checked: boolean) => {  
    if (checked) {  
      setFormData((prev) => ({ ...prev, apps: [...prev.apps, app] }))  
    } else {  
      setFormData((prev) => ({ ...prev, apps: prev.apps.filter((a: string) => a !== app) }))  
    }  
  }  
  
  const handleRegionChange = (value: string) => {  
    setFormData((prev) => ({ ...prev, region: value, comuna: "" }))  
  }  
  
  const availableCommunes = useMemo(() => {  
    const selectedRegion = chileanRegionsAndCommunes.find((region) => region.name === formData.region)  
    return selectedRegion ? selectedRegion.communes : []  
  }, [formData.region])  
  
  const getDynamicPlanFeatures = useMemo(() => {  
    const features: string[] = []  
    features.push("Límite de 50 colaboradores")  
    features.push("Registra más de 200 productos")  
    features.push("App backoffice")  
    features.push("Integración API con pasarelas")  
    features.push("Control de inventario")  
    features.push("Asistente con IA")  
  
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
    <div className="container mx-auto px-4 py-8">  
      <div className="max-w-4xl mx-auto">  
        {/* Header */}  
        <div className="text-center mb-8">  
          <h1 className="text-3xl font-bold mb-4">Probar demo</h1>  
          <div className="flex justify-center items-center gap-4 mb-8">  
            {steps.map((step, index) => (  
              <div key={step.number} className="flex items-center">  
                <div  
                  className={`flex items-center gap-2 ${  
                    currentStep >= step.number ? "text-blue-600" : "text-gray-400"  
                  }`}  
                >  
                  <div  
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${  
                      currentStep >= step.number ? "bg-blue-600 text-white" : "bg-gray-200"  
                    }`}  
                  >  
                    {step.number}  
                  </div>  
                  <span className="hidden md:block text-sm font-medium">{step.title}</span>  
                </div>  
                {index < steps.length - 1 && (  
                  <div className={`w-8 h-0.5 mx-4 ${currentStep > step.number ? "bg-blue-600" : "bg-gray-200"}`} />  
                )}  
              </div>  
            ))}  
          </div>  
        </div>  
  
        <div className="grid md:grid-cols-2 gap-12">  
          <Card>  
            <CardHeader>  
              <CardTitle className="flex items-center gap-2">  
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">  
                  {currentStep}  
                </span>  
                {steps[currentStep - 1].title}  
              </CardTitle>  
            </CardHeader>  
            <CardContent className="space-y-6">  
              {/* Step 1: Registration */}  
              {currentStep === 1 && (  
                <div className="space-y-4">  
                  <div>  
                    <Label htmlFor="name">Nombre del perfil principal</Label>  
                    <Input  
                      id="name"  
                      value={formData.name}  
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}  
                      placeholder="Nombre completo"  
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
                      placeholder="correo@ejemplo.com"  
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
                      placeholder="Contraseña"  
                      required  
                    />  
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}  
                    {formData.password && <PasswordRequirements password={formData.password} />}  
                  </div>  
                  <div>  
                    <Label htmlFor="confirmPassword">Repetir contraseña</Label>  
                    <Input  
                      id="confirmPassword"  
                      type="password"  
                      value={formData.confirmPassword}  
                      onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}  
                      placeholder="Repetir contraseña"  
                      required  
                    />  
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}  
                  </div>  
                </div>  
              )}  
  
              {/* Step 2: Business Info */}  
              {currentStep === 2 && (  
                <div className="space-y-4">  
                  <div>  
                    <Label htmlFor="rut">RUT de empresa</Label>  
                    <Input  
                      id="rut"  
                      value={formData.rut || ""}  
                      onChange={(e) => setFormData((prev) => ({ ...prev, rut: e.target.value }))}  
                      placeholder="Ej: 12345678-9"  
                      required  
                    />  
                    {errors.rut && <p className="text-red-500 text-sm mt-1">{errors.rut}</p>}  
                  </div>  
                  <div>  
                    <Label htmlFor="razonSocial">Razón social</Label>  
                    <Input  
                      id="razonSocial"  
                      value={formData.razonSocial || ""}  
                      onChange={(e) => setFormData((prev) => ({ ...prev, razonSocial: e.target.value }))}  
                      placeholder="Razón social"  
                      required  
                    />  
                    {errors.razonSocial && <p className="text-red-500 text-sm mt-1">{errors.razonSocial}</p>}  
                  </div>  
                  <div>  
                    <Label htmlFor="direccion">Dirección</Label>  
                    <Input  
                      id="direccion"  
                      value={formData.direccion || ""}  
                      onChange={(e) => setFormData((prev) => ({ ...prev, direccion: e.target.value }))}  
                      placeholder="Dirección"  
                      required  
                    />  
                    {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>}  
                  </div>  
                  <div className="grid grid-cols-2 gap-4">  
                    <div>  
                      <Label htmlFor="region">Región</Label>  
                      <Select value={formData.region || ""} onValueChange={handleRegionChange} required>  
                        <SelectTrigger>  
                          <SelectValue placeholder="Selecciona una región" />  
                        </SelectTrigger>  
                        <SelectContent>  
                          {chileanRegionsAndCommunes.map((region) => (  
                            <SelectItem key={region.name} value={region.name}>  
                              {region.name}  
                            </SelectItem>  
                          ))}  
                        </SelectContent>  
                      </Select>  
                      {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}  
                    </div>  
                    <div>  
                      <Label htmlFor="comuna">Comuna</Label>  
                      <Select  
                        value={formData.comuna || ""}  
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, comuna: value }))}  
                        required  
                        disabled={!formData.region}  
                      >  
                        <SelectTrigger>  
                          <SelectValue placeholder="Selecciona una comuna" />  
                        </SelectTrigger>  
                        <SelectContent>  
                          {availableCommunes.map((comuna) => (  
                            <SelectItem key={comuna} value={comuna}>  
                              {comuna}  
                            </SelectItem>  
                          ))}  
                        </SelectContent>  
                      </Select>  
                      {errors.comuna && <p className="text-red-500 text-sm mt-1">{errors.comuna}</p>}  
                    </div>  
                  </div>  
                </div>  
              )}  
  
              {/* Step 3: Solution */}  
              {currentStep === 3 && (  
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
                      value={formData.branches  || 1}  
                      onChange={(e) =>  
                        setFormData((prev) => ({ ...prev, branches: Number.parseInt(e.target.value) || 1 }))  
                      }  
                      required  
                    />  
                    {errors.branches && <p className="text-red-500 text-sm mt-1">{errors.branches}</p>}  
                  </div>  
                </div>  
              )}  
  
              {/* Step 4: Configuration */}  
              {currentStep === 4 && (  
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
  
              {/* Navigation */}  
              <div className="flex justify-between pt-6">  
                <Button  
                  variant="outline"  
                  onClick={handleBack}  
                  disabled={currentStep === 1}  
                  className="flex items-center gap-2"  
                >  
                  <ArrowLeft className="h-4 w-4" />  
                  Anterior  
                </Button>  
                <Button onClick={handleNext} className="flex items-center gap-2">  
                  {currentStep === 4 ? "Finalizar" : "Continuar"}  
                  {currentStep !== 4 && <ArrowRight className="h-4 w-4" />}  
                </Button>  
              </div>  
            </CardContent>  
          </Card>  
  
          {/* Right Column - Plan Summary (SIN PRECIO) */}  
          <div className="flex items-center justify-center">  
            {currentStep < 4 ? (  
              <div className="text-center space-y-6">  
                <Image src="/images/logo_negro.svg" alt="Solvendo Logo" width={96} height={96} className="mx-auto" />  
                <p className="text-gray-600 max-w-md">  
                  Nos estamos encargando de la mejor experiencia para tu negocio. Por favor completa la información para  
                  adaptar nuestra demo a tus necesidades.  
                </p>  
              </div>  
            ) : (  
              <div className="text-center space-y-6">  
                <Image src="/images/logo_negro.svg" alt="Solvendo Logo" width={180} height={180} className="mx-auto" />  
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">  
                  <h3 className="text-xl font-bold mb-4">Características de tu plan</h3>  
                  <div className="text-left space-y-3">  
                    <div className="text-sm text-gray-600">  
                      <p className="font-medium mb-2">Incluye:</p>  
                      <ul className="space-y-1">  
                        {getDynamicPlanFeatures.map((feature, index) => (  
                          <li key={index} className="flex items-start">  
                            <span className="text-green-500 mr-2">✓</span>  
                            <span>{feature}</span>  
                          </li>  
                        ))}  
                      </ul>  
                    </div>  
                  </div>  
                  <p className="text-gray-600 max-w-md mt-4">¡Casi listo! Completa el registro para obtener tu demo.</p>  
                </div>  
              </div>  
            )}  
          </div>  
        </div>  
      </div>  
    </div>  
  )  
}