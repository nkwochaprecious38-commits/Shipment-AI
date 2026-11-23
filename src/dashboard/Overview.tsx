import { Link } from 'react-router-dom'
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, Demo } from '../components/ui'
import { useTable } from '../lib/useTable'
import { demoShipments } from '../lib/demo'
import { fmt, Shipment } from '../lib/util'
import { useAuth } from '../lib/auth'
import { PageTitle } from './Resource'

export const COLORS = ['#2676C9', '#18A6A0', '#E69A45', '#142B45', '#667085', '#9BB8D9']

export default function Overview() {
  const { fullName, orgName } = useAuth()
  const t = useTable<Shipment>('shipments', demoShipments)
  const r = t.rows
  const n = (f: (s: Shipment) => boolean) => r.filter(f).length
  const delivered = n((s) => s.status === 'Delivered'), delayed = n((s) => s.status === 'Delayed'), exc = n((s) => s.status === 'Exception')
  const done = delivered + delayed + exc
  const otd = r.length ? Math.round(((r.length - delayed - exc) / r.length) * 100) + '%' : 'No data'
  const stats = [['Total shipments', r.length], ['Active shipments', n((s) => s.status !== 'Delivered')], ['In transit', n((s) => s.status === 'In transit')], ['Delivered', delivered], ['Delayed', delayed], ['Active exceptions', exc], ['On time delivery rate', otd], ['Average transit time', 'Needs event data']]
  const carriers = Object.values(r.reduce((a: any, s) => { const k = s.carrier || 'Unassigned'; (a[k] ||= { name: k, shipments: 0, issues: 0 }); a[k].shipments++; if (s.status === 'Delayed' || s.status === 'Exception') a[k].issues++; return a }, {})) as any[]
  const status = ['Pending pickup', 'In transit', 'Delivered', 'Delayed', 'Exception'].map((x) => ({ name: x, value: n((s) => s.status === x) })).filter((x) => x.value)
  const upcoming = [...r].filter((s) => s.status !== 'Delivered' && s.eta).sort((a, b) => +new Date(a.eta!) - +new Date(b.eta!)).slice(0, 5)
  const recent = [...r].sort((a, b) => +new Date(b.last_update ?? 0) - +new Date(a.last_update ?? 0)).slice(0, 5)
  void done
  return (
    <div>
      <PageTitle title={`Welcome${fullName ? ', ' + fullName.split(' ')[0] : ''}`} sub={orgName ? `${orgName} workspace` : 'Your workspace'}>
        {r.length === 0 && !t.loading && <button className="btn-secondary" onClick={t.loadDemo}>Load demonstration data</button>}
        <Link to="/app/shipments" className="btn-primary">Manage shipments</Link>
      </PageTitle>
      {r.some((s) => s.is_demo) && <div className="mb-4"><Demo>Some figures include demonstration data</Demo></div>}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([l, v]) => <div key={l as string} className="card p-5"><div className="text-xs font-semibold text-muted">{l}</div><div className={`mt-1 font-display font-extrabold ${String(v).length > 6 ? 'text-base pt-2' : 'text-3xl'}`}>{v}</div></div>)}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2"><h2 className="font-display font-bold">Carrier performance</h2>
          <div className="mt-3 h-60">{carriers.length ? <ResponsiveContainer><BarChart data={carriers}><XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} /><Tooltip />
            <Bar dataKey="shipments" fill="#2676C9" radius={[6, 6, 0, 0]} name="Shipments" /><Bar dataKey="issues" fill="#E69A45" radius={[6, 6, 0, 0]} name="Delayed or exception" /></BarChart></ResponsiveContainer> : <Empty />}</div></div>
        <div className="card p-5"><h2 className="font-display font-bold">Status mix</h2>
          <div className="mt-3 h-60">{status.length ? <ResponsiveContainer><PieChart><Pie data={status} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>{status.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer> : <Empty />}</div></div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <List title="Recent shipment activity" items={recent.map((s) => [s.reference, `${s.origin} to ${s.destination}`, s.status, 'Updated ' + fmt(s.last_update)])} />
        <List title="Upcoming deliveries" items={upcoming.map((s) => [s.reference, `${s.destination} · ${s.carrier ?? ''}`, s.status, 'ETA ' + fmt(s.eta)])} />
      </div>
    </div>)
}
const Empty = () => <div className="flex h-full items-center justify-center text-sm text-muted">No shipment data yet.</div>
function List({ title, items }: { title: string; items: string[][] }) {
  return <div className="card"><h2 className="border-b border-line p-5 font-display font-bold">{title}</h2>{items.length === 0 ? <p className="p-5 text-sm text-muted">Nothing to show yet.</p> :
    <ul className="divide-y divide-line">{items.map(([a, b, s, c]) => <li key={a} className="flex items-center justify-between gap-3 px-5 py-3 text-sm"><div><div className="font-semibold">{a}</div><div className="text-xs text-muted">{b}</div></div><div className="text-right"><Badge s={s} /><div className="mt-1 text-xs text-muted">{c}</div></div></li>)}</ul>}</div>
}
