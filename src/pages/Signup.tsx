import { FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { supabase, isConfigured } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { Alert, AuthShell, Field, pwProblems, validEmail } from './AuthShell'

export default function Signup() {
  const { user, loading } = useAuth()
  const nav = useNavigate()
  const [f, setF] = useState({ name: '', company: '', email: '', password: '', confirm: '' })
  const [errs, setErrs] = useState<Record<string, string>>({})
  const [msg, setMsg] = useState<{ k: 'error' | 'success'; t: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const set = (k: string) => (v: string) => setF((p) => ({ ...p, [k]: v }))
  if (!loading && user) return <Navigate to="/app" replace />

  const validate = () => {
    const e: Record<string, string> = {}
    if (f.name.trim().length < 2) e.name = 'Enter your full name.'
    if (f.company.trim().length < 2) e.company = 'Enter your company name.'
    if (!validEmail(f.email.trim())) e.email = 'Enter a valid work email address.'
    const pw = pwProblems(f.password)
    if (pw.length) e.password = 'Password needs ' + pw.join(', ') + '.'
    if (f.confirm !== f.password) e.confirm = 'Passwords do not match.'
    setErrs(e); return Object.keys(e).length === 0
  }

  const submit = async (ev: FormEvent) => {
    ev.preventDefault(); setMsg(null)
    if (!validate()) return
    if (!isConfigured) { setMsg({ k: 'error', t: 'Authentication is not configured yet. See the setup notice above.' }); return }
    setBusy(true)
    const { data, error } = await supabase.auth.signUp({
      email: f.email.trim().toLowerCase(), password: f.password,
      options: { data: { full_name: f.name.trim(), company: f.company.trim() }, emailRedirectTo: window.location.origin + '/login' },
    })
    setBusy(false)
    if (error) {
      const m = error.message.toLowerCase()
      setMsg({ k: 'error', t: m.includes('already') ? 'An account with this email already exists. Try logging in instead.' : m.includes('rate') ? 'Too many attempts. Please wait a moment and try again.' : error.message })
      return
    }
    if (data.user && data.user.identities && data.user.identities.length === 0) { setMsg({ k: 'error', t: 'An account with this email already exists. Try logging in instead.' }); return }
    if (data.session) { nav('/app', { replace: true }); return }
    setSent(true)
  }

  if (sent) return (
    <AuthShell title="Check your email" sub={`We sent a confirmation link to ${f.email}.`}>
      <Alert kind="success">Open the link in that email to activate your account, then log in.</Alert>
      <Link to="/login" className="btn-primary mt-6 w-full">Go to Log In</Link>
    </AuthShell>)

  return (
    <AuthShell title="Create your account" sub="Start tracking shipments with Shipment AI.">
      <form onSubmit={submit} noValidate className="space-y-4">
        {msg && <Alert kind={msg.k}>{msg.t}</Alert>}
        <Field id="name" label="Full name" value={f.name} onChange={set('name')} error={errs.name} autoComplete="name" />
        <Field id="company" label="Company name" value={f.company} onChange={set('company')} error={errs.company} autoComplete="organization" />
        <Field id="email" label="Work email" type="email" value={f.email} onChange={set('email')} error={errs.email} autoComplete="email" />
        <Field id="password" label="Password" type="password" value={f.password} onChange={set('password')} error={errs.password} autoComplete="new-password" hint="At least 8 characters with upper and lower case letters and a number." />
        <Field id="confirm" label="Confirm password" type="password" value={f.confirm} onChange={set('confirm')} error={errs.confirm} autoComplete="new-password" />
        <button className="btn-primary w-full py-3" disabled={busy}>{busy ? 'Creating account...' : 'Create Account'}</button>
        <p className="text-center text-sm text-muted">Already have an account? <Link to="/login" className="font-semibold text-ocean">Log In</Link></p>
      </form>
    </AuthShell>)
}
