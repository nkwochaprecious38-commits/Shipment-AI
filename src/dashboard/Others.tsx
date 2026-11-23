import { Badge } from '../components/ui'
import Resource from './Resource'
import { useTable } from '../lib/useTable'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { demoAppointments, demoCarriers, demoCustomers, demoDocuments, demoExceptions, demoOrders, MODES } from '../lib/demo'
import { fmt, Shipment } from '../lib/util'

export function Exceptions() {
  const btn = 'px-2 text-xs font-bold text-ocean'
  return <Resource<any> table="exceptions" title="Exceptions" sub="Review, assign, investigate and resolve delivery exceptions." noun="Exception" seed={demoExceptions}
    searchKeys={['shipment_reference', 'type', 'assignee']} filter={{ key: 'status', options: ['Open', 'Investigating', 'Resolved'] }}
    cols={[{ key: 'shipment_reference', label: 'Shipment', render: (r) => <b>{r.shipment_reference}</b> }, { key: 'type', label: 'Exception type' }, { key: 'severity', label: 'Severity', render: (r) => <Badge s={r.severity} /> },
      { key: 'detected_at', label: 'Detected', render: (r) => fmt(r.detected_at) }, { key: 'status', label: 'Status', render: (r) => <Badge s={r.status} /> }, { key: 'assignee', label: 'Assigned to' },
      { key: 'recommended_action', label: 'Recommended action', render: (r) => <span className="block max-w-xs whitespace-normal">{r.recommended_action}</span> }]}
    fields={[{ key: 'shipment_reference', label: 'Shipment reference', required: true },
      { key: 'type', label: 'Exception type', type: 'select', options: ['Delayed shipment', 'Missed milestone', 'Unexpected location update', 'Extended dwell time', 'Missed delivery appointment', 'Tracking interruption', 'Route deviation', 'Delivery exception'] },
      { key: 'severity', label: 'Severity', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'] }, { key: 'status', label: 'Status', type: 'select', options: ['Open', 'Investigating', 'Resolved'] },
      { key: 'assignee', label: 'Assigned to' }, { key: 'recommended_action', label: 'Recommended action' }]}
    extraActions={(r, a) => <>
      <button className={btn} onClick={() => { const n = prompt('Assign to (team member name):', r.assignee ?? ''); if (n) a.update(r.id, { assignee: n }) }}>Assign</button>
      {r.status === 'Open' && <button className={btn} onClick={() => a.update(r.id, { status: 'Investigating' })}>Investigate</button>}
      {r.status !== 'Resolved' && <button className="px-2 text-xs font-bold text-teal" onClick={() => a.update(r.id, { status: 'Resolved' })}>Resolve</button>}</>} />
}

export const Orders = () => <Resource<any> table="orders" title="Orders" sub="Connect customer orders with their shipments and delivery records." noun="Order" seed={demoOrders}
  searchKeys={['order_number', 'customer', 'shipment_reference']} filter={{ key: 'status', options: ['Processing', 'Shipped', 'Fulfilled', 'Cancelled'] }}
  cols={[{ key: 'order_number', label: 'Order', render: (r) => <b>{r.order_number}</b> }, { key: 'customer', label: 'Customer' }, { key: 'shipment_reference', label: 'Shipment' },
    { key: 'value', label: 'Value (USD)', render: (r) => r.value != null ? Number(r.value).toLocaleString() : '' }, { key: 'status', label: 'Status', render: (r) => <Badge s={r.status === 'Fulfilled' ? 'Delivered' : r.status === 'Shipped' ? 'In transit' : 'Pending pickup'} /> }]}
  fields={[{ key: 'order_number', label: 'Order number', required: true }, { key: 'customer', label: 'Customer' }, { key: 'shipment_reference', label: 'Shipment reference' }, { key: 'value', label: 'Order value (USD)', type: 'number' },
    { key: 'status', label: 'Status', type: 'select', options: ['Processing', 'Shipped', 'Fulfilled', 'Cancelled'] }]} />

export function Carriers() {
  const s = useTable<Shipment>('shipments')
  const stat = (name: string) => { const m = s.rows.filter((x) => x.carrier === name); const d = m.filter((x) => x.status === 'Delivered').length; const l = m.filter((x) => x.status === 'Delayed' || x.status === 'Exception').length; return { n: m.length, d, l, rate: m.length ? Math.round(((m.length - l) / m.length) * 100) + '%' : 'No data' } }
  return <Resource<any> table="carriers" title="Carriers" sub="Carrier directory with assigned shipments and delivery performance calculated from your shipment records." noun="Carrier" seed={demoCarriers}
    searchKeys={['name', 'mode', 'contact']} cols={[{ key: 'name', label: 'Carrier', render: (r) => <b>{r.name}</b> }, { key: 'mode', label: 'Mode' }, { key: 'contact', label: 'Contact' },
      { key: 'n', label: 'Assigned', render: (r) => stat(r.name).n }, { key: 'd', label: 'Delivered', render: (r) => stat(r.name).d }, { key: 'l', label: 'Delayed', render: (r) => stat(r.name).l },
      { key: 'rate', label: 'On time rate', render: (r) => stat(r.name).rate }, { key: 'tracking_status', label: 'Tracking status', render: (r) => <Badge s={r.tracking_status} /> }]}
    fields={[{ key: 'name', label: 'Carrier name', required: true }, { key: 'mode', label: 'Primary mode', type: 'select', options: [...MODES] }, { key: 'contact', label: 'Contact email', type: 'email' },
      { key: 'tracking_status', label: 'Tracking status', type: 'select', options: ['Connected', 'Partial', 'Not connected'] }]} />
}

export function Customers() {
  const s = useTable<Shipment>('shipments')
  return <Resource<any> table="customers" title="Customers" sub="Customer records, shipment history and tracking portal settings." noun="Customer" seed={demoCustomers}
    searchKeys={['name', 'contact', 'email']} cols={[{ key: 'name', label: 'Customer', render: (r) => <b>{r.name}</b> }, { key: 'contact', label: 'Contact' }, { key: 'email', label: 'Email' },
      { key: 'ship', label: 'Shipments', render: (r) => s.rows.filter((x) => x.customer === r.name).length },
      { key: 'del', label: 'Delivered', render: (r) => s.rows.filter((x) => x.customer === r.name && x.status === 'Delivered').length },
      { key: 'portal_enabled', label: 'Tracking portal', render: (r) => <Badge s={r.portal_enabled ? 'Connected' : 'Not connected'} /> }]}
    fields={[{ key: 'name', label: 'Customer name', required: true }, { key: 'contact', label: 'Contact person' }, { key: 'email', label: 'Email', type: 'email' }, { key: 'portal_enabled', label: 'Enable customer tracking portal', type: 'checkbox', default: true }]} />
}

export function Documents() {
  const { orgId } = useAuth()
  const prepare = async (v: Record<string, any>) => {
    const { file, ...rest } = v
    if (file instanceof File) {
      const path = `${orgId}/${crypto.randomUUID()}-${file.name.replace(/[^\w.]/g, '_')}`
      const { error } = await supabase.storage.from('documents').upload(path, file)
      if (error) throw new Error(error.message)
      rest.file_path = path; if (!rest.name) rest.name = file.name
    }
    return rest
  }
  const open = async (path: string) => { const { data, error } = await supabase.storage.from('documents').createSignedUrl(path, 60); if (error) alert(error.message); else window.open(data.signedUrl, '_blank', 'noopener') }
  return <Resource<any> table="documents" title="Documents" sub="Upload documents and associate them with shipments." noun="Document" seed={demoDocuments}
    searchKeys={['name', 'doc_type', 'shipment_reference']} filter={{ key: 'doc_type', options: ['Bill of lading', 'Proof of delivery', 'Commercial invoice', 'Packing list', 'Customs document', 'Delivery receipt', 'Shipping label', 'Freight document'] }}
    prepare={(v) => prepare(v).catch((e) => { throw e })}
    cols={[{ key: 'name', label: 'Document', render: (r) => <b>{r.name}</b> }, { key: 'doc_type', label: 'Type' }, { key: 'shipment_reference', label: 'Shipment' }, { key: 'created_at', label: 'Uploaded', render: (r) => fmt(r.created_at) }, { key: 'access', label: 'Access' }]}
    fields={[{ key: 'file', label: 'File', type: 'file' }, { key: 'name', label: 'Document name' },
      { key: 'doc_type', label: 'Document type', type: 'select', options: ['Bill of lading', 'Proof of delivery', 'Commercial invoice', 'Packing list', 'Customs document', 'Delivery receipt', 'Shipping label', 'Freight document'] },
      { key: 'shipment_reference', label: 'Shipment reference' }, { key: 'access', label: 'Access permission', type: 'select', options: ['Team', 'Admins', 'Finance', 'Customer visible'] }]}
    extraActions={(r) => r.file_path ? <button className="px-2 text-xs font-bold text-teal" onClick={() => open(r.file_path)}>View</button> : null} />
}

export function Appointments() {
  const cal = (rows: any[]) => {
    const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); d.setHours(0, 0, 0, 0); return d })
    return (
      <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {days.map((d) => { const items = rows.filter((r) => r.starts_at && new Date(r.starts_at).toDateString() === d.toDateString() && r.status !== 'Cancelled'); return (
          <div key={+d} className="card min-h-[7rem] p-3"><div className="text-xs font-bold text-muted">{d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</div>
            {items.map((r) => <div key={r.id} className="mt-2 rounded-md bg-soft px-2 py-1 text-xs"><b>{new Date(r.starts_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</b> {r.facility}</div>)}</div>) })}
      </div>)
  }
  return <Resource<any> table="appointments" title="Appointments" sub="Request, book, reschedule and cancel delivery appointments. Use Edit to reschedule." noun="Appointment" seed={demoAppointments} header={cal}
    searchKeys={['facility', 'shipment_reference', 'carrier']} filter={{ key: 'status', options: ['Scheduled', 'At risk', 'Checked in', 'Cancelled'] }}
    cols={[{ key: 'facility', label: 'Facility', render: (r) => <b>{r.facility}</b> }, { key: 'shipment_reference', label: 'Shipment' }, { key: 'carrier', label: 'Carrier' }, { key: 'starts_at', label: 'Appointment', render: (r) => fmt(r.starts_at) },
      { key: 'window', label: 'Window' }, { key: 'status', label: 'Status', render: (r) => <Badge s={r.status} /> }, { key: 'arrival_time', label: 'Arrival', render: (r) => r.arrival_time ? fmt(r.arrival_time) : 'Not arrived' }]}
    fields={[{ key: 'facility', label: 'Facility name', required: true }, { key: 'shipment_reference', label: 'Shipment reference' }, { key: 'carrier', label: 'Carrier' }, { key: 'starts_at', label: 'Appointment date and time', type: 'datetime', required: true },
      { key: 'window', label: 'Appointment window', type: 'select', options: ['1 hour', '2 hours', '3 hours', '4 hours'] }, { key: 'status', label: 'Status', type: 'select', options: ['Scheduled', 'At risk', 'Checked in', 'Cancelled'] }]}
    extraActions={(r, a) => <>{r.status !== 'Checked in' && r.status !== 'Cancelled' && <button className="px-2 text-xs font-bold text-teal" onClick={() => a.update(r.id, { status: 'Checked in', arrival_time: new Date().toISOString() })}>Check in</button>}
      {r.status !== 'Cancelled' && <button className="px-2 text-xs font-bold text-orange" onClick={() => confirm('Cancel this appointment?') && a.update(r.id, { status: 'Cancelled' })}>Cancel</button>}</>} />
}
