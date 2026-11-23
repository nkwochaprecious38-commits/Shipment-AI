import { Link } from 'react-router-dom'
import { Icon, ICONS } from '../components/ui'

const data: [string, string, string, string][] = [
  ['Manufacturers', 'Monitor inbound materials, production supplies, outbound orders and delivery schedules.', 'A late inbound container can halt a production line, and planners often learn about it too late.', 'Shipment AI shows inbound and outbound shipments together, flags arrival risk early and gives planners time to adjust schedules.'],
  ['Retail and Ecommerce', 'Track inventory movements, monitor supplier deliveries and improve customer shipment visibility.', 'Stock arrives unpredictably, and customers contact support to ask where their order is.', 'Supplier deliveries are visible in one view, and branded tracking links let customers answer their own questions.'],
  ['Freight Forwarders', 'Manage shipments across carriers, transportation modes and international delivery routes.', 'Each carrier and mode reports differently, so a single client shipment can mean five different portals.', 'One shipment record brings multimodal movement, documents and milestones together for you and your clients.'],
  ['Third Party Logistics Providers', 'Coordinate shipments, manage delivery exceptions and provide customers with better visibility.', 'Clients expect proactive updates across many accounts, and exceptions get lost in inboxes.', 'An exception workspace with owners and recommended actions, plus customer portals for every account.'],
  ['Distributors and Wholesalers', 'Monitor outbound deliveries, carrier performance and fulfillment operations.', 'It is hard to see which carriers deliver reliably and which orders are at risk.', 'Carrier scorecards and delivery monitoring help you choose carriers with evidence and protect key accounts.'],
  ['Import and Export Businesses', 'Track international freight movement across ocean, air, rail and road transportation.', 'Long transit times, handoffs and customs steps make progress difficult to follow.', 'Milestones, documents and calculated ETAs follow cargo across every leg of its journey.'],
  ['Transportation and Carrier Companies', 'Manage shipment updates, delivery milestones and operational performance.', 'Shippers want frequent, accurate updates, and manual status messages consume dispatch time.', 'Share consistent milestone updates through the API and webhooks, and show shippers your performance clearly.'],
]
export default function Solutions() {
  return (
    <>
      <section className="bg-navy py-16 text-white sm:py-24"><div className="container-x text-center"><div className="eyebrow">Solutions</div>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold sm:text-5xl">Built for the teams that keep goods moving.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">Whatever you ship and wherever it goes, Shipment AI gives your team a clear view and a clear next step.</p></div></section>
      <section className="section"><div className="container-x space-y-6">
        {data.map(([t, s, c, h], i) => (
          <article key={t} id={t.toLowerCase().replace(/ /g, '')} className="card grid gap-6 p-7 lg:grid-cols-3 lg:p-9">
            <div><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-soft text-ocean"><Icon d={[ICONS.box, ICONS.users, ICONS.route, ICONS.truck, ICONS.chart, ICONS.pin, ICONS.shield][i]} /></div>
              <h2 className="font-display text-2xl font-extrabold">{t}</h2><p className="mt-2 text-muted">{s}</p></div>
            <div><div className="eyebrow !text-[#a8651b]">The challenge</div><p className="mt-2">{c}</p></div>
            <div><div className="eyebrow">How Shipment AI helps</div><p className="mt-2">{h}</p></div>
          </article>))}
      </div></section>
      <section className="bg-navy py-16 text-center text-white"><div className="container-x"><h2 className="font-display text-3xl font-extrabold">Find the right fit for your operation.</h2><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/signup" className="btn-primary px-7 py-3">Get Started</Link><Link to="/features" className="btn-ghost-light px-7 py-3">Explore Features</Link></div></div></section>
    </>
  )
}
