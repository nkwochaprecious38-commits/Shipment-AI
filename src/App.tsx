import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import { useAuth } from './lib/auth'
import Layout from './components/Layout'
import Home from './pages/Home'
import Platform from './pages/Platform'
import Solutions from './pages/Solutions'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Track from './pages/Track'
import DashLayout from './dashboard/DashLayout'
import Overview from './dashboard/Overview'
import Shipments from './dashboard/Shipments'
import Tracking from './dashboard/Tracking'
import { Appointments, Carriers, Customers, Documents, Exceptions, Orders } from './dashboard/Others'
import Analytics from './dashboard/Analytics'
import Assistant from './dashboard/Assistant'
import Integrations from './dashboard/Integrations'
import { Settings, Team } from './dashboard/Team'

function Protected({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth(); const loc = useLocation()
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted">Loading...</div>
  if (!session) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return <>{children}</>
}
const Page = ({ children }: { children: ReactNode }) => <Layout>{children}</Layout>

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Page><Home /></Page>} />
      <Route path="/platform" element={<Page><Platform /></Page>} />
      <Route path="/solutions" element={<Page><Solutions /></Page>} />
      <Route path="/features" element={<Page><Features /></Page>} />
      <Route path="/pricing" element={<Page><Pricing /></Page>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/track/:token" element={<Track />} />
      <Route path="/app" element={<Protected><DashLayout /></Protected>}>
        <Route index element={<Overview />} /><Route path="shipments" element={<Shipments />} /><Route path="tracking" element={<Tracking />} />
        <Route path="exceptions" element={<Exceptions />} /><Route path="orders" element={<Orders />} /><Route path="carriers" element={<Carriers />} />
        <Route path="customers" element={<Customers />} /><Route path="documents" element={<Documents />} /><Route path="appointments" element={<Appointments />} />
        <Route path="analytics" element={<Analytics />} /><Route path="assistant" element={<Assistant />} /><Route path="integrations" element={<Integrations />} />
        <Route path="team" element={<Team />} /><Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Page><div className="container-x py-32 text-center"><h1 className="text-4xl font-extrabold">Page not found</h1></div></Page>} />
    </Routes>
  )
}
