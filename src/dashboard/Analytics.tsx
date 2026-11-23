import { useMemo, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Demo } from '../components/ui'
import { useTable } from '../lib/useTable'
import { demoShipments, dwell, regionPerf, volumeSeries } from '../lib/demo'
import { Shipment } from '../lib/util'
import { PageTitle } from './Resource'
import { COLORS } from './Overview'

export default function Analytics() {
  const t = useTable<Shipment>('shipments', demoShipments)
  const [f, setF] = useState({ range: 'all', carrier: 'All', mode: 'All', customer: 'All', loc: 'All' })
  const uniq = (k: keyof Shipment) => ['All', ...Array.from(new Set(t.rows.map((r) => r[k] as string).filter(Boolean)))]
  const rows = useMemo(() => t.rows.filter((r) => (f.carrier === 'All' || r.carrier === f.carrier) && (f.mode === 'All' || r.mode === f.mode) && (f.customer === 'All' || r.customer === f.customer) &&
    (f.loc === 'All' || r.origin === f.loc || r.destination === f.loc) && (f.range === 'all' || Date.now() - new Date(r.last_update ?? 0).getTime() < +f.range * 864e5)), [t.rows, f])
  const late = rows.filter((r) => r.status === 'Delayed' || r.status === 'Exception').length
  const pct = (a: number) => rows.length ? Math.round((a / rows.length) * 100) + '%' : 'No data'
  const mode = Object.entries(rows.reduce((a: any, r) => ((a[r.mode] = (a[r.mode] || 0) + 1), a), {})).map(([name, value]) => ({ name, value: value as number }))
  const carrier = Object.entries(rows.reduce((a: any, r) => { const k = r.carrier || 'Unassigned'; a[k] ||= [0, 0]; a[k][0]++; if (r.status === 'Delayed' || r.status === 'Exception') a[k][1]++; return a }, {})).map(([name, v]: any) => ({ name, onTime: Math.round(((v[0] - v[1]) / v[0]) * 100), shipments: v[0] }))
  const Sel = ({ k, label, opts }: { k: keyof typeof f; label: string; opts: string[] }) => <label className="text-xs font-semibold text-muted">{label}<select className="input mt-1" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}>{opts.map((o) => <option key={o}>{o}</option>)}</select></label>
  return (
    <div>
      <PageTitle title="Analytics" sub="Calculated from your shipment records. Sections marked as demonstration data illustrate trends that need event history or cost data.">
        {t.rows.length === 0 && !t.loading && <button className="btn-secondary" onClick={t.loadDemo}>Load demonstration data</button>}</PageTitle>
      <div className="card mb-6 grid grid-cols-2 gap-3 p-4 md:grid-cols-5">
        <label className="text-xs font-semibold text-muted">Date range<select className="input mt-1" value={f.range} onChange={(e) => setF({ ...f, range: e.target.value })}><option value="all">All time</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label>
        <Sel k="carrier" label="Carrier" opts={uniq('carrier')} /><Sel k="mode" label="Transportation mode" opts={uniq('mode')} /><Sel k="customer" label="Customer" opts={uniq('customer')} />
        <label className="text-xs font-semibold text-muted">Location<select className="input mt-1" value={f.loc} onChange={(e) => setF({ ...f, loc: e.target.value })}>{['All', ...Array.from(new Set(t.rows.flatMap((r) => [r.origin, r.destination])))].map((o) => <option key={o}>{o}</option>)}</select></label>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[['Total shipment volume', rows.length], ['On time delivery rate', pct(rows.length - late)], ['Delayed shipment percentage', pct(late)], ['Average transit time', 'Needs event data']].map(([l, v]) => <div key={l as string} className="card p-5"><div className="text-xs font-semibold text-muted">{l}</div><div className={`mt-1 font-display font-extrabold ${String(v).length > 7 ? 'pt-2 text-base' : 'text-3xl'}`}>{v}</div></div>)}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-5"><h2 className="font-display font-bold">Carrier on time rate</h2><div className="mt-3 h-64">{carrier.length ? <ResponsiveContainer><BarChart data={carrier}><CartesianGrid vertical={false} stroke="#E2E8F0" /><XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} /><YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} /><Tooltip /><Bar dataKey="onTime" fill="#18A6A0" radius={[6, 6, 0, 0]} name="On time %" /></BarChart></ResponsiveContainer> : <p className="text-sm text-muted">No data for these filters.</p>}</div></div>
        <div className="card p-5"><h2 className="font-display font-bold">Transportation mode distribution</h2><div className="mt-3 h-64">{mode.length ? <ResponsiveContainer><PieChart><Pie data={mode} dataKey="value" nameKey="name" outerRadius={90} label>{mode.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer> : <p className="text-sm text-muted">No data for these filters.</p>}</div></div>
        <div className="card p-5"><div className="flex justify-between"><h2 className="font-display font-bold">Volume and exception trend</h2><Demo /></div><div className="mt-3 h-64"><ResponsiveContainer><AreaChart data={volumeSeries}><CartesianGrid vertical={false} stroke="#E2E8F0" /><XAxis dataKey="m" tickLine={false} axisLine={false} fontSize={12} /><YAxis tickLine={false} axisLine={false} fontSize={12} /><Tooltip /><Area dataKey="volume" stroke="#2676C9" fill="#2676C9" fillOpacity={0.15} name="Shipments" /><Area dataKey="delayed" stroke="#E69A45" fill="#E69A45" fillOpacity={0.2} name="Delayed" /></AreaChart></ResponsiveContainer></div></div>
        <div className="card p-5"><div className="flex justify-between"><h2 className="font-display font-bold">Facility dwell time (hours)</h2><Demo /></div><div className="mt-3 h-64"><ResponsiveContainer><BarChart data={dwell} layout="vertical"><XAxis type="number" tickLine={false} axisLine={false} fontSize={12} /><YAxis type="category" dataKey="f" width={120} tickLine={false} axisLine={false} fontSize={12} /><Tooltip /><Bar dataKey="h" fill="#142B45" radius={[0, 6, 6, 0]} name="Hours" /></BarChart></ResponsiveContainer></div></div>
        <div className="card p-5"><div className="flex justify-between"><h2 className="font-display font-bold">Delivery performance by region (%)</h2><Demo /></div><div className="mt-3 h-56"><ResponsiveContainer><BarChart data={regionPerf}><XAxis dataKey="r" tickLine={false} axisLine={false} fontSize={12} /><YAxis domain={[60, 100]} tickLine={false} axisLine={false} fontSize={12} /><Tooltip /><Bar dataKey="v" fill="#2676C9" radius={[6, 6, 0, 0]} name="On time %" /></BarChart></ResponsiveContainer></div></div>
        <div className="card p-5"><h2 className="font-display font-bold">Shipment cost analysis</h2><p className="mt-3 text-sm text-muted">Cost analysis appears when shipment cost data is imported or connected through an integration. No cost data is available for this workspace yet.</p></div>
      </div>
    </div>)
}
