'use client'  
  
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'  
import { supabase } from '@/lib/supabase'  
  
type User = {  
  id: string  
  email: string  
  nombres?: string  
  apellidos?: string  
  empresa_id?: string  
  rut?: string  
  telefono?: string  
  direccion?: string  
  activo?: boolean  
  created_at?: string  
}  
  
type AuthContextType = {  
  user: User | null  
  loading: boolean  
  login: (email: string, password: string) => Promise<void>  
  logout: () => Promise<void>  
}  
  
const AuthContext = createContext<AuthContextType | undefined>(undefined)  
  
export function AuthProvider({ children }: { children: ReactNode }) {  
  const [user, setUser] = useState<User | null>(null)  
  const [loading, setLoading] = useState(true)  
  
  // Función para limpiar sesiones antiguas  
  const clearOldSessions = async () => {  
    try {  
      localStorage.clear()  
      sessionStorage.clear()  
      await supabase.auth.signOut()  
      document.cookie.split(";").forEach((c) => {  
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")  
      })  
    } catch (error) {  
      console.error('Error limpiando sesiones:', error)  
    }  
  }  
  
  useEffect(() => {  
    const initializeAuth = async () => {  
      await clearOldSessions()  
        
      try {  
        console.log('🔍 Verificando sesión existente...')  
        const { data: { session } } = await supabase.auth.getSession()  
          
        if (session?.user) {  
          console.log('✅ Sesión encontrada para:', session.user.email)  
          const { data: userData, error: userError } = await supabase  
            .from('usuarios')  
            .select('*')  
            .eq('email', session.user.email)  
            .single()  
            
          if (userData) {  
            console.log('✅ Datos de usuario encontrados:', userData)  
            setUser({  
              id: session.user.id,  
              email: session.user.email || '',  
              nombres: userData.nombres,  
              apellidos: userData.apellidos,  
              empresa_id: userData.empresa_id,  
              rut: userData.rut,  
              telefono: userData.telefono,  
              direccion: userData.direccion,  
              activo: userData.activo,  
              created_at: userData.created_at  
            })  
          } else {  
            console.log('⚠️ No se encontraron datos de usuario en tabla usuarios')  
            setUser(null)  
          }  
        } else {  
          console.log('ℹ️ No hay sesión activa')  
          setUser(null)  
        }  
      } catch (error) {  
        console.error('❌ Error verificando autenticación:', error)  
        setUser(null)  
      } finally {  
        setLoading(false)  
      }  
    }  
  
    initializeAuth()  
  
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {  
      console.log('🔄 Cambio de estado de auth:', event, session?.user?.email)  
        
      if (session?.user) {  
        try {  
          const { data: userData, error } = await supabase  
            .from('usuarios')  
            .select('*')  
            .eq('email', session.user.email)  
            .single()  
            
          if (userData) {  
            console.log('✅ Estableciendo usuario en contexto:', userData)  
            setUser({  
              id: session.user.id,  
              email: session.user.email || '',  
              nombres: userData.nombres,  
              apellidos: userData.apellidos,  
              empresa_id: userData.empresa_id,  
              rut: userData.rut,  
              telefono: userData.telefono,  
              direccion: userData.direccion,  
              activo: userData.activo,  
              created_at: userData.created_at  
            })  
          } else {  
            setUser(null)  
          }  
        } catch (error) {  
          console.error('💥 Error en listener de auth state change:', error)  
          setUser(null)  
        }  
      } else {  
        console.log('🚪 Usuario desconectado')  
        setUser(null)  
      }  
    })  
  
    return () => {  
      subscription.unsubscribe()  
    }  
  }, [])  
  
  const login = async (email: string, password: string) => {  
    try {  
      console.log('🔐 Iniciando login para:', email)  
        
      const { data, error } = await supabase.auth.signInWithPassword({  
        email,  
        password,  
      })  
        
      if (error) {  
        console.error('❌ Error de autenticación Supabase:', error)  
        throw error  
      }  
        
      if (!data.user) {  
        console.error('❌ No se obtuvo usuario de Supabase')  
        throw new Error('No se pudo iniciar sesión. Por favor, verifica tus credenciales.')  
      }  
        
      console.log('✅ Autenticación Supabase exitosa para:', data.user.email)  
        
      // Buscar en tabla usuarios  
      const { data: userData, error: userError } = await supabase  
        .from('usuarios')  
        .select('*')  
        .eq('email', email)  
        .single()  
        
      if (userData) {  
        console.log('✅ Usuario encontrado en tabla usuarios')  
          
        // Si el usuario existe pero NO tiene empresa_id, crear empresa desde demo  
        if (!userData.empresa_id) {  
          const { data: demoData } = await supabase  
            .from('demo_registrations')  
            .select('*')  
            .eq('email', email)  
            .single()  
            
          if (demoData) {  
            // Crear empresa y actualizar usuario  
            let empresaId = null  
            if (demoData.rut) {  
              const { data: nuevaEmpresa } = await supabase  
                .from('empresas')  
                .insert({  
                  rut: demoData.rut,  
                  razon_social: demoData.razon_social || demoData.name,  
                  nombre: demoData.name,  
                  direccion: demoData.direccion,  
                  region: demoData.region,  
                  comuna: demoData.comuna,  
                  activo: true  
                })  
                .select()  
                .single()  
                
              empresaId = nuevaEmpresa?.id  
            }  
              
            if (empresaId) {  
              await supabase  
                .from('usuarios')  
                .update({ empresa_id: empresaId })  
                .eq('id', userData.id)  
                
              // Crear datos adicionales  
              await supabase.from('planes').insert({  
                empresa_id: empresaId,  
                nombre: 'Plan Demo',  
                limite_empleados: 50,  
                limite_productos: 200,  
                api_pasarelas: true,  
                dte_ilimitadas: demoData.dte === 'yes',  
                precio: 69  
              })  
                
              await supabase.from('metodos_pago').insert({  
                empresa_id: empresaId,  
                tipo: 'visa',  
                numero_enmascarado: 'XXXX-XXXX-XXXX-0000',  
                es_principal: true,  
                activo: true  
              })  
            }  
          }  
        }  
          
        // NO HACER NAVEGACIÓN AQUÍ - dejar que el componente lo maneje  
        return  
      }  
        
      // Si no existe en usuarios, buscar en demo_registrations  
      const { data: demoData, error: demoError } = await supabase  
        .from('demo_registrations')  
        .select('*')  
        .eq('email', email)  
        .single()  
        
      if (demoData) {  
        console.log('✅ Usuario encontrado en demo_registrations, creando perfil...')  
          
        // Crear empresa  
        let empresaId = null  
        if (demoData.rut) {  
          const { data: nuevaEmpresa } = await supabase  
            .from('empresas')  
            .insert({  
              rut: demoData.rut,  
              razon_social: demoData.razon_social || demoData.name,  
              nombre: demoData.name,  
              direccion: demoData.direccion,  
              region: demoData.region,  
              comuna: demoData.comuna,  
              activo: true  
            })  
            .select()  
            .single()  
            
          empresaId = nuevaEmpresa?.id  
        }  
          
        // Crear usuario  
        await supabase.from('usuarios').insert({  
          email: demoData.email,  
          nombres: demoData.name.split(' ')[0] || demoData.name,  
          apellidos: demoData.name.split(' ').slice(1).join(' ') || '',  
          rut: demoData.rut || `TEMP-${data.user.id}`,  
          empresa_id: empresaId,  
          auth_user_id: data.user.id,  
          activo: true  
        })  
          
        // Crear datos adicionales  
        if (empresaId) {  
          await supabase.from('planes').insert({  
            empresa_id: empresaId,  
            nombre: 'Plan Demo',  
            limite_empleados: 50,  
            limite_productos: 200,  
            api_pasarelas: true,  
            dte_ilimitadas: demoData.dte === 'yes',  
            precio: 69  
          })  
            
          await supabase.from('metodos_pago').insert({  
            empresa_id: empresaId,  
            tipo: 'visa',  
            numero_enmascarado: 'XXXX-XXXX-XXXX-0000',  
            es_principal: true,  
            activo: true  
          })  
        }  
          
        console.log('✅ Setup completo para usuario demo')  
        return  
      }  
        
      // Usuario básico  
      if (demoError) {  
        const { data: nuevaEmpresa } = await supabase  
          .from('empresas')  
          .insert({  
            rut: `TEMP-${data.user.id}`,  
            razon_social: email.split('@')[0],  
            nombre: email.split('@')[0],  
            activo: true  
          })  
          .select()  
          .single()  
          
        if (nuevaEmpresa) {  
          await supabase.from('usuarios').insert({  
            email: email,  
            nombres: 'Usuario',  
            apellidos: '',  
            rut: `TEMP-${data.user.id}`,  
            empresa_id: nuevaEmpresa.id,  
            auth_user_id: data.user.id,  
            activo: true  
          })  
        }  
          
        console.log('✅ Usuario básico creado')  
        return  
      }  
    } catch (error) {  
      console.error('💥 Error completo en login:', error)  
      throw error  
    }  
  }  
  
  const logout = async () => {  
    try {  
      console.log('🚪 Cerrando sesión...')  
      const { error } = await supabase.auth.signOut()  
      if (error) throw error  
      setUser(null)  
      console.log('✅ Sesión cerrada exitosamente')  
    } catch (error) {  
      console.error('❌ Error cerrando sesión:', error)  
      throw error  
    }  
  }  
  
  const value = {  
    user,  
    loading,  
    login,  
    logout,  
  }  
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>  
}  
  
export function useAuth() {  
  const context = useContext(AuthContext)  
  if (context === undefined) {  
    throw new Error('useAuth must be used within an AuthProvider')  
  }  
  return context  
}