export const fmt = (iso?: string | null) => iso ? new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : 'Not available'
export const fmtDay = (iso?: string | null) => iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not available'
export const statusStyle = (s: string) => ({
  'Delivered': 'bg-teal/10 text-teal', 'In transit': 'bg-ocean/10 text-ocean', 'Delayed': 'bg-orange/15 text-[#a8651b]',
  'Exception': 'bg-alert/10 text-alert', 'Pending pickup': 'bg-slate-100 text-muted',
  'Critical': 'bg-alert/10 text-alert', 'High': 'bg-orange/15 text-[#a8651b]', 'Medium': 'bg-ocean/10 text-ocean', 'Low': 'bg-slate-100 text-muted',
  'Open': 'bg-orange/15 text-[#a8651b]', 'Investigating': 'bg-ocean/10 text-ocean', 'Resolved': 'bg-teal/10 text-teal',
  'Connected': 'bg-teal/10 text-teal', 'Partial': 'bg-orange/15 text-[#a8651b]', 'Not connected': 'bg-slate-100 text-muted',
  'Scheduled': 'bg-ocean/10 text-ocean', 'At risk': 'bg-orange/15 text-[#a8651b]', 'Checked in': 'bg-teal/10 text-teal', 'Cancelled': 'bg-slate-100 text-muted',
} as Record<string, string>)[s] ?? 'bg-slate-100 text-muted'
export interface Shipment {
  id: string; reference: string; order_number: string | null; customer: string | null; carrier: string | null; mode: string
  origin: string; destination: string; origin_lat: number | null; origin_lng: number | null; dest_lat: number | null; dest_lng: number | null
  current_lat: number | null; current_lng: number | null; status: string; priority: string; eta: string | null; original_eta: string | null
  last_update: string | null; tracking_token: string; is_demo?: boolean
}
