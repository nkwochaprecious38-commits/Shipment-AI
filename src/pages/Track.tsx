import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, isConfigured } from '../lib/supabase'
import { Badge } from '../components/ui'
import { Logo } from '../components/Logo'
import { fmt } from '../lib/util'

export default function Track() {
  const { token } = useParams()
  const [s, setS] = useState<any>(null); const [state, setState] = useState<'load' | 'ok' | 'none'>('load')
  useEffect(() => {
    if (!isConfigured) { setState('none'); return }
    supabase.rpc('get_tracking', { p_token: token }).then(({ data }) => { if (data) { setS(data); setState('ok') } else setState('none') })
  }, [token])
  const steps = ['Order created', 'Picked up', 'In transit', 'Out for delivery', 'Delivered']
  const idx = !s ? 0 : s.status === 'Delivered' ? 4 : s.status === 'Pending pickup' ? 0 : 2
  return (
    <div className="min-h-screen bg-cool px-4 py-8">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 flex justify-center"><Link to="/"><Logo /></Link></div>
        {state === 'load' && <p className="text-center text-muted">Loading tracking details...</p>}
        {state === 'none' && <div className="card p-8 text-center"><h1 className="text-xl font-extrabold">Tracking link not found</h1><p className="mt-2 text-muted">Check the link you were given or contact the sender.</p></div>}
        {state === 'ok' && s && (
          <div className="card p-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">{s.org_name}</div>
            <div className="mt-1 flex items-start justify-between gap-3"><h1 className="text-2xl font-extrabold">{s.reference}</h1><Badge s={s.status} /></div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><div className="text-xs text-muted">Origin</div><b>{s.origin}</b></div><div><div className="text-xs text-muted">Destination</div><b>{s.destination}</b></div>
              <div><div className="text-xs text-muted">Estimated arrival</div><b>{fmt(s.eta)}</b></div><div><div className="text-xs text-muted">Carrier</div><b>{s.carrier ?? 'Not assigned'}</b></div></div>
            {(s.status === 'Delayed' || s.status === 'Exception') && <div className="mt-4 rounded-lg bg-orange/10 p-3 text-sm">This shipment is experiencing a {s.status === 'Delayed' ? 'delay' : 'delivery exception'}. The estimated arrival may change.</div>}
            <ol className="mt-6 space-y-4 border-l-2 border-line pl-5">{steps.map((x, i) => <li key={x} className="relative"><span className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${i <= idx ? 'bg-teal' : 'bg-line'}`} /><span className={i <= idx ? 'font-semibold' : 'text-muted'}>{x}</span></li>)}</ol>
            {s.events?.length > 0 && <div className="mt-6"><h2 className="text-sm font-bold">Tracking timeline</h2><ul className="mt-2 space-y-2 text-sm">{s.events.map((e: any, i: number) => <li key={i} className="flex justify-between gap-3"><span>{e.description}</span><span className="whitespace-nowrap text-xs text-muted">{fmt(e.event_time)}</span></li>)}</ul></div>}
            <p className="mt-6 text-xs text-muted">Last updated {fmt(s.last_update)}</p>
          </div>)}
      </div>
    </div>)
}
