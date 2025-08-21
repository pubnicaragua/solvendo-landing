"use client"  
import { useState, useEffect, useCallback, useMemo } from "react"  
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"  
import { Button } from "@/components/ui/button"  
import { Badge } from "@/components/ui/badge"  
import { Separator } from "@/components/ui/separator"  
import { Input } from "@/components/ui/input"  
import { Label } from "@/components/ui/label"  
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"  
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"  
import { supabase } from "@/lib/supabase"  
import { useAuth } from "@/contexts/AuthContext"  
import {  
  User,  
  Building2,  
  Users,  
  Package,  
  Download,  
  Edit,  
  Plus,  
  Trash2,  
  Calculator  
} from "lucide-react"  
import { toast } from "react-hot-toast"  
  
// ✅ Interfaz actualizada con campos dinámicos  
interface Plan {  
  id: string  
  nombre?: string  
  limite_empleados: number  
  limite_productos: number  
  api_pasarelas: boolean  
  dte_ilimitadas: boolean  
  precio: number  
  // ✅ Nuevos campos para servicios dinámicos  
  acceso_backoffice?: boolean  
  control_inventario?: boolean  
  pos_habilitado?: boolean  
  app_colaboradores?: boolean  
  reportes_avanzados?: boolean  
}  
  
interface Sucursal {  
  id: string  
  nombre: string  
  direccion: string  
  activo: boolean  
}  
  
interface Caja {  
  id: string  
  sucursal_id: string  
  nombre: string  
  activo: boolean  
}  
  
interface Usuario {  
  id: string  
  nombres: string  
  apellidos: string  
  email: string  
  rol: string  
  activo: boolean  
}  
  
