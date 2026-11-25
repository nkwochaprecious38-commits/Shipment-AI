import { Link } from 'react-router-dom'
import { AnalyticsMock, DashboardMock, EtaCard, TrackingPreview } from '../components/Mocks'
import { Head, Icon, ICONS } from '../components/ui'
import { Logo } from '../components/Logo'

const problems = ['Limited visibility into shipment locations', 'Difficulty tracking multiple carriers', 'Unexpected delivery delays', 'Poor communication between logistics partners', 'Manual shipment updates', 'Limited visibility into delivery performance', 'Difficulty keeping customers informed', 'Disconnected shipment records and documents']
export const features: [string, string, string][] = [
  ['Real Time Shipment Tracking', 'See every shipment, status and milestone across road, ocean, air, rail, intermodal and parcel.', ICONS.pin],
  ['Predictive ETA Intelligence', 'Calculated arrival estimates built from shipment events, carrier updates and transit history, clearly separated from carrier provided ETAs.', ICONS.clock],
  ['Shipment Exception Management', 'Surface delays, missed milestones and tracking gaps, then assign, investigate and resolve them.', ICONS.alert],
  ['Carrier Management', 'Compare carriers on delivery performance, exception frequency and tracking quality.', ICONS.truck],
  ['Customer Tracking Portals', 'Share a unique, branded tracking link so customers stop asking where their order is.', ICONS.link],
  ['Shipment Documents Management', 'Keep bills of lading, proof of delivery and customs papers attached to the right shipment.', ICONS.doc],
  ['Order and Delivery Management', 'Connect customer orders to shipments and delivery records in one place.', ICONS.box],
  ['AI Logistics Assistant', 'Ask questions about your shipments and get answers grounded in your own records.', ICONS.chat],
  ['Supply Chain Analytics', 'Understand volume, on time delivery, transit time and exception trends.', ICONS.chart],
]

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="container-x pb-16 pt-14 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center rise">
            <div className="mx-auto mb-8 inline-flex items-center rounded-3xl bg-white px-6 py-4 shadow-lift ring-1 ring-white/20 sm:px-10 sm:py-6">
              <span className="sm:hidden"><Logo size="md" /></span><span className="hidden sm:inline"><Logo size="lg" /></span>
            </div>
            <div className="eyebrow !text-teal">Shipment visibility and logistics intelligence</div>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] sm:text-6xl">Know Where Every Shipment Stands.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">Shipment AI brings your logistics operations into one intelligent platform. Track shipments, anticipate delays, coordinate carriers, and keep customers informed from dispatch to delivery.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/signup" className="btn-primary px-7 py-3">Get Started</Link>
              <Link to="/platform" className="btn-ghost-light px-7 py-3">Explore the Platform</Link>
            </div>
          </div>
          <div className="mx-auto mt-14 max-w-6xl rise"><DashboardMock /></div>
        </div>
      </section>

      <section className="section bg-white" id="problem">
        <div className="container-x">
          <Head eyebrow="The challenge" title="Shipments move faster than the information about them." lead="When tracking lives in emails, spreadsheets and carrier portals, teams react to problems instead of preventing them." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((p) => <div key={p} className="card p-5"><Icon d={ICONS.alert} className="mb-3 h-5 w-5 text-orange" /><p className="font-semibold leading-snug">{p}</p></div>)}
          </div>
        </div>
      </section>

      <section className="section bg-cool" id="overview">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="eyebrow mb-3">Platform overview</div>
            <h2 className="h2">One platform for visibility, carriers and delivery intelligence.</h2>
            <p className="lead mt-4">Shipment AI centralizes shipment visibility, carrier management, delivery monitoring and logistics intelligence, so every team works from the same clear view of what is moving, what is late and what needs attention.</p>
            <ul className="mt-6 space-y-3">
              {['Road, ocean, air, rail, intermodal and parcel in one view', 'Inbound and outbound shipments side by side', 'Customers, carriers and internal teams on the same information'].map((t) => (
                <li key={t} className="flex gap-3"><Icon d={ICONS.check} className="mt-0.5 h-5 w-5 shrink-0 text-teal" /><span>{t}</span></li>))}
            </ul>
            <Link to="/platform" className="btn-dark mt-8">See how it works</Link>
          </div>
          <EtaCard />
        </div>
      </section>

      <section className="section bg-white" id="features">
        <div className="container-x">
          <Head eyebrow="Key features" title="Everything your logistics team needs to stay ahead." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(([t, d, i]) => (
              <div key={t} className="card p-6 transition duration-200 hover:-translate-y-1 hover:border-ocean/40">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-soft text-ocean"><Icon d={i} /></div>
                <h3 className="font-display text-lg font-bold">{t}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </div>))}
          </div>
          <div className="mt-10 text-center"><Link to="/features" className="btn-secondary">View all features</Link></div>
        </div>
      </section>

      <section className="section bg-cool" id="demo">
        <div className="container-x">
          <Head eyebrow="Product demonstration" title="See your whole operation at a glance." lead="The previews below use demonstration data to show how Shipment AI presents shipment status, carrier performance and delivery trends." />
          <div className="mt-12"><AnalyticsMock /></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[['Total shipments', '604'], ['Active shipments', '212'], ['Delivered', '361'], ['Delayed', '54'], ['On time delivery', '91%']].map(([l, v]) => (
              <div key={l} className="card p-5"><div className="text-xs font-semibold text-muted">{l}</div><div className="font-display text-3xl font-extrabold">{v}</div><div className="mt-1 text-[11px] text-muted">Demonstration data</div></div>))}
          </div>
        </div>
      </section>

      <section className="section bg-white" id="how">
        <div className="container-x">
          <Head eyebrow="How it works" title="From shipment data to confident decisions in three steps." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[['1', 'Add or connect your data', 'Enter shipments manually, upload a CSV, or connect carriers and systems through the REST API and webhooks.'],
              ['2', 'Monitor progress and exceptions', 'Follow shipment progress, carrier activity and delivery exceptions from a single workspace.'],
              ['3', 'Decide with visibility', 'Use shipment visibility and logistics intelligence to act early, inform customers and improve performance.']].map(([n, t, d]) => (
              <div key={n} className="card p-7"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-navy font-display font-extrabold text-white">{n}</div>
                <h3 className="font-display text-xl font-bold">{t}</h3><p className="mt-2 text-muted">{d}</p></div>))}
          </div>
        </div>
      </section>

      <section className="section bg-cool">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <TrackingPreview />
          <div>
            <div className="eyebrow mb-3">Customer tracking</div>
            <h2 className="h2">Keep customers informed without lifting a finger.</h2>
            <p className="lead mt-4">Generate a unique tracking link for every shipment. Customers see status, milestones and estimated arrival on a clean page that works on any phone.</p>
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 text-center text-white sm:py-24">
        <div className="container-x">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold sm:text-4xl">Ready to see every shipment clearly?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/75">Create an account or explore the platform to see how Shipment AI fits your operation.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/signup" className="btn-primary px-7 py-3">Create an Account</Link><Link to="/platform" className="btn-ghost-light px-7 py-3">Explore the Platform</Link></div>
        </div>
      </section>
    </>
  )
}
