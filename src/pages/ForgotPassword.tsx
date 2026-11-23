import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isConfigured } from '../lib/supabase'
import { Alert, AuthShell, Field, validEmail } from './AuthShell'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState<{ k: 'error' | 'success'; t: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const submit = async (ev: FormEvent) => {
    ev.preventDefault(); setMsg(null)
    if (!validEmail(email.trim())) { setErr('Enter a valid email address.'); return }
    setErr('')
    if (!isConfigured) { setMsg({ k: 'error', t: 'Authentication is not configured yet.' }); return }
    setBusy(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: window.location.origin + '/reset-password' })
    setBusy(false)
    setMsg(error ? { k: 'error', t: error.message } : { k: 'success', t: 'If an account exists for that email, a reset link is on its way.' })
  }
  return (
    <AuthShell title="Reset your password" sub="Enter your email and we will send you a reset link.">
      <form onSubmit={submit} noValidate className="space-y-4">
        {msg && <Alert kind={msg.k}>{msg.t}</Alert>}
        <Field id="email" label="Work email" type="email" value={email} onChange={setEmail} error={err} autoComplete="email" />
        <button className="btn-primary w-full py-3" disabled={busy}>{busy ? 'Sending...' : 'Send Reset Link'}</button>
        <p className="text-center text-sm"><Link to="/login" className="font-semibold text-ocean">Back to Log In</Link></p>
      </form>
    </AuthShell>)
}
