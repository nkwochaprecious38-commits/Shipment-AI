import { useState } from 'react'
import TrackMap from '../components/TrackMap'
import { Badge, Demo } from '../components/ui'
import { useTable } from '../lib/useTable'
import { demoShipments } from '../lib/demo'
import { fmt, Shipment } from '../lib/util'
import { PageTitle } from './Resource'

export default function Tracking() {
  const t = useTable<Shipment>('shipments', demoShipments)
  const [sel, setSel] = useState<string | null>(null)
  const cur = t.rows.find((r) => r.id === sel)
  const steps = ['Order created', 'Picked up', 'In transit', 'Out for delivery', 'Delivered']
  const idx = !cur ? 0 : cur.status === 'Delivered' ? 4 : cur.status === 'Pending pickup' ? 0 : 2
  return (
    <div>
      <PageTitle title="Live Tracking" sub="Positions reflect the data stored for each shipment. Live updates require a connected tracking source.">
        {t.rows.length === 0 && !t.loading && <button className="btn-secondary" onClick={t.loadDemo}>Load demonstration data</button>}
      </PageTitle>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2"><TrackMap shipments={t.rows} selected={sel} onSelect={setSel} height={520} /></div>
        <div className="space-y-4">
          {cur ? (
            <div className="card p-5">
              <div className="flex items-start justify-between"><div><div className="font-display text-lg font-extrabold">{cur.reference}</div><div className="text-sm text-muted">{cur.carrier} · {cur.mode}</div></div><Badge s={cur.status} /></div>
              <div className="mt-3 text-sm">{cur.origin} to {cur.destination}</div>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs"><div><dt className="text-muted">Estimated arrival</dt><dd className="font-semibold">{fmt(cur.eta)}</dd></div><div><dt className="text-muted">Original ETA</dt><dd className="font-semibold">{fmt(cur.original_eta)}</dd></div><div><dt className="text-muted">Last update</dt><dd className="font-semibold">{fmt(cur.last_update)}</dd></div><div><dt className="text-muted">Customer</dt><dd className="font-semibold">{cur.customer}</dd></div></dl>
              <ol className="mt-4 space-y-2 border-l-2 border-line pl-4">{steps.map((s, i) => <li key={s} className="relative text-sm"><span className={`absolute -left-[22px] top-1.5 h-2.5 w-2.5 rounded-full ${i <= idx ? 'bg-teal' : 'bg-line'}`} /><span className={i <= idx ? 'font-semibold' : 'text-muted'}>{s}</span></li>)}</ol>
            </div>) : <div className="card p-5 text-sm text-muted">Select a shipment on the map or in the list to see its tracking details.</div>}
          <div className="card max-h-80 divide-y divide-line overflow-auto">
            <div className="flex items-center justify-between p-3 text-xs font-semibold text-muted"><span>{t.rows.length} shipments</span>{t.rows.some((r) => r.is_demo) && <Demo />}</div>
            {t.rows.map((r) => <button key={r.id} onClick={() => setSel(r.id)} className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm ${r.id === sel ? 'bg-soft' : 'hover:bg-cool'}`}><span className="font-semibold">{r.reference}</span><Badge s={r.status} /></button>)}
          </div>
        </div>
      </div>
    </div>)
}
