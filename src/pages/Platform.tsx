import { Link } from 'react-router-dom'
import { AnalyticsMock, DashboardMock, EtaCard, TrackingPreview } from '../components/Mocks'
import { Head, Icon, ICONS } from '../components/ui'

const blocks: [string, string, string, string][] = [
  ['Centralized shipment visibility', 'One workspace for every shipment, regardless of carrier or mode.', 'Pull shipments from manual entry, CSV uploads, the REST API and webhooks into a single list with a shared map. Filter by customer, carrier, mode or status and open any shipment for its full detail.', ICONS.home],
  ['Real time shipment tracking', 'Locations, milestones and statuses as your data sources report them.', 'Shipment positions and tracking events appear on an interactive map as they arrive from connected sources. Live tracking requires a connected carrier or tracking data provider.', ICONS.pin],
  ['Predictive arrival intelligence', 'Calculated ETAs that tell you early when a delivery is slipping.', 'Estimates use shipment events, carrier updates, historical transit information and transportation mode where supported. Calculated estimates are always labelled separately from carrier provided ETAs.', ICONS.clock],
  ['Shipment exception management', 'Know which shipments need attention, who owns them and what to do next.', 'Delays, missed milestones, unexpected locations, extended dwell times, missed appointments, tracking interruptions and route deviations become exceptions you can assign, investigate, update and resolve.', ICONS.alert],
  ['Carrier and partner coordination', 'Compare carriers and keep partners aligned.', 'Maintain a carrier directory with assigned shipments, delivery performance and tracking status, so conversations with partners start from facts.', ICONS.truck],
  ['Customer tracking portals', 'A branded page for every shipment.', 'Share a unique link that shows status, milestones, estimated arrival and last update. Add your own logo and brand identity where supported.', ICONS.link],
  ['Documents and orders', 'Records stay attached to the shipment they belong to.', 'Associate bills of lading, proof of delivery, invoices, packing lists and customs documents with shipments, and connect customer orders to deliveries.', ICONS.doc],
  ['AI logistics assistant', 'Ask in plain language, answer from your records.', 'Ask Shipment AI about delayed shipments, expected deliveries and carrier exceptions. Answers are generated server side from your authorized shipment records.', ICONS.chat],
  ['Analytics and reporting', 'Measure what is working.', 'Track volume, on time delivery, transit time, exception trends, dwell time and regional performance, filtered by date, carrier, mode, customer and location.', ICONS.chart],
  ['Logistics integrations', 'Connect the systems you already use.', 'The platform is structured for transportation, warehouse and ERP systems, carrier APIs, GPS and telematics providers, ecommerce platforms and notification systems.', ICONS.plug],
]

export default function Platform() {
  return (
    <>
      <section className="bg-navy py-16 text-white sm:py-24"><div className="container-x text-center">
        <div className="eyebrow">Platform</div><h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold sm:text-5xl">Every Shipment. Every Milestone. One Clear View.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">Shipment AI connects your shipment data, carriers, customers and documents into one platform built for logistics teams.</p>
        <div className="mt-8"><Link to="/signup" className="btn-primary px-7 py-3">Get Started</Link></div></div></section>
      <section className="section"><div className="container-x"><DashboardMock /></div></section>
      <section className="section bg-cool pt-0 sm:pt-0"><div className="container-x">
        <div className="grid gap-5 md:grid-cols-2">
          {blocks.map(([t, s, d, i], k) => (
            <div key={t} className="card p-7"><div className="mb-4 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-soft text-ocean"><Icon d={i} /></span><span className="font-display text-xs font-bold text-muted">0{k + 1 > 9 ? k + 1 : k + 1}</span></div>
              <h3 className="font-display text-xl font-bold">{t}</h3><p className="mt-1 font-semibold text-ocean">{s}</p><p className="mt-3 text-muted">{d}</p></div>))}
        </div></div></section>
      <section className="section"><div className="container-x grid items-center gap-10 lg:grid-cols-2"><EtaCard /><div><Head center={false} eyebrow="Predictive arrival" title="Spot a late delivery before your customer does." lead="When an updated ETA moves, Shipment AI shows the change, the estimated delay and a recommended next step." /></div></div></section>
      <section className="section bg-cool"><div className="container-x"><Head eyebrow="Analytics" title="Performance you can measure." /><div className="mt-10"><AnalyticsMock /></div></div></section>
      <section className="section"><div className="container-x grid items-center gap-10 lg:grid-cols-2"><div><Head center={false} eyebrow="Customer experience" title="A tracking page your customers will actually use." lead="Clean, mobile friendly and easy to understand." /></div><TrackingPreview /></div></section>
      <section className="bg-navy py-16 text-center text-white"><div className="container-x"><h2 className="font-display text-3xl font-extrabold">Bring your shipments into one view.</h2><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/signup" className="btn-primary px-7 py-3">Get Started</Link><Link to="/pricing" className="btn-ghost-light px-7 py-3">View Pricing</Link></div></div></section>
    </>
  )
}
