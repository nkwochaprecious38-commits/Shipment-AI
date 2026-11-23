import { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { isConfigured } from '../lib/supabase'

export function AuthShell({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-navy p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link to="/"><Logo light /></Link>
        <div><h2 className="max-w-md text-4xl font-extrabold leading-tight">Know Where Every Shipment Stands.</h2>
          <p className="mt-4 max-w-md text-white/70">Track shipments, anticipate delays, coordinate carriers and keep customers informed from dispatch to delivery.</p></div>
        <div className="text-sm text-white/50">© 2026 Shipment AI</div>
      </div>
      <div className="flex items-center justify-center bg-white px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-block lg:hidden"><Logo /></Link>
          <h1 className="text-3xl font-extrabold">{title}</h1><p className="mt-2 text-muted">{sub}</p>
          {!isConfigured && (
            <div role="alert" className="mt-6 rounded-lg border border-orange/40 bg-orange/10 p-4 text-sm">
              <strong>Authentication is not configured.</strong> Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to a <code>.env</code> file and restart. See the README for setup steps.
            </div>)}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function Field({ id, label, type = 'text', value, onChange, error, autoComplete, hint }: { id: string; label: string; type?: string; value: string; onChange: (v: string) => void; error?: string; autoComplete?: string; hint?: string }) {
  const [show, setShow] = useState(false)
  const isPw = type === 'password'
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <div className="relative">
        <input id={id} name={id} type={isPw && show ? 'text' : type} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete}
          aria-invalid={!!error} aria-describedby={error ? id + '-err' : undefined} className={`input ${error ? '!border-alert' : ''} ${isPw ? 'pr-16' : ''}`} />
        {isPw && <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-ocean" aria-label={show ? 'Hide password' : 'Show password'}>{show ? 'Hide' : 'Show'}</button>}
      </div>
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p id={id + '-err'} className="mt-1 text-xs font-semibold text-alert">{error}</p>}
    </div>
  )
}

export const Alert = ({ kind, children }: { kind: 'error' | 'success'; children: ReactNode }) => (
  <div role={kind === 'error' ? 'alert' : 'status'} className={`rounded-lg border p-3 text-sm ${kind === 'error' ? 'border-alert/30 bg-alert/5 text-alert' : 'border-teal/30 bg-teal/10 text-[#0f7d78]'}`}>{children}</div>
)

export const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)
export const pwProblems = (p: string) => {
  const m: string[] = []
  if (p.length < 8) m.push('at least 8 characters')
  if (!/[a-z]/.test(p) || !/[A-Z]/.test(p)) m.push('upper and lower case letters')
  if (!/\d/.test(p)) m.push('a number')
  return m
}
