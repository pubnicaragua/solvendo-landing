import { useState, useEffect } from 'react'  
import { supabase } from '@/lib/supabase'  
  
interface PaginationOptions {  
  limit?: number  
  offset?: number  
  [key: string]: any  
}  
  
export function useSupabaseData<T>(  
  table: string,  
  select: string = '*',  
  filters?: PaginationOptions  
) {  
  const [data, setData] = useState<T[]>([])  
  const [loading, setLoading] = useState(true)  
  const [error, setError] = useState<string | null>(null)  
  const [totalCount, setTotalCount] = useState<number>(0)  
  
  useEffect(() => {  
    fetchData()  
  }, [table, select, JSON.stringify(filters)])  
  
  const fetchData = async () => {  
    try {  
      setLoading(true)  
      setError(null)  
        
      let query = supabase.from(table).select(select, { count: 'exact' })  
        
      if (filters) {  
        const { limit, offset, ...otherFilters } = filters  
          
        // Aplicar filtros  
        Object.entries(otherFilters).forEach(([key, value]) => {  
          if (value !== undefined && value !== null) {  
            query = query.eq(key, value)  
          }  
        })  
          
        // Aplicar paginación  
        if (limit && offset !== undefined) {  
          query = query.range(offset, offset + limit - 1)  
        }  
      }  
        
      const { data: result, error, count } = await query  
        
      if (error) {  
        setError(error.message)  
        setData([])  
        setTotalCount(0)  
      } else {  
        setData((result as T[]) || []) 
        setTotalCount(count || 0)  
      }  
    } catch (err: any) {  
      setError(err.message)  
      setData([])  
      setTotalCount(0)  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  const refetch = () => {  
    fetchData()  
  }  
  
  return { data, loading, error, refetch, totalCount }  
}  
  
export function useSupabaseInsert<T>(table: string) {  
  const [loading, setLoading] = useState(false)  
  const [error, setError] = useState<string | null>(null)  
  
  const insert = async (data: Partial<T>) => {  
    try {  
      setLoading(true)  
      setError(null)  
        
      console.log(`📝 Inserting into ${table}:`, data)  
        
      const { error } = await supabase.from(table).insert(data)  
        
      if (error) {  
        console.error(`❌ Supabase error details:`, {  
          message: error.message,  
          details: error.details,  
          hint: error.hint,  
          code: error.code  
        })  
        setError(error.message)  
        return { success: false, error }  
      }  
        
      return { success: true, error: null }  
    } catch (err: any) {  
      console.error(`❌ Insert ${table} error:`, err.message)  
      setError(err.message)  
      return { success: false, error: err }  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  return { insert, loading, error }  
}  
  
export function useSupabaseUpdate<T>(table: string) {  
  const [loading, setLoading] = useState(false)  
  const [error, setError] = useState<string | null>(null)  
  
  const update = async (id: string, data: Partial<T>) => {  
    try {  
      setLoading(true)  
      setError(null)  
        
      console.log(`✏️ Updating ${table}:`, { id, data })  
        
      const { error } = await supabase.from(table).update(data).eq('id', id)  
        
      if (error) {  
        setError(error.message)  
        return { success: false, error }  
      }  
        
      return { success: true, error: null }  
    } catch (err: any) {  
      console.error(`❌ Update ${table} error:`, err.message)  
      setError(err.message)  
      return { success: false, error: err }  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  return { update, loading, error }  
}  
  
export function useSupabaseDelete(table: string) {  
  const [loading, setLoading] = useState(false)  
  const [error, setError] = useState<string | null>(null)  
  
  const remove = async (id: string) => {  
    try {  
      setLoading(true)  
      setError(null)  
        
      console.log(`🗑️ Deleting from ${table}:`, id)  
        
      const { error } = await supabase.from(table).delete().eq('id', id)  
        
      if (error) {  
        setError(error.message)  
        return { success: false, error }  
      }  
        
      return { success: true, error: null }  
    } catch (err: any) {  
      console.error(`❌ Delete ${table} error:`, err.message)  
      setError(err.message)  
      return { success: false, error: err }  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  return { remove, loading, error }  
}