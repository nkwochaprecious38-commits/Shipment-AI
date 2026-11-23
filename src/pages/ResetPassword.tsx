import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { Alert, AuthShell, Field, pwProblems } from './AuthShell'

export default function ResetPassword() {
  const { session, loading } = useAuth()
  const nav = useNavigate()
  const [pw, setPw] = useState('')
  const [cf, setCf] = useState('')
  const [errs, setErrs] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState<{ k: 'error' | 'success'; t: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [waited, setWaited] = useState(false)
  useEffect(() => { const t = setTimeout(() => setWaited(true), 2500); return () => clearTimeout(t) }, [])

  const submit = async (ev: FormEvent) => {
    ev.preventDefault(); setMsg(null)
    const e: Record<string, string> = {}
    const p = pwProblems(pw); if (p.length) e.pw = 'Password needs ' + p.join(', ') + '.'
    if (cf !== pw) e.cf = 'Passwords do not match.'
    setErrs(e); if (Object.keys(e).length) return
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password: pw })
    setBusy(false)
    if (error) { setMsg({ k: 'error', t: error.message }); return }
    setMsg({ k: 'success', t: 'Password updated. Redirecting to your dashboard...' })
    setTimeout(() => nav('/app', { replace: true }), 1200)
  }

  if (!session && (loading || !waited)) return <AuthShell title="Verifying link" sub="One moment while we verify your reset link."><div /></AuthShell>
  if (!session) return (
    <AuthShell title="Link expired" sub="This reset link is invalid or has expired."><Link to="/forgot-password" className="btn-primary w-full">Request a New Link</Link></AuthShell>)
  return (
    <AuthShell title="Choose a new password" sub="Enter a new password for your account.">
      <form onSubmit={submit} noValidate className="space-y-4">
        {msg && <Alert kind={msg.k}>{msg.t}</Alert>}
        <Field id="pw" label="New password" type="password" value={pw} onChange={setPw} error={errs.pw} autoComplete="new-password" hint="At least 8 characters with upper and lower case letters and a number." />
        <Field id="cf" label="Confirm new password" type="password" value={cf} onChange={setCf} error={errs.cf} autoComplete="new-password" />
        <button className="btn-primary w-full py-3" disabled={busy}>{busy ? 'Saving...' : 'Update Password'}</button>
      </form>
    </AuthShell>)
}
