import { useState } from 'react'
import { Badge } from '../components/ui'
import { useTable } from '../lib/useTable'
import { PageTitle } from './Resource'

const list: [string, string, string, string][] = [
  ['REST API and webhooks', 'Create and update shipments and tracking events from any system.', 'Available', 'Generate an API key below, then POST JSON to the ingest endpoint.'],
  ['CSV import', 'Upload shipment files from the Shipments page.', 'Available', 'Columns: reference, origin, destination, plus optional order_number, customer, carrier, mode, status, priority, eta.'],
  ['Transportation Management Systems', 'Sync shipments from your TMS.', 'Requires setup', 'Use the REST API from your TMS, or request a managed connector. Needs your TMS API credentials.'],
  ['Warehouse Management Systems', 'Receive facility and dwell time events.', 'Requires setup', 'Send facility events through the REST API. Needs WMS access.'],
  ['ERP Systems', 'Link orders and purchase orders.', 'Requires setup', 'Map ERP orders to shipment references via the API.'],
  ['Carrier APIs', 'Receive carrier tracking events.', 'Requires setup', 'Needs a developer account and credentials with each carrier or a tracking data provider. Live tracking is only available once connected.'],
  ['GPS and telematics providers', 'Receive vehicle positions.', 'Requires setup', 'Needs a telematics provider account and webhook configuration.'],
  ['Ecommerce platforms', 'Import customer orders.', 'Requires setup', 'Needs store API credentials.'],
  ['Notification systems', 'Send alerts by email or messaging.', 'Requires setup', 'Needs an email or messaging provider account.'],
]
export default function Integrations() {
  const t = useTable<any>('integrations'); const [open, setOpen] = useState<string | null>(null); const [msg, setMsg] = useState('')
  const key = t.rows.find((r) => r.kind === 'api_key')
  const gen = async () => {
    const k = 'sai_' + Array.from(crypto.getRandomValues(new Uint8Array(24))).map((b) => b.toString(16).padStart(2, '0')).join('')
    if (key) await t.remove(key.id)
    setMsg((await t.add({ name: 'API key', kind: 'api_key', status: 'Connected', config: { key: k } })) || 'New API key generated.')
  }
  const url = `${import.meta.env.VITE_SUPABASE_URL ?? 'https://YOUR_PROJECT.supabase.co'}/functions/v1/ingest-shipment`
  return (
    <div>
      <PageTitle title="Integrations" sub="Connect Shipment AI to your logistics systems. External services need their own credentials." />
      <div className="grid gap-4 md:grid-cols-2">
        {list.map(([n, d, s, how]) => (
          <div key={n} className="card p-5"><div className="flex items-start justify-between gap-3"><h2 className="font-display font-bold">{n}</h2><Badge s={s === 'Available' ? 'Connected' : 'Partial'} /></div>
            <p className="mt-1 text-sm text-muted">{d}</p><button className="mt-3 text-sm font-bold text-ocean" onClick={() => setOpen(open === n ? null : n)}>{open === n ? 'Hide setup' : 'Setup instructions'}</button>
            {open === n && <p className="mt-2 rounded-lg bg-cool p-3 text-sm">{how}</p>}</div>))}
      </div>
      <div className="card mt-6 p-6"><h2 className="font-display text-lg font-bold">API access</h2>
        <p className="mt-1 text-sm text-muted">Send shipments from your systems using an organization API key. Requires the ingest-shipment function to be deployed.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3"><button className="btn-primary" onClick={gen}>{key ? 'Regenerate API key' : 'Generate API key'}</button>{msg && <span role="status" className="text-sm text-muted">{msg}</span>}</div>
        {key && <div className="mt-4 break-all rounded-lg bg-cool p-3 font-mono text-xs">{key.config?.key}</div>}
        <pre className="mt-4 overflow-auto rounded-lg bg-midnight p-4 text-xs text-white">{`curl -X POST ${url} \\
  -H "x-api-key: YOUR_KEY" -H "Content-Type: application/json" \\
  -d '{"reference":"SHP 20001","origin":"Chicago","destination":"Dallas","mode":"Road","status":"In transit"}'`}</pre></div>
    </div>)
}
