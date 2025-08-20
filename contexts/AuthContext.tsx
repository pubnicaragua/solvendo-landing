'use client'  
import React, {  
  createContext,  
  useContext,  
  useEffect,  
  useState,  
  useRef,  
} from "react"  
import { supabase } from "@/lib/supabase"  
  
type User = {  
  id: string  
  auth_user_id?: string  
  email: string  
  nombres?: string  
  apellidos?: string  
  empresa_id?: string  
  rut?: string  
  telefono?: string  
  direccion?: string  
  rol?: string  
  activo?: boolean  
  created_at?: string  
}  
  
interface AuthContextType {  
  user: User | null  
  empresaId: string | null  
  sucursalId: string | null  
  loading: boolean  
  signIn: (email: string, password: string) => Promise<void>  
  signOut: () => Promise<void>  
  refetchUserProfile: () => Promise<void>  
}  
  
const AuthContext = createContext<AuthContextType | undefined>(undefined)  
  
export function AuthProvider({ children }: { children: React.ReactNode }) {  
  const [user, setUser] = useState<User | null>(null)  
  const [empresaId, setEmpresaId] = useState<string | null>(null)  
  const [sucursalId, setSucursalId] = useState<string | null>(null)  
  const [loading, setLoading] = useState(true)  
  
  const isFetchingProfile = useRef(false)  
  const lastFetchedUserId = useRef<string | null>(null)  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)  
  
  const fetchUserProfile = async (userId: string, userEmail?: string) => {  
    if (isFetchingProfile.current || lastFetchedUserId.current === userId) {  
      return  
    }  
  
    isFetchingProfile.current = true  
    lastFetchedUserId.current = userId  
    setLoading(true)  
  
    try {  
      console.log("🔄 fetchUserProfile iniciado para:", userId)  
  
      // ✅ PASO 1: Buscar usuario en tabla usuarios usando auth_user_id  
      const { data: userData, error: userError } = await supabase  
        .from("usuarios")  
        .select("*")  
        .eq("auth_user_id", userId)  
        .single()  
  
      if (userError || !userData) {  
        console.log("⚠️ Usuario no encontrado en tabla usuarios")  
        setUser(null)  
        setEmpresaId(null)  
        setSucursalId(null)  
        setLoading(false)  
        isFetchingProfile.current = false  
        return  
      }  
  
      // ✅ PASO 2: Buscar relación empresa-sucursal  
      const { data: usuarioEmpresa, error: empresaError } = await supabase  
        .from("usuario_empresa")  
        .select("empresa_id, sucursal_id, rol")  
        .eq("usuario_id", userData.id)  
        .eq("activo", true)  
        .single()  
  
      if (usuarioEmpresa && !empresaError) {  
        setEmpresaId(usuarioEmpresa.empresa_id)  
        setSucursalId(usuarioEmpresa.sucursal_id)  
        setUser({ ...userData, rol: usuarioEmpresa.rol })  
      } else {  
        console.warn("⚠️ No se encontró relación empresa-sucursal")  
        setUser(userData)  
        setEmpresaId(null)  
        setSucursalId(null)  
      }  
  
      console.log("✅ fetchUserProfile completado exitosamente")  
    } catch (error) {  
      console.error("❌ Error crítico en fetchUserProfile:", error)  
      setUser(null)  
      setEmpresaId(null)  
      setSucursalId(null)  
    } finally {  
      setLoading(false)  
      isFetchingProfile.current = false  
    }  
  }  
  
  const refetchUserProfile = async () => {  
    lastFetchedUserId.current = null  
    const { data: { session } } = await supabase.auth.getSession()  
    if (session?.user) {  
      await fetchUserProfile(session.user.id, session.user.email)  
    }  
  }  
  
  const signIn = async (email: string, password: string) => {  
    try {  
      setLoading(true)  
      const { data, error } = await supabase.auth.signInWithPassword({  
        email,  
        password,  
      })  
  
      if (error) {  
        setLoading(false)  
        throw error  
      }  
    } catch (error) {  
      setLoading(false)  
      throw error  
    }  
  }  
  
  const signOut = async () => {  
    try {  
      lastFetchedUserId.current = null  
      if (timeoutRef.current) {  
        clearTimeout(timeoutRef.current)  
      }  
  
      const { error } = await supabase.auth.signOut()  
      if (error) {  
        throw error  
      }  
      setEmpresaId(null)  
      setSucursalId(null)  
      setUser(null)  
    } catch (error) {  
      throw error  
    }  
  }  
  
  useEffect(() => {  
    setLoading(true)  
  
    timeoutRef.current = setTimeout(() => {  
      setLoading(false)  
    }, 10000)  
  
    supabase.auth.getSession().then(({ data: { session }, error }) => {  
      if (timeoutRef.current) {  
        clearTimeout(timeoutRef.current)  
      }  
  
      if (error) {  
        setLoading(false)  
        return  
      }  
  
      if (session?.user) {  
        fetchUserProfile(session.user.id, session.user.email)  
      } else {  
        setUser(null)  
        setEmpresaId(null)  
        setSucursalId(null)  
        setLoading(false)  
      }  
    })  
  
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {  
      if (session?.user) {  
        if (lastFetchedUserId.current !== session.user.id) {  
          fetchUserProfile(session.user.id, session.user.email)  
        } else {  
          setLoading(false)  
        }  
      } else {  
        setUser(null)  
        setEmpresaId(null)  
        setSucursalId(null)  
        lastFetchedUserId.current = null  
        setLoading(false)  
      }  
    })  
  
    return () => {  
      subscription.unsubscribe()  
      if (timeoutRef.current) {  
        clearTimeout(timeoutRef.current)  
      }  
    }  
  }, [])  
  
  const value = React.useMemo(  
    () => ({  
      user,  
      empresaId,  
      sucursalId,  
      loading,  
      signIn,  
      signOut,  
      refetchUserProfile,  
    }),  
    [user, empresaId, sucursalId, loading]  
  )  
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>  
}  
  
export function useAuth() {  
  const context = useContext(AuthContext)  
  if (context === undefined) {  
    throw new Error("useAuth must be used within an AuthProvider")  
  }  
  return context  
}