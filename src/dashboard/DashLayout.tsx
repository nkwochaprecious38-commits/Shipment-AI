import { useState } from 'react'
import { NavLink, Outlet, Link } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { Icon, ICONS } from '../components/ui'
import { useAuth } from '../lib/auth'

const items: [string, string, string][] = [['Overview', '/app', ICONS.home], ['Shipments', '/app/shipments', ICONS.box], ['Live Tracking', '/app/tracking', ICONS.pin], ['Exceptions', '/app/exceptions', ICONS.alert],
  ['Orders', '/app/orders', ICONS.doc], ['Carriers', '/app/carriers', ICONS.truck], ['Customers', '/app/customers', ICONS.users], ['Documents', '/app/documents', ICONS.doc], ['Appointments', '/app/appointments', ICONS.cal],
  ['Analytics', '/app/analytics', ICONS.chart], ['AI Assistant', '/app/assistant', ICONS.chat], ['Integrations', '/app/integrations', ICONS.plug], ['Team', '/app/team', ICONS.users], ['Account Settings', '/app/settings', ICONS.gear]]

export default function DashLayout() {
  const [open, setOpen] = useState(false)
  const { fullName, orgName, signOut } = useAuth()
  const side = (
    <nav className="flex h-full flex-col bg-navy text-white" aria-label="Dashboard">
      <Link to="/" className="px-5 py-5"><Logo light /></Link>
      <div className="flex-1 space-y-0.5 overflow-auto px-3 pb-4">
        {items.map(([t, p, i]) => <NavLink key={p} to={p} end={p === '/app'} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-ocean text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}><Icon d={i} className="h-[18px] w-[18px]" />{t}</NavLink>)}
      </div>
      <div className="border-t border-white/10 p-4"><div className="truncate text-sm font-semibold">{fullName}</div><div className="truncate text-xs text-white/60">{orgName}</div><button onClick={signOut} className="mt-3 w-full rounded-lg border border-white/20 py-2 text-sm font-bold hover:bg-white/10">Log Out</button></div>
    </nav>)
  return (
    <div className="min-h-screen bg-cool">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{side}</aside>
      {open && <div className="fixed inset-0 z-[1100] lg:hidden"><div className="absolute inset-0 bg-midnight/60" onClick={() => setOpen(false)} /><aside className="absolute inset-y-0 left-0 w-64">{side}</aside></div>}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:hidden"><button aria-label="Open menu" onClick={() => setOpen(true)} className="p-1"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg></button><Logo /><span className="w-6" /></header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>)
}
