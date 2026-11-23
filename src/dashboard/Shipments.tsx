import { useRef, useState } from 'react'
import Resource, { Col, FieldDef } from './Resource'
import { Badge } from '../components/ui'
import { CITIES, demoShipments, MODES, STATUSES } from '../lib/demo'
import { fmt, Shipment } from '../lib/util'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

export const shipmentFields: FieldDef[] = [
  { key: 'reference', label: 'Shipment reference', required: true }, { key: 'order_number', label: 'Order number' },
  { key: 'customer', label: 'Customer' }, { key: 'carrier', label: 'Carrier' },
  { key: 'mode', label: 'Transportation mode', type: 'select', options: [...MODES] },
  { key: 'origin', label: 'Origin', required: true }, { key: 'destination', label: 'Destination', required: true },
  { key: 'status', label: 'Status', type: 'select', options: [...STATUSES] },
  { key: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'] },
  { key: 'eta', label: 'Estimated arrival', type: 'datetime' },
  { key: 'current_lat', label: 'Current latitude (optional)', type: 'number' }, { key: 'current_lng', label: 'Current longitude (optional)', type: 'number' },
]

export const prepareShipment = async (v: Record<string, any>) => {
  const o = CITIES[v.origin], d = CITIES[v.destination], out: Record<string, any> = { ...v, last_update: new Date().toISOString() }
  if (o) { out.origin_lat = o[0]; out.origin_lng = o[1] }
  if (d) { out.dest_lat = d[0]; out.dest_lng = d[1] }
  if (out.current_lat == null && o && d) {
    const p = v.status === 'Delivered' ? 1 : v.status === 'Pending pickup' ? 0 : 0.5
    out.current_lat = +(o[0] + (d[0] - o[0]) * p).toFixed(3); out.current_lng = +(o[1] + (d[1] - o[1]) * p).toFixed(3)
  }
  if (!out.original_eta) out.original_eta = out.eta
  return out
}

function parseCsv(text: string) {
  const rows: string[][] = []; let cur = '', row: string[] = [], q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) { if (c === '"' && text[i + 1] === '"') { cur += '"'; i++ } else if (c === '"') q = false; else cur += c }
    else if (c === '"') q = true
    else if (c === ',') { row.push(cur); cur = '' }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cur); cur = ''; if (row.some((x) => x.trim())) rows.push(row); row = [] }
    else cur += c
  }
  row.push(cur); if (row.some((x) => x.trim())) rows.push(row)
  return rows
}

function CsvImport({ reload }: { reload: () => void }) {
  const { orgId } = useAuth(); const ref = useRef<HTMLInputElement>(null); const [msg, setMsg] = useState('')
  const onFile = async (f?: File) => {
    if (!f) return
    const rows = parseCsv(await f.text()); const head = rows[0]?.map((h) => h.trim().toLowerCase())
    if (!head || !head.includes('reference') || !head.includes('origin') || !head.includes('destination')) { setMsg('CSV needs at least the columns: reference, origin, destination.'); return }
    const recs = await Promise.all(rows.slice(1).map((r) => { const o: any = {}; head.forEach((h, i) => (o[h] = r[i]?.trim() || null)); return prepareShipment({ mode: 'Road', status: 'Pending pickup', priority: 'Medium', ...Object.fromEntries(Object.entries(o).filter(([, v]) => v != null)) }) }))
    const clean = recs.map((r: any) => ({ ...r, eta: r.eta ? new Date(r.eta).toISOString() : null, original_eta: r.eta ? new Date(r.eta).toISOString() : null, org_id: orgId }))
    const { error } = await supabase.from('shipments').insert(clean)
    setMsg(error ? error.message : `Imported ${clean.length} shipments.`); if (!error) reload()
  }
  return (<>
    <input ref={ref} type="file" accept=".csv" className="hidden" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = '' }} />
    <button className="btn-secondary" onClick={() => ref.current?.click()}>Import CSV</button>
    {msg && <span role="status" className="self-center text-xs text-muted">{msg}</span>}
  </>)
}

export const shipmentCols: Col<Shipment>[] = [
  { key: 'reference', label: 'Reference', render: (r) => <span className="font-semibold">{r.reference}</span> },
  { key: 'order_number', label: 'Order' }, { key: 'customer', label: 'Customer' }, { key: 'carrier', label: 'Carrier' }, { key: 'mode', label: 'Mode' },
  { key: 'origin', label: 'Origin' }, { key: 'destination', label: 'Destination' },
  { key: 'status', label: 'Status', render: (r) => <Badge s={r.status} /> },
  { key: 'eta', label: 'ETA', render: (r) => fmt(r.eta) },
  { key: 'priority', label: 'Priority', render: (r) => <Badge s={r.priority} /> },
  { key: 'last_update', label: 'Last update', render: (r) => fmt(r.last_update) },
]

export default function Shipments() {
  return <Resource<Shipment> table="shipments" title="Shipments" sub="Create, search and manage every shipment record." noun="Shipment" cols={shipmentCols} fields={shipmentFields}
    seed={demoShipments} searchKeys={['reference', 'order_number', 'customer', 'carrier', 'origin', 'destination']} prepare={prepareShipment} filter={{ key: 'status', options: [...STATUSES] }}
    toolbar={(a) => <CsvImport reload={a.reload} />}
    extraActions={(r) => <button className="px-2 text-xs font-bold text-teal" onClick={() => { navigator.clipboard?.writeText(`${location.origin}/track/${r.tracking_token}`); alert('Customer tracking link copied.') }}>Copy link</button>} />
}
