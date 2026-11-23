import { FormEvent, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase, isConfigured } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { Alert, AuthShell, Field, validEmail } from './AuthShell'

export default function Login() {
  const { user, loading } = useAuth()
  const nav = useNavigate()
  const loc = useLocation() as any
  const dest = loc.state?.from || '/app'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errs, setErrs] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState<{ k: 'error' | 'success'; t: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [unconfirmed, setUnconfirmed] = useState(false)
  if (!loading && user) return <Navigate to={dest} replace />

  const submit = async (ev: FormEvent) => {
    ev.preventDefault(); setMsg(null); setUnconfirmed(false)
    const e: Record<string, string> = {}
    if (!validEmail(email.trim())) e.email = 'Enter a valid email address.'
    if (!password) e.password = 'Enter your password.'
    setErrs(e); if (Object.keys(e).length) return
    if (!isConfigured) { setMsg({ k: 'error', t: 'Authentication is not configured yet. See the setup notice above.' }); return }
    setBusy(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    setBusy(false)
    if (error) {
      const m = error.message.toLowerCase()
      if (m.includes('not confirmed')) { setUnconfirmed(true); setMsg({ k: 'error', t: 'Please confirm your email address before logging in.' }) }
      else if (m.includes('invalid')) setMsg({ k: 'error', t: 'Incorrect email or password.' })
      else setMsg({ k: 'error', t: error.message })
      return
    }
    nav(dest, { replace: true })
  }
  const resend = async () => {
    const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim().toLowerCase() })
    setMsg(error ? { k: 'error', t: error.message } : { k: 'success', t: 'Confirmation email sent. Check your inbox.' })
  }

  return (
    <AuthShell title="Welcome back" sub="Log in to your Shipment AI workspace.">
      <form onSubmit={submit} noValidate className="space-y-4">
        {msg && <Alert kind={msg.k}>{msg.t}</Alert>}
        {unconfirmed && <button type="button" onClick={resend} className="text-sm font-semibold text-ocean">Resend confirmation email</button>}
        <Field id="email" label="Work email" type="email" value={email} onChange={setEmail} error={errs.email} autoComplete="email" />
        <Field id="password" label="Password" type="password" value={password} onChange={setPassword} error={errs.password} autoComplete="current-password" />
        <div className="text-right"><Link to="/forgot-password" className="text-sm font-semibold text-ocean">Forgot password?</Link></div>
        <button className="btn-primary w-full py-3" disabled={busy}>{busy ? 'Logging in...' : 'Log In'}</button>
        <p className="text-center text-sm text-muted">New to Shipment AI? <Link to="/signup" className="font-semibold text-ocean">Create an account</Link></p>
      </form>
    </AuthShell>)
}
