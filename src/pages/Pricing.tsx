import { PLANS } from '../lib/config'
import { Icon, ICONS } from '../components/ui'

export default function Pricing() {
  return (
    <>
      <section className="bg-navy py-16 text-white sm:py-24"><div className="container-x text-center"><div className="eyebrow">Pricing</div>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold sm:text-5xl">Simple plans for every stage of your operation.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">Choose a plan and complete checkout securely on Selar. Prices are in US dollars.</p></div></section>
      <section className="section bg-cool"><div className="container-x grid gap-6 lg:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.name} className={`relative flex flex-col rounded-2xl border bg-white p-8 ${p.highlight ? 'border-ocean shadow-lift lg:-translate-y-3' : 'border-line shadow-card'}`}>
            {p.highlight && <span className="absolute -top-3 left-8 rounded-full bg-ocean px-3 py-1 text-xs font-bold text-white">Recommended</span>}
            <h2 className="font-display text-xl font-extrabold">{p.name}</h2><p className="mt-1 text-sm text-muted">{p.blurb}</p>
            <div className="mt-6 flex items-end gap-2"><span className="font-display text-5xl font-extrabold">{p.price}</span><span className="pb-1.5 text-muted">{p.period}</span></div>
            <ul className="my-8 flex-1 space-y-3">{p.features.map((f) => <li key={f} className="flex gap-3 text-sm"><Icon d={ICONS.check} className="mt-0.5 h-5 w-5 shrink-0 text-teal" />{f}</li>)}</ul>
            <a href={p.url} target="_blank" rel="noopener noreferrer" className={p.highlight ? 'btn-primary py-3' : 'btn-secondary py-3'}>Choose {p.name}</a>
          </div>))}
      </div>
      <p className="container-x mt-8 text-center text-sm text-muted">Checkout opens in a new tab on Selar. Create your Shipment AI account any time from the Get Started button.</p></section>
    </>
  )
}
