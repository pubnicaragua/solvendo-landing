'use client'  
  
import { useState, useEffect } from 'react'  
import { supabase } from '@/lib/supabase'  
  
export function useSupabaseData<T = any>(table: string, select: string = '*', filters?: Record<string, any>) {  
  const [data, setData] = useState<T[]>([])  
  const [loading, setLoading] = useState(true)  
  const [error, setError] = useState<Error | null>(null)  
  
  useEffect(() => {  
    const fetchData = async () => {  
      try {  
        setLoading(true)  
        setError(null)  
          
        let query = supabase.from(table).select(select)  
          
        if (filters) {  
          Object.entries(filters).forEach(([key, value]) => {  
            if (value !== undefined && value !== null) {  
              query = query.eq(key, value)  
            }  
          })  
        }  
          
        const { data: result, error: queryError } = await query as { data: T[] | null, error: any }  
          
        if (queryError) throw queryError  
          
        setData(result || [])  
      } catch (err) {  
        console.error(`Error fetching data from ${table}:`, err)  
        setError(err instanceof Error ? err : new Error(String(err)))  
        setData([])  
      } finally {  
        setLoading(false)  
      }  
    }  
  
    fetchData()  
  }, [table, select, JSON.stringify(filters)])  
  
  const refetch = async () => {  
    const fetchData = async () => {  
      try {  
        setLoading(true)  
        setError(null)  
          
        let query = supabase.from(table).select(select)  
          
        if (filters) {  
          Object.entries(filters).forEach(([key, value]) => {  
            if (value !== undefined && value !== null) {  
              query = query.eq(key, value)  
            }  
          })  
        }  
          
        const { data: result, error: queryError } = await query as { data: T[] | null, error: any }  
          
        if (queryError) throw queryError  
          
        setData(result || [])  
        return result || []  
      } catch (err) {  
        console.error(`Error refetching data from ${table}:`, err)  
        setError(err instanceof Error ? err : new Error(String(err)))  
        setData([])  
        return []  
      } finally {  
        setLoading(false)  
      }  
    }  
    
    return fetchData()  
  }  
  
  return { data, loading, error, refetch }  
}  

export function useSupabaseInsert<T = any>(table: string) {  
  const [loading, setLoading] = useState(false)  
  const [error, setError] = useState<Error | null>(null)  
  
  const insert = async (data: Partial<T>) => {  
    try {  
      setLoading(true)  
      setError(null)  
      
      const { data: result, error: insertError } = await supabase  
        .from(table)  
        .insert([data])  
        .select()  
      
      if (insertError) throw insertError  
      
      return result?.[0] as T | undefined  
    } catch (err) {  
      console.error(`Error inserting into ${table}:`, err)  
      setError(err instanceof Error ? err : new Error(String(err)))  
      return undefined  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  return { insert, loading, error }  
}  

export function useSupabaseUpdate<T = any>(table: string) {  
  const [loading, setLoading] = useState(false)  
  const [error, setError] = useState<Error | null>(null)  
  
  const update = async (id: string | number, updates: Partial<T>) => {  
    try {  
      setLoading(true)  
      setError(null)  
      
      const { data: result, error: updateError } = await supabase  
        .from(table)  
        .update(updates)  
        .eq('id', id)  
        .select()  
      
      if (updateError) throw updateError  
      
      return result?.[0] as T | undefined  
    } catch (err) {  
      console.error(`Error updating ${table} with id ${id}:`, err)  
      setError(err instanceof Error ? err : new Error(String(err)))  
      return undefined  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  return { update, loading, error }  
}  

export function useSupabaseDelete(table: string) {  
  const [loading, setLoading] = useState(false)  
  const [error, setError] = useState<Error | null>(null)  
  
  const remove = async (id: string | number) => {  
    try {  
      setLoading(true)  
      setError(null)  
      
      const { error: deleteError } = await supabase  
        .from(table)  
        .delete()  
        .eq('id', id)  
      
      if (deleteError) throw deleteError  
      
      return true  
    } catch (err) {  
      console.error(`Error deleting from ${table} with id ${id}:`, err)  
      setError(err instanceof Error ? err : new Error(String(err)))  
      return false  
    } finally {  
      setLoading(false)  
    }  
  }  
  
  return { remove, loading, error }  
}
