import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isConfigured } from './supabase'

interface Ctx { session: Session | null; user: User | null; loading: boolean; orgId: string | null; orgName: string | null; fullName: string; signOut: () => Promise<void> }
const AuthCtx = createContext<Ctx>({} as Ctx)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [orgName, setOrgName] = useState<string | null>(null)

  useEffect(() => {
    if (!isConfigured) { setLoading(false); return }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) { setOrgId(null); setOrgName(null); return }
    supabase.from('memberships').select('org_id, organizations(name)').eq('user_id', session.user.id).limit(1).maybeSingle()
      .then(({ data }) => {
        if (data) { setOrgId(data.org_id); setOrgName((data as any).organizations?.name ?? null) }
      })
  }, [session])

  const user = session?.user ?? null
  const fullName = (user?.user_metadata?.full_name as string) || user?.email || ''
  const signOut = async () => { await supabase.auth.signOut() }
  return <AuthCtx.Provider value={{ session, user, loading, orgId, orgName, fullName, signOut }}>{children}</AuthCtx.Provider>
}