export function UserDashboard() {  
  const { user, empresaId, sucursalId, loading: authLoading, refetchUserProfile } = useAuth()  
  
  // Estados para datos dinámicos  
  const [plan, setPlan] = useState<Plan | null>(null)  
  const [sucursales, setSucursales] = useState<Sucursal[]>([])  
  const [cajas, setCajas] = useState<Caja[]>([])  
  const [empleados, setEmpleados] = useState<Usuario[]>([])  
  const [productos, setProductos] = useState<any[]>([])  
  const [loading, setLoading] = useState(true)  
  const [error, setError] = useState<string | null>(null)  
  
  // Estados para modales  
  const [editProfileOpen, setEditProfileOpen] = useState(false)  
  const [addSucursalOpen, setAddSucursalOpen] = useState(false)  
  const [addCajaOpen, setAddCajaOpen] = useState(false)  
  const [addEmpleadoOpen, setAddEmpleadoOpen] = useState(false)  
  
  // Estados para formularios  
  const [profileForm, setProfileForm] = useState({  
    nombres: user?.nombres || '',  
    apellidos: user?.apellidos || '',  
    email: user?.email || ''  
  })  
  
  const [sucursalForm, setSucursalForm] = useState({  
    nombre: '',  
    direccion: ''  
  })  
  
  const [cajaForm, setCajaForm] = useState({  
    nombre: '',  
    sucursal_id: ''  
  })  
  
  const [empleadoForm, setEmpleadoForm] = useState({  
    nombres: '',  
    apellidos: '',  
    rut: '',  
    email: '',  
    telefono: '',  
    direccion: '',  
    fecha_nacimiento: '',  
    password: '',  
    rol: 'empleado'  
  })  
  
  // ✅ Actualizar formulario cuando cambie el usuario  
  useEffect(() => {  
    if (user) {  
      setProfileForm({  
        nombres: user.nombres || '',  
        apellidos: user.apellidos || '',  
        email: user.email || ''  
      })  
    }  
  }, [user])  
  
  // ✅ CRÍTICO: Función que implementa el patrón multi-tenant del backoffice  
  const loadDashboardData = useCallback(async () => {  
    if (!empresaId) {  
      console.warn('⚠️ No hay empresaId disponible para filtrar datos')  
      setError('No se pudo determinar la empresa del usuario')  
      setLoading(false)  
      return  
    }  
  
    try {  
      setLoading(true)  
      setError(null)  
      console.log('🔄 Cargando datos filtrados para empresa:', empresaId)  
  
      // ✅ CRÍTICO: Cargar plan FILTRADO por empresa  
      const { data: planData, error: planError } = await supabase  
        .from('planes')  
        .select('*')  
        .eq('empresa_id', empresaId)  
        .single()  
  
      if (planError) {  
        console.warn('⚠️ No se encontró plan para empresa:', empresaId, planError)  
      } else {  
        console.log('✅ Plan cargado:', planData)  
        setPlan(planData)  
      }  
  
      // ✅ CRÍTICO: Cargar sucursales FILTRADAS por empresa  
      const { data: sucursalesData, error: sucursalesError } = await supabase  
        .from('sucursales')  
        .select('*')  
        .eq('empresa_id', empresaId)  
        .eq('activo', true)  
  
      if (sucursalesError) {  
        console.warn('⚠️ Error cargando sucursales:', sucursalesError)  
      } else {  
        console.log('✅ Sucursales cargadas:', sucursalesData?.length || 0)  
        setSucursales(sucursalesData || [])  
      }  
  
      // ✅ CRÍTICO: Cargar cajas FILTRADAS por empresa  
      const { data: cajasData, error: cajasError } = await supabase  
        .from('cajas')  
        .select('*')  
        .eq('empresa_id', empresaId)  
        .eq('activo', true)  
  
      if (cajasError) {  
        console.warn('⚠️ Error cargando cajas:', cajasError)  
      } else {  
        console.log('✅ Cajas cargadas:', cajasData?.length || 0)  
        setCajas(cajasData || [])  
      }  
  
      // ✅ CRÍTICO: Cargar empleados usando el patrón EXACTO del backoffice  
      const { data: usuarioEmpresaData, error: ueError } = await supabase  
        .from('usuario_empresa')  
        .select('usuario_id')  
        .eq('empresa_id', empresaId)  
        .eq('activo', true)  
  
      if (ueError) {  
        console.warn('⚠️ Error cargando relaciones usuario-empresa:', ueError)  
        setEmpleados([])  
      } else if (usuarioEmpresaData?.length) {  
        const userIds = usuarioEmpresaData.map(item => item.usuario_id)  
        console.log('🔍 IDs de usuarios de la empresa:', userIds)  
  
        const { data: empleadosData, error: empleadosError } = await supabase  
          .from('usuarios')  
          .select('*')  
          .in('id', userIds)  
          .eq('activo', true)  
  
        if (empleadosError) {  
          console.warn('⚠️ Error cargando datos de empleados:', empleadosError)  
          setEmpleados([])  
        } else {  
          console.log('✅ Empleados cargados:', empleadosData?.length || 0)  
          setEmpleados(empleadosData || [])  
        }  
      } else {  
        console.log('ℹ️ No hay empleados para esta empresa')  
        setEmpleados([])  
      }  
  
      // ✅ CRÍTICO: Cargar productos FILTRADOS por empresa  
      const { data: productosData, error: productosError } = await supabase  
        .from('productos')  
        .select('*')  
        .eq('empresa_id', empresaId)  
        .eq('activo', true)  
  
      if (productosError) {  
        console.warn('⚠️ Error cargando productos:', productosError)  
      } else {  
        console.log('✅ Productos cargados:', productosData?.length || 0)  
        setProductos(productosData || [])  
      }  
  
      console.log('🎉 Carga de datos completada para empresa:', empresaId)  
    } catch (error) {  
      console.error('❌ Error crítico cargando datos del dashboard:', error)  
      setError('Error al cargar los datos del dashboard')  
    } finally {  
      setLoading(false)  
    }  
  }, [empresaId])  
  
  // ✅ Cargar datos cuando tengamos empresaId  
  useEffect(() => {  
    if (empresaId && !authLoading) {  
      console.log('🚀 Iniciando carga de datos para empresa:', empresaId)  
      loadDashboardData()  
    } else if (!empresaId && !authLoading) {  
      console.warn('⚠️ No hay empresaId disponible después de la autenticación')  
      setError('Usuario no asociado a ninguna empresa')  
      setLoading(false)  
    }  
  }, [empresaId, authLoading, loadDashboardData])  
  
  // ✅ Funciones CRUD optimizadas  
  const handleUpdateProfile = useCallback(async () => {  
    if (!user?.id) return  
  
    try {  
      const { error } = await supabase  
        .from('usuarios')  
        .update({  
          nombres: profileForm.nombres,  
          apellidos: profileForm.apellidos,  
          email: profileForm.email  
        })  
        .eq('id', user.id)  
  
      if (!error) {  
        setEditProfileOpen(false)  
        await refetchUserProfile()  
        toast.success('Perfil actualizado correctamente')  
      }  
    } catch (error) {  
      console.error('Error actualizando perfil:', error)  
      toast.error('Error al actualizar el perfil')  
    }  
  }, [user?.id, profileForm, refetchUserProfile])  
  
  // ✅ VALIDACIÓN PERMISIVA: Permitir crear más sucursales que las configuradas inicialmente  
  const handleAddSucursal = useCallback(async () => {  
    if (!empresaId) return  
  
    try {  
      // ✅ Permitir crear hasta 10 sucursales como máximo (más permisivo)  
      const limiteSucursales = 10  
      if (sucursales.length >= limiteSucursales) {  
        toast.error(`Has alcanzado el límite máximo de sucursales (${limiteSucursales})`)  
        return  
      }  
  
      const { error } = await supabase  
        .from('sucursales')  
        .insert({  
          empresa_id: empresaId,  
          nombre: sucursalForm.nombre,  
          direccion: sucursalForm.direccion,  
          activo: true  
        })  
  
      if (!error) {  
        setAddSucursalOpen(false)  
        setSucursalForm({ nombre: '', direccion: '' })  
        await loadDashboardData()  
        toast.success('Sucursal creada correctamente')  
      }  
    } catch (error) {  
      console.error('Error agregando sucursal:', error)  
      toast.error('Error al crear la sucursal')  
    }  
  }, [empresaId, sucursales.length, sucursalForm, loadDashboardData])  
  
  // ✅ VALIDACIÓN PERMISIVA: Permitir crear más cajas  
  const handleAddCaja = useCallback(async () => {  
    if (!empresaId) return  
  
    try {  
      if (!cajaForm.sucursal_id) {  
        toast.error('Selecciona una sucursal')  
        return  
      }  
  
      // ✅ Permitir hasta 20 cajas por empresa (más permisivo)  
      const limiteCajas = 20  
      if (cajas.length >= limiteCajas) {  
        toast.error(`Has alcanzado el límite máximo de cajas (${limiteCajas})`)  
        return  
      }  
  
      const { error } = await supabase  
        .from('cajas')  
        .insert({  
          sucursal_id: cajaForm.sucursal_id,  
          empresa_id: empresaId,  
          nombre: cajaForm.nombre,  
          activo: true  
        })  
  
      if (!error) {  
        setAddCajaOpen(false)  
        setCajaForm({ nombre: '', sucursal_id: '' })  
        await loadDashboardData()  
        toast.success('Caja creada correctamente')  
      }  
    } catch (error) {  
      console.error('Error agregando caja:', error)  
      toast.error('Error al crear la caja')  
    }  
  }, [empresaId, cajas.length, cajaForm, loadDashboardData])  
  
  // ✅ ACTUALIZADO: Usar edge function crear-colaborador directamente con validación permisiva  
  const handleAddEmpleado = useCallback(async () => {  
    if (!empresaId || !sucursalId) {  
      toast.error('Error: No se pudo determinar la empresa o sucursal')  
      return  
    }  
  
    try {  
      // ✅ Validación más permisiva - permitir hasta 20% más del límite del plan  
      const limitePermisivo = Math.ceil((plan?.limite_empleados || 10) * 1.2)  
 
      if (empleados.length >= limitePermisivo) {  
        toast.error(`Has alcanzado el límite máximo de empleados (${limitePermisivo})`)  
        return  
      }  
  
      // Validaciones básicas  
      if (!empleadoForm.nombres || !empleadoForm.email || !empleadoForm.rut) {  
        toast.error('Por favor completa los campos obligatorios: Nombres, Email y RUT')  
        return  
      }  
  
      if (!empleadoForm.password || empleadoForm.password.length < 6) {  
        toast.error('La contraseña debe tener al menos 6 caracteres')  
        return  
      }  
  
      // Validar si existe usuario con mismo rut  
      const { data: existingUser } = await supabase  
        .from("usuarios")  
        .select("id")  
        .eq("rut", empleadoForm.rut)  
        .single()  
  
      if (existingUser) {  
        toast.error("Ya existe un usuario con este RUT")  
        return  
      }  
  
      console.log('🔄 Creando empleado con edge function...')  
  
      // ✅ Llamar a la edge function crear-colaborador  
      const resp = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/crear-colaborador`, {  
        method: "POST",  
        headers: {  
          "Content-Type": "application/json",  
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,  
        },  
        body: JSON.stringify({  
          p_nombres: empleadoForm.nombres,  
          p_apellidos: empleadoForm.apellidos,  
          p_rut: empleadoForm.rut,  
          p_email: empleadoForm.email,  
          p_telefono: empleadoForm.telefono,  
          p_direccion: empleadoForm.direccion,  
          p_fecha_nacimiento: empleadoForm.fecha_nacimiento || null,  
          p_password: empleadoForm.password, // ✅ Contraseña personalizada  
          p_empresa_id: empresaId,  
          p_sucursal_id: sucursalId,  
          p_rol: empleadoForm.rol || "empleado",  
        }),  
      })
  
      const data = await resp.json()  
      console.log("📌 Respuesta Edge Function:", data)  
  
      if (!resp.ok || !data.success) {  
        throw new Error(data.error || "Error desconocido al crear usuario")  
      }  
  
      toast.success("Empleado creado correctamente")  
      setAddEmpleadoOpen(false)  
      setEmpleadoForm({  
        nombres: '',  
        apellidos: '',  
        rut: '',  
        email: '',  
        telefono: '',  
        direccion: '',  
        fecha_nacimiento: '',  
        password: '',  
        rol: 'empleado'  
      })  
      await loadDashboardData()  
  
    } catch (error: any) {  
      console.error("Error creando empleado:", error)  
      toast.error("Error al crear el empleado")  
    }  
  }, [empresaId, sucursalId, empleados.length, plan?.limite_empleados, empleadoForm, loadDashboardData])  
  
  const handleDeleteSucursal = useCallback(async (id: string) => {  
    try {  
      const { error } = await supabase  
        .from('sucursales')  
        .update({ activo: false })  
        .eq('id', id)  
  
      if (!error) {  
        await loadDashboardData()  
        toast.success('Sucursal eliminada correctamente')  
      }  
    } catch (error) {  
      console.error('Error eliminando sucursal:', error)  
      toast.error('Error al eliminar la sucursal')  
    }  
  }, [loadDashboardData])  
  
  // ✅ Memoizar datos procesados para mejor rendimiento  
  const cajasFiltradasPorSucursal = useMemo(() => {  
    return (sucursalId: string) => cajas.filter(c => c.sucursal_id === sucursalId)  
  }, [cajas])  
  
  // ✅ Mostrar loading mientras se cargan los datos  
  if (authLoading || loading) {  
    return (  
      <div className="container mx-auto p-6">  
        <div className="text-center">  
          <p>Cargando dashboard...</p>  
        </div>  
      </div>  
    )  
  }  
  
  // ✅ Mostrar error si no hay usuario o empresa  
  if (!user || !empresaId) {  
    return (  
      <div className="container mx-auto p-6">  
        <div className="text-center text-red-600">  
          <p>Error: No se pudo cargar la información del usuario o empresa.</p>  
          {error && <p className="text-sm mt-2">{error}</p>}  
        </div>  
      </div>  
    )  
  }  
  
  return (  
    <div className="container mx-auto p-6 space-y-6">  
      {/* Resumen del Plan - Datos Dinámicos */}  
      <Card>  
        <CardHeader>  
          <CardTitle className="flex items-center gap-2">  
            <Package className="h-5 w-5" />  
            Resumen de plan  
          </CardTitle>  
        </CardHeader>  
        <CardContent className="space-y-4">  
          {plan ? (  
            <>  
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">  
                <div>  
                  <p className="text-sm text-gray-600">Límite de empleados</p>  
                  <p className="font-semibold">{empleados.length}/{plan.limite_empleados} empleados</p>  
                </div>  
                <div>  
                  <p className="text-sm text-gray-600">Productos registrados</p>  
                  <p className="font-semibold">{productos.length}/{plan.limite_productos} productos</p>  
                </div>  
                <div>  
                  <p className="text-sm text-gray-600">Integración API</p>  
                  <Badge variant={plan.api_pasarelas ? "default" : "secondary"}>  
                    {plan.api_pasarelas ? "Activa" : "Inactiva"}  
                  </Badge>  
                </div>  
                <div>  
                  <p className="text-sm text-gray-600">DTE</p>  
                  <Badge variant={plan.dte_ilimitadas ? "default" : "secondary"}>  
                    {plan.dte_ilimitadas ? "Ilimitadas" : "Limitadas"}  
                  </Badge>  
                </div>  
              </div>  
  
              {/* ✅ Badges dinámicos basados en el plan real */}  
              <div className="flex flex-wrap gap-2">  
                {plan.acceso_backoffice && <Badge>App backoffice</Badge>}  
                {plan.pos_habilitado && <Badge>Sistema POS</Badge>}  
                {plan.app_colaboradores && <Badge>App colaboradores</Badge>}  
              </div>  
            </>  
          ) : (  
            <p>Cargando información del plan...</p>  
          )}  
        </CardContent>  
      </Card>  
  
      {/* Cuenta - Funcional */}  
      <Card>  
        <CardHeader>  
          <CardTitle className="flex items-center gap-2">  
            <User className="h-5 w-5" />  
            Cuenta  
          </CardTitle>  
        </CardHeader>  
        <CardContent className="space-y-4">  
          <div className="flex items-center justify-between">  
            <div>  
              <p className="font-medium">Editar perfil</p>  
              <p className="text-sm text-gray-600">{user.nombres} {user.apellidos} - {user.email}</p>  
            </div>  
            <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>  
              <DialogTrigger asChild>  
                <Button variant="outline" size="sm">  
                  <Edit className="h-4 w-4 mr-2" />  
                  Editar  
                </Button>  
              </DialogTrigger>  
              <DialogContent>  
                <DialogHeader>  
                  <DialogTitle>Editar Perfil</DialogTitle>  
                </DialogHeader>  
                <div className="space-y-4">  
                  <div>  
                    <Label htmlFor="nombres">Nombres</Label>  
                    <Input  
                      id="nombres"  
                      value={profileForm.nombres}  
                      onChange={(e) => setProfileForm(prev => ({ ...prev, nombres: e.target.value }))}  
                    />  
                  </div>  
                  <div>  
                    <Label htmlFor="apellidos">Apellidos</Label>  
                    <Input  
                      id="apellidos"  
                      value={profileForm.apellidos}  
                      onChange={(e) => setProfileForm(prev => ({ ...prev, apellidos: e.target.value }))}  
                    />  
                  </div>  
                  <div>  
                    <Label htmlFor="email">Email</Label>  
                    <Input  
                      id="email"  
                      type="email"  
                      value={profileForm.email}  
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}  
                    />  
                  </div>  
                  <Button onClick={handleUpdateProfile} className="w-full">  
                    Guardar Cambios  
                  </Button>  
                </div>  
              </DialogContent>  
            </Dialog>  
          </div>  
  
          <Separator />  
  
          {/* Editar Roles */}  
          <div className="flex items-center justify-between">  
            <div>  
              <p className="font-medium">Editar roles</p>  
              <p className="text-sm text-gray-600">Gestionar permisos de usuarios</p>  
            </div>  
            <Dialog>  
              <DialogTrigger asChild>  
                <Button variant="outline" size="sm">  
                  <Users className="h-4 w-4 mr-2" />  
                  Gestionar  
                </Button>  
              </DialogTrigger>  
              <DialogContent className="max-w-2xl">  
                <DialogHeader>  
                  <DialogTitle>Gestión de Roles y Empleados</DialogTitle>  
                </DialogHeader>  
                <div className="space-y-4">  
                  <div className="flex justify-between items-center">  
                    <h4 className="font-medium">Empleados Actuales ({empleados.length}/{plan?.limite_empleados || 0})</h4>  
                    <Dialog open={addEmpleadoOpen} onOpenChange={setAddEmpleadoOpen}>  
                      <DialogTrigger asChild>  
                        <Button size="sm">  
                          <Plus className="h-4 w-4 mr-2" />  
                          Agregar Empleado  
                        </Button>  
                      </DialogTrigger>  
                      <DialogContent>  
                        <DialogHeader>  
                          <DialogTitle>Nuevo Empleado</DialogTitle>  
                        </DialogHeader>  
                        <div className="space-y-4">  
                          <div>  
                            <Label htmlFor="emp-nombres">Nombres</Label>  
                            <Input  
                              id="emp-nombres"  
                              value={empleadoForm.nombres}  
                              onChange={(e) => setEmpleadoForm(prev => ({ ...prev, nombres: e.target.value }))}  
                            />  
                          </div>  
                          <div>  
                            <Label htmlFor="emp-apellidos">Apellidos</Label>  
                            <Input  
                              id="emp-apellidos"  
                              value={empleadoForm.apellidos}  
                              onChange={(e) => setEmpleadoForm(prev => ({ ...prev, apellidos: e.target.value }))}  
                            />  
                          </div>  
                          <div>  
                            <Label htmlFor="emp-rut">RUT</Label>  
                            <Input  
                              id="emp-rut"  
                              value={empleadoForm.rut}  
                              onChange={(e) => setEmpleadoForm(prev => ({ ...prev, rut: e.target.value }))}  
                              placeholder="12.345.678-9"  
                            />  
                          </div>  
                          <div>  
                            <Label htmlFor="emp-email">Email</Label>  
                            <Input  
                              id="emp-email"  
                              type="email"  
                              value={empleadoForm.email}  
                              onChange={(e) => setEmpleadoForm(prev => ({ ...prev, email: e.target.value }))}  
                            />  
                          </div>  
                          <div>  
                            <Label htmlFor="emp-telefono">Teléfono</Label>  
                            <Input  
                              id="emp-telefono"  
                              value={empleadoForm.telefono}  
                              onChange={(e) => setEmpleadoForm(prev => ({ ...prev, telefono: e.target.value }))}  
                            />  
                          </div>  
                          <div>  
                            <Label htmlFor="emp-password">Contraseña</Label>  
                            <Input  
                              id="emp-password"  
                              type="password"  
                              value={empleadoForm.password}  
                              onChange={(e) => setEmpleadoForm(prev => ({ ...prev, password: e.target.value }))}  
                              minLength={6}  
                            />  
                          </div>  
                          <div>  
                            <Label htmlFor="emp-rol">Rol</Label>  
                            <Select value={empleadoForm.rol} onValueChange={(value) => setEmpleadoForm(prev => ({ ...prev, rol: value }))}>  
                              <SelectTrigger>  
                                <SelectValue />  
                              </SelectTrigger>  
                              <SelectContent>  
                                <SelectItem value="empleado">Empleado</SelectItem>  
                                <SelectItem value="supervisor">Supervisor</SelectItem>  
                                <SelectItem value="administrador">Administrador</SelectItem>  
                              </SelectContent>  
                            </Select>  
                          </div>  
                          <Button onClick={handleAddEmpleado} className="w-full">  
                            Crear Empleado  
                          </Button>  
                        </div>  
                      </DialogContent>  
                    </Dialog>  
                  </div>  
                  <div className="max-h-60 overflow-y-auto">  
                    {empleados.map((empleado) => (  
                      <div key={empleado.id} className="flex items-center justify-between p-3 border rounded-lg">  
                        <div>  
                          <p className="font-medium">{empleado.nombres} {empleado.apellidos}</p>  
                          <p className="text-sm text-gray-600">{empleado.email}</p>  
                          <Badge variant="outline" className="mt-1">{empleado.rol}</Badge>  
                        </div>  
                        <Button variant="ghost" size="sm">  
                          <Edit className="h-4 w-4" />  
                        </Button>  
                      </div>  
                    ))}  
                  </div>  
                </div>  
              </DialogContent>  
            </Dialog>  
          </div>  
  
          <Separator />  
  
          {/* Editar Sucursales con CRUD completo */}  
          <div className="flex items-center justify-between">  
            <div>  
              <p className="font-medium">Editar sucursales ({sucursales.length})</p>  
              <p className="text-sm text-gray-600">Gestionar ubicaciones de negocio</p>  
            </div>  
            <Dialog>  
              <DialogTrigger asChild>  
                <Button variant="outline" size="sm">  
                  <Building2 className="h-4 w-4 mr-2" />  
                  Gestionar  
                </Button>  
              </DialogTrigger>  
              <DialogContent className="max-w-4xl">  
                <DialogHeader>  
                  <DialogTitle>Gestión de Sucursales y Cajas</DialogTitle>  
                </DialogHeader>  
                <div className="space-y-6">  
                  {/* Sección Sucursales */}  
                  <div>  
                    <div className="flex justify-between items-center mb-4">  
                      <h4 className="font-medium">Sucursales Activas ({sucursales.length})</h4>  
                      <Dialog open={addSucursalOpen} onOpenChange={setAddSucursalOpen}>  
                        <DialogTrigger asChild>  
                          <Button size="sm">  
                            <Plus className="h-4 w-4 mr-2" />  
                            Nueva Sucursal  
                          </Button>  
                        </DialogTrigger>  
                        <DialogContent>  
                          <DialogHeader>  
                            <DialogTitle>Nueva Sucursal</DialogTitle>  
                          </DialogHeader>  
                          <div className="space-y-4">  
                            <div>  
                            <Label htmlFor="suc-nombre">Nombre</Label>  
                              <Input  
                                id="suc-nombre"  
                                value={sucursalForm.nombre}  
                                onChange={(e) => setSucursalForm(prev => ({ ...prev, nombre: e.target.value }))}  
                                placeholder="Ej: Sucursal Centro"  
                              />  
                            </div>  
                            <div>  
                              <Label htmlFor="suc-direccion">Dirección</Label>  
                              <Input  
                                id="suc-direccion"  
                                value={sucursalForm.direccion}  
                                onChange={(e) => setSucursalForm(prev => ({ ...prev, direccion: e.target.value }))}  
                                placeholder="Ej: Av. Principal 123"  
                              />  
                            </div>  
                            <Button onClick={handleAddSucursal} className="w-full">  
                              Crear Sucursal  
                            </Button>  
                          </div>  
                        </DialogContent>  
                      </Dialog>  
                    </div>  
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">  
                      {sucursales.length > 0 ? (  
                        sucursales.map((sucursal) => (  
                          <div key={sucursal.id} className="border rounded-lg p-4">  
                            <div className="flex items-center justify-between mb-3">  
                              <div>  
                                <p className="font-medium">{sucursal.nombre}</p>  
                                <p className="text-sm text-gray-600">{sucursal.direccion}</p>  
                              </div>  
                              <div className="flex gap-2">  
                                <Button variant="ghost" size="sm">  
                                  <Edit className="h-4 w-4" />  
                                </Button>  
                                <Button  
                                  variant="ghost"  
                                  size="sm"  
                                  onClick={() => handleDeleteSucursal(sucursal.id)}  
                                >  
                                  <Trash2 className="h-4 w-4 text-red-500" />  
                                </Button>  
                              </div>  
                            </div>  
                            <div className="border-t pt-3">  
                              <div className="flex justify-between items-center mb-2">  
                                <p className="text-sm font-medium">Cajas ({cajasFiltradasPorSucursal(sucursal.id).length})</p>  
                                <Button  
                                  size="sm"  
                                  variant="outline"  
                                  onClick={() => {  
                                    setCajaForm(prev => ({ ...prev, sucursal_id: sucursal.id }))  
                                    setAddCajaOpen(true)  
                                  }}  
                                >  
                                  <Calculator className="h-3 w-3 mr-1" />  
                                  Agregar Caja  
                                </Button>  
                              </div>  
                              <div className="space-y-2">  
                                {cajasFiltradasPorSucursal(sucursal.id).map((caja) => (  
                                  <div key={caja.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">  
                                    <div>  
                                      <p className="text-sm font-medium">{caja.nombre}</p>  
                                    </div>  
                                    <Button variant="ghost" size="sm">  
                                      <Edit className="h-3 w-3" />  
                                    </Button>  
                                  </div>  
                                ))}  
                                {cajasFiltradasPorSucursal(sucursal.id).length === 0 && (  
                                  <p className="text-xs text-gray-500 text-center py-2">No hay cajas asignadas</p>  
                                )}  
                              </div>  
                            </div>  
                          </div>  
                        ))  
                      ) : (  
                        <div className="col-span-2 text-center text-gray-500 py-8">  
                          <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />  
                          <p>No hay sucursales registradas</p>  
                        </div>  
                      )}  
                    </div>  
                  </div>  
  
                  <Dialog open={addCajaOpen} onOpenChange={setAddCajaOpen}>  
                    <DialogContent>  
                      <DialogHeader>  
                        <DialogTitle>Nueva Caja</DialogTitle>  
                      </DialogHeader>  
                      <div className="space-y-4">  
                        <div>  
                          <Label htmlFor="caja-sucursal">Sucursal</Label>  
                          <Select  
                            value={cajaForm.sucursal_id}  
                            onValueChange={(value) => setCajaForm(prev => ({ ...prev, sucursal_id: value }))}  
                          >  
                            <SelectTrigger>  
                              <SelectValue placeholder="Selecciona una sucursal" />  
                            </SelectTrigger>  
                            <SelectContent>  
                              {sucursales.map((sucursal) => (  
                                <SelectItem key={sucursal.id} value={sucursal.id}>  
                                  {sucursal.nombre}  
                                </SelectItem>  
                              ))}  
                            </SelectContent>  
                          </Select>  
                        </div>  
                        <div>  
                          <Label htmlFor="caja-nombre">Nombre de la Caja</Label>  
                          <Input  
                            id="caja-nombre"  
                            value={cajaForm.nombre}  
                            onChange={(e) => setCajaForm(prev => ({ ...prev, nombre: e.target.value }))}  
                            placeholder="Ej: Caja Principal"  
                          />  
                        </div>  
                        <Button onClick={handleAddCaja} className="w-full">  
                          Crear Caja  
                        </Button>  
                      </div>  
                    </DialogContent>  
                  </Dialog>  
                </div>  
              </DialogContent>  
            </Dialog>  
          </div>  
        </CardContent>  
      </Card>  
  
      <Card>  
        <CardHeader>  
          <CardTitle className="flex items-center gap-2">  
            <Download className="h-5 w-5" />  
            Descarga de apps  
          </CardTitle>  
        </CardHeader>  
        <CardContent className="space-y-4">  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">  
            <div className="p-4 border rounded-lg">  
              <h4 className="font-medium mb-2">Back Office:</h4>  
              <Button onClick={() => window.open('https://solvendo-backoffice.windsurf.build', '_blank')} className="w-full">  
                <Download className="h-4 w-4 mr-2" />  
                Instalar App  
              </Button>  
            </div>  
            <div className="p-4 border rounded-lg">  
              <h4 className="font-medium mb-2">POS:</h4>  
              <Button onClick={() => window.open('https://solvendo-pos.windsurf.build', '_blank')} className="w-full">  
                <Download className="h-4 w-4 mr-2" />  
                Instalar App  
              </Button>  
            </div>  
          </div>  
        </CardContent>  
      </Card>  
    </div>  
  )  
}