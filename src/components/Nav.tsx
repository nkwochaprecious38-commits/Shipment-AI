import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Logo } from './Logo'
import { useAuth } from '../lib/auth'

const links = [['Platform', '/platform'], ['Solutions', '/solutions'], ['Features', '/features'], ['Pricing', '/pricing']]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const cls = ({ isActive }: { isActive: boolean }) => `text-sm font-semibold transition ${isActive ? 'text-ocean' : 'text-navy hover:text-ocean'}`
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" aria-label="Shipment AI home" onClick={() => setOpen(false)}><Logo /></Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map(([t, p]) => <NavLink key={p} to={p} className={cls}>{t}</NavLink>)}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          {user ? <Link to="/app" className="btn-primary">Open Dashboard</Link> : <>
            <Link to="/login" className="text-sm font-semibold text-navy hover:text-ocean">Log In</Link>
            <Link to="/signup" className="btn-primary">Get Started</Link></>}
        </div>
        <button className="rounded-lg p-2 md:hidden" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
        </button>
      </div>
      {open && (
        <div className="border-t border-line bg-white md:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {links.map(([t, p]) => <NavLink key={p} to={p} onClick={() => setOpen(false)} className={({ isActive }) => `rounded-lg px-3 py-3 text-base font-semibold ${isActive ? 'bg-soft text-ocean' : 'text-navy'}`}>{t}</NavLink>)}
            {user ? <Link to="/app" onClick={() => setOpen(false)} className="btn-primary mt-2">Open Dashboard</Link> : <>
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-semibold">Log In</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary mt-1">Get Started</Link></>}
          </div>
        </div>
      )}
    </header>
  )
}
