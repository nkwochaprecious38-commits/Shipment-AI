import { Link } from 'react-router-dom'
import { Icon, ICONS } from '../components/ui'

const F: [string, string, string[], string][] = [
  ['Real Time Shipment Tracking', 'A single list of every shipment with reference, carrier, mode, origin, destination, current location, status, ETA and last update.', ['Search and filter across all shipments', 'Create shipments manually, by CSV, API or webhook', 'Live updates where a tracking source is connected'], ICONS.pin],
  ['Interactive Shipment Maps', 'See where shipments are, where they started and where they are going.', ['Select a shipment to open its details', 'Route lines from origin to destination', 'Status colours for fast scanning'], ICONS.route],
  ['Predictive ETA Intelligence', 'Calculated arrival estimates that update as shipment events change.', ['Original and updated ETA side by side', 'Estimated delay and recommended action', 'Calculated estimates labelled apart from carrier ETAs'], ICONS.clock],
  ['Shipment Exception Management', 'Turn problems into owned, trackable work.', ['Delays, missed milestones, dwell time and route deviations', 'Severity, detection time and assignee', 'Assign, investigate, update and resolve'], ICONS.alert],
  ['Carrier Management', 'A directory and scorecard for every carrier.', ['Assigned and delayed shipments', 'On time rate and exception frequency', 'Tracking update quality'], ICONS.truck],
  ['Customer Tracking Portals', 'A unique, mobile friendly page for each shipment.', ['Status, milestones and estimated arrival', 'Your logo and brand where supported', 'Share by link'], ICONS.link],
  ['Shipment Documents Management', 'Documents live with the shipment.', ['Bills of lading, proof of delivery, invoices', 'Packing lists, customs and freight documents', 'Access permissions per document'], ICONS.doc],
  ['Order Visibility', 'Connect orders to the shipments that fulfil them.', ['Order number to shipment mapping', 'Delivery records in one place', 'Customer level history'], ICONS.box],
  ['Delivery Appointment Management', 'Coordinate warehouse and facility delivery windows.', ['Request, book, reschedule and cancel', 'Calendar view', 'Check in and check out times'], ICONS.cal],
  ['AI Logistics Assistant', 'Ask questions in plain language.', ['Answers grounded in your authorized records', 'Runs server side, no keys in the browser', 'Requires an AI service connection'], ICONS.chat],
  ['Supply Chain Analytics', 'Charts and filters for operational performance.', ['Volume, on time rate and transit time', 'Mode mix, exception trends, dwell time', 'Filter by date, carrier, mode, customer and location'], ICONS.chart],
  ['Notifications and Alerts', 'Be told when something needs you.', ['Delay and exception alerts', 'Per user notification preferences', 'Customer update messages'], ICONS.bell],
  ['Integrations and API Access', 'Connect the rest of your stack.', ['REST API and webhooks', 'TMS, WMS, ERP and carrier APIs', 'GPS, telematics and ecommerce platforms'], ICONS.plug],
  ['Team Management and Permissions', 'The right access for every person.', ['Organization level data isolation', 'Roles for admins, operators and viewers', 'Audit log of changes'], ICONS.shield],
]
export default function Features() {
  return (
    <>
      <section className="bg-navy py-16 text-white sm:py-24"><div className="container-x text-center"><div className="eyebrow">Features</div>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold sm:text-5xl">Every capability your logistics team needs.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">From tracking to analytics, each feature is designed to give you visibility and a clear next action.</p></div></section>
      <section className="section"><div className="container-x space-y-6">
        {F.map(([t, d, b, i], k) => (
          <article key={t} id={t.toLowerCase().replace(/ /g, '')} className={`card grid gap-6 p-7 lg:grid-cols-2 lg:p-9 ${k % 2 ? 'bg-cool' : ''}`}>
            <div><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-soft text-ocean"><Icon d={i} /></div><h2 className="font-display text-2xl font-extrabold">{t}</h2><p className="mt-2 text-muted">{d}</p></div>
            <ul className="space-y-3 self-center">{b.map((x) => <li key={x} className="flex gap-3"><Icon d={ICONS.check} className="mt-0.5 h-5 w-5 shrink-0 text-teal" /><span>{x}</span></li>)}</ul>
          </article>))}
      </div></section>
      <section className="bg-navy py-16 text-center text-white"><div className="container-x"><h2 className="font-display text-3xl font-extrabold">Start with the features you need today.</h2><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/signup" className="btn-primary px-7 py-3">Get Started</Link><Link to="/pricing" className="btn-ghost-light px-7 py-3">View Pricing</Link></div></div></section>
    </>
  )
}
