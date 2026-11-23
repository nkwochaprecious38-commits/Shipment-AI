import { useMemo, useState } from 'react'
import TrackMap from './TrackMap'
import { Badge, Demo, Icon, ICONS } from './ui'
import { demoShipments } from '../lib/demo'
import { fmt, Shipment } from '../lib/util'
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { carrierPerf, volumeSeries } from '../lib/demo'

export const useDemoShipments = (): Shipment[] => useMemo(() => demoShipments().map((s, i) => ({ ...s, id: 'd' + i, is_demo: true }) as Shipment), [])

export function DashboardMock({ compact = false }: { compact?: boolean }) {
  const ships = useDemoShipments()
  const [sel, setSel] = useState<string>(ships[0].id)
  const cur = ships.find((s) => s.id === sel)!
  const stat = (l: string, v: string, c: string) => (
    <div className="rounded-lg border border-line bg-white p-3"><div className="text-[11px] font-semibold text-muted">{l}</div><div className={`font-display text-xl font-extrabold ${c}`}>{v}</div></div>
  )
  return (
    <div className="card overflow-hidden text-left shadow-lift">
      <div className="flex items-center justify-between border-b border-line bg-cool px-4 py-2.5">
        <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-alert/60" /><span className="h-2.5 w-2.5 rounded-full bg-orange" /><span className="h-2.5 w-2.5 rounded-full bg-teal" /></div>
        <Demo />
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-4">
        {stat('Active shipments', '8', 'text-navy')}{stat('In transit', '5', 'text-ocean')}{stat('Delayed', '2', 'text-[#a8651b]')}{stat('Open exceptions', '5', 'text-alert')}
      </div>
      <div className="grid gap-4 px-4 pb-4 lg:grid-cols-5">
        <div className="lg:col-span-3"><TrackMap shipments={ships} selected={sel} onSelect={setSel} height={compact ? 300 : 340} /></div>
        <div className="space-y-3 lg:col-span-2">
          <div className="rounded-xl border border-line p-4">
            <div className="flex items-start justify-between"><div><div className="font-display font-bold">{cur.reference}</div><div className="text-xs text-muted">{cur.carrier} · {cur.mode}</div></div><Badge s={cur.status} /></div>
            <div className="mt-3 text-sm">{cur.origin} to {cur.destination}</div>
            <div className="mt-1 text-xs text-muted">ETA {fmt(cur.eta)} · Updated {fmt(cur.last_update)}</div>
          </div>
          <div className="max-h-44 divide-y divide-line overflow-auto rounded-xl border border-line">
            {ships.map((s) => (
              <button key={s.id} onClick={() => setSel(s.id)} className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${s.id === sel ? 'bg-soft' : 'hover:bg-cool'}`}>
                <span className="font-semibold">{s.reference}</span><Badge s={s.status} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function EtaCard() {
  const rows = [['Original ETA', '18 November, 10:00 AM', 'bg-slate-300'], ['Carrier update received', 'Departure delayed at origin', 'bg-orange'], ['Updated ETA', '18 November, 2:30 PM', 'bg-ocean']]
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between"><div className="font-display text-lg font-extrabold">SHP 10025</div><Badge s="Delayed" /></div>
      <ol className="mt-5 space-y-5 border-l-2 border-line pl-5">
        {rows.map(([a, b, c]) => <li key={a} className="relative"><span className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-white ${c}`} /><div className="text-xs font-semibold uppercase tracking-wide text-muted">{a}</div><div className="font-semibold">{b}</div></li>)}
      </ol>
      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-orange/10 p-3"><div className="text-xs font-semibold text-muted">Estimated delay</div><div className="font-display font-bold text-[#a8651b]">4 hours 30 minutes</div></div>
        <div className="rounded-lg bg-soft p-3"><div className="text-xs font-semibold text-muted">ETA source</div><div className="font-display font-bold text-ocean">Calculated estimate</div></div>
      </div>
      <div className="mt-4 rounded-lg border border-line p-3 text-sm"><span className="font-semibold">Recommended action:</span> Notify the receiving facility and update the customer.</div>
      <div className="mt-3"><Demo /></div>
    </div>
  )
}

export function AnalyticsMock() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card p-5"><div className="mb-3 flex items-center justify-between"><h3 className="font-display font-bold">Shipment volume</h3><Demo /></div>
        <div className="h-52"><ResponsiveContainer><AreaChart data={volumeSeries}><XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={12} /><YAxis hide /><Tooltip />
          <Area dataKey="volume" stroke="#2676C9" fill="#2676C9" fillOpacity={0.15} strokeWidth={2} name="Shipments" /></AreaChart></ResponsiveContainer></div></div>
      <div className="card p-5"><div className="mb-3 flex items-center justify-between"><h3 className="font-display font-bold">Carrier on time rate</h3><Demo /></div>
        <div className="h-52"><ResponsiveContainer><BarChart data={carrierPerf}><XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} /><YAxis hide domain={[70, 100]} /><Tooltip />
          <Bar dataKey="onTime" fill="#18A6A0" radius={[6, 6, 0, 0]} name="On time %" /></BarChart></ResponsiveContainer></div></div>
    </div>
  )
}

export function TrackingPreview() {
  const steps = [['Order created', true], ['Picked up', true], ['In transit', true], ['Out for delivery', false], ['Delivered', false]] as const
  return (
    <div className="mx-auto w-full max-w-xs rounded-[28px] border-8 border-navy bg-white p-4 shadow-lift">
      <div className="text-xs font-semibold text-muted">Your shipment</div>
      <div className="font-display text-lg font-extrabold">SHP 10027</div>
      <div className="mt-1"><Badge s="In transit" /></div>
      <div className="mt-4 text-sm">Frankfurt to New York</div>
      <div className="text-xs text-muted">Estimated arrival today, 4:30 PM</div>
      <ol className="mt-4 space-y-3">{steps.map(([t, d]) => <li key={t} className="flex items-center gap-3 text-sm"><span className={`flex h-5 w-5 items-center justify-center rounded-full ${d ? 'bg-teal text-white' : 'border border-line'}`}>{d && <Icon d={ICONS.check} className="h-3 w-3" />}</span><span className={d ? 'font-semibold' : 'text-muted'}>{t}</span></li>)}</ol>
      <div className="mt-4"><Demo /></div>
    </div>
  )
}
