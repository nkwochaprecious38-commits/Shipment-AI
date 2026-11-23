import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useAuth } from './auth'

export function useTable<T extends { id: string }>(table: string, seed?: () => any[]) {
  const { orgId, user } = useAuth()
  const [rows, setRows] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!orgId) return
    setLoading(true)
    const { data, error } = await supabase.from(table).select('*').eq('org_id', orgId).order('created_at', { ascending: false })
    if (error) setError(error.message); else { setError(''); setRows((data ?? []) as T[]) }
    setLoading(false)
  }, [orgId, table])
  useEffect(() => { load() }, [load])

  const audit = (action: string, detail: string) =>
    supabase.from('audit_logs').insert({ org_id: orgId, user_id: user?.id, action, detail })

  const add = async (row: Record<string, any>) => {
    const { error } = await supabase.from(table).insert({ ...row, org_id: orgId })
    if (error) return error.message
    await audit(`${table}.create`, JSON.stringify(row).slice(0, 200)); await load(); return ''
  }
  const update = async (id: string, patch: Record<string, any>) => {
    const { error } = await supabase.from(table).update(patch).eq('id', id).eq('org_id', orgId!)
    if (error) return error.message
    await audit(`${table}.update`, id); await load(); return ''
  }
  const remove = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id).eq('org_id', orgId!)
    if (error) return error.message
    await audit(`${table}.delete`, id); await load(); return ''
  }
  const loadDemo = async () => {
    if (!seed) return ''
    const { error } = await supabase.from(table).insert(seed().map((r) => ({ ...r, org_id: orgId, is_demo: true })))
    if (error) return error.message
    await load(); return ''
  }
  return { rows, loading, error, add, update, remove, loadDemo, reload: load }
}
