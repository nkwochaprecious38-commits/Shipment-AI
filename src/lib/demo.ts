export const MODES = ['Road', 'Ocean', 'Air', 'Rail', 'Intermodal', 'Parcel'] as const
export const STATUSES = ['Pending pickup', 'In transit', 'Delivered', 'Delayed', 'Exception'] as const

export const CITIES: Record<string, [number, number]> = {
  Chicago: [41.88, -87.63], Dallas: [32.78, -96.8], 'Los Angeles': [34.05, -118.24], Rotterdam: [51.92, 4.48],
  'New York': [40.71, -74.0], Lagos: [6.52, 3.38], Singapore: [1.35, 103.82], Hamburg: [53.55, 9.99],
  Atlanta: [33.75, -84.39], Seattle: [47.61, -122.33], Denver: [39.74, -104.99], Shanghai: [31.23, 121.47],
  Memphis: [35.15, -90.05], Frankfurt: [50.11, 8.68],
}
const H = 3600e3
const tok = () => Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10)

type S = [string, string, string, string, string, string, string, number, number, string, string]
// ref, order, customer, carrier, mode, origin, dest, progress, etaHours, status, priority
const rows: S[] = [
  ['SHP 10025', 'ORD 5521', 'Northwind Foods', 'Meridian Freight', 'Road', 'Chicago', 'Dallas', 0.62, 6, 'Delayed', 'High'],
  ['SHP 10026', 'ORD 5522', 'Apex Components', 'BlueWave Lines', 'Ocean', 'Shanghai', 'Los Angeles', 0.45, 190, 'In transit', 'Medium'],
  ['SHP 10027', 'ORD 5523', 'Harbor Retail', 'SkyBridge Cargo', 'Air', 'Frankfurt', 'New York', 0.7, 5, 'In transit', 'High'],
  ['SHP 10028', 'ORD 5524', 'Northwind Foods', 'Meridian Freight', 'Road', 'Atlanta', 'Memphis', 1, -3, 'Delivered', 'Low'],
  ['SHP 10029', 'ORD 5525', 'Kestrel Industrial', 'IronRail Logistics', 'Rail', 'Seattle', 'Denver', 0.35, 60, 'In transit', 'Medium'],
  ['SHP 10030', 'ORD 5526', 'Apex Components', 'BlueWave Lines', 'Ocean', 'Hamburg', 'Singapore', 0.2, 300, 'Exception', 'High'],
  ['SHP 10031', 'ORD 5527', 'Harbor Retail', 'Parcelio Express', 'Parcel', 'Los Angeles', 'Seattle', 0.55, 20, 'In transit', 'Low'],
  ['SHP 10032', 'ORD 5528', 'Kestrel Industrial', 'Meridian Freight', 'Road', 'Dallas', 'Atlanta', 0, 30, 'Pending pickup', 'Medium'],
  ['SHP 10033', 'ORD 5529', 'Delta Imports', 'SkyBridge Cargo', 'Air', 'Rotterdam', 'Lagos', 0.5, 9, 'Delayed', 'High'],
  ['SHP 10034', 'ORD 5530', 'Delta Imports', 'IronRail Logistics', 'Intermodal', 'Chicago', 'New York', 0.8, 14, 'In transit', 'Medium'],
]

export const demoShipments = () => rows.map(([reference, order_number, customer, carrier, mode, o, d, p, eh, status, priority]) => {
  const a = CITIES[o], b = CITIES[d], now = Date.now()
  const eta = new Date(now + eh * H)
  const orig = new Date(eta.getTime() - (status === 'Delayed' ? (reference === 'SHP 10025' ? 4.5 : 3) * H : 0))
  return {
    reference, order_number, customer, carrier, mode, origin: o, destination: d,
    origin_lat: a[0], origin_lng: a[1], dest_lat: b[0], dest_lng: b[1],
    current_lat: +(a[0] + (b[0] - a[0]) * p).toFixed(3), current_lng: +(a[1] + (b[1] - a[1]) * p).toFixed(3),
    status, priority, eta: eta.toISOString(), original_eta: orig.toISOString(),
    last_update: new Date(now - Math.random() * 3 * H).toISOString(), tracking_token: tok(),
  }
})

export const demoCarriers = () => [
  ['Meridian Freight', 'Road', 'ops@meridian.example', 'Connected'], ['BlueWave Lines', 'Ocean', 'desk@bluewave.example', 'Connected'],
  ['SkyBridge Cargo', 'Air', 'air@skybridge.example', 'Partial'], ['IronRail Logistics', 'Rail', 'rail@ironrail.example', 'Connected'],
  ['Parcelio Express', 'Parcel', 'hello@parcelio.example', 'Not connected'],
].map(([name, mode, contact, tracking_status]) => ({ name, mode, contact, tracking_status }))

export const demoCustomers = () => [
  ['Northwind Foods', 'Sam Okafor', 'sam@northwind.example'], ['Apex Components', 'Lena Fischer', 'lena@apex.example'],
  ['Harbor Retail', 'Dana Ruiz', 'dana@harbor.example'], ['Kestrel Industrial', 'Tom Hale', 'tom@kestrel.example'],
  ['Delta Imports', 'Amara Bello', 'amara@delta.example'],
].map(([name, contact, email]) => ({ name, contact, email, portal_enabled: true }))

export const demoOrders = () => rows.slice(0, 8).map((r, i) => ({
  order_number: r[1], customer: r[2], shipment_reference: r[0], value: [18400, 52200, 9800, 6100, 27500, 61300, 3400, 12800][i],
  status: r[9] === 'Delivered' ? 'Fulfilled' : r[9] === 'Pending pickup' ? 'Processing' : 'Shipped',
}))

export const demoExceptions = () => [
  ['SHP 10025', 'Delayed shipment', 'High', 'Open', 'Priya N.', 'Notify the receiving facility and update the customer.'],
  ['SHP 10030', 'Tracking interruption', 'Critical', 'Investigating', 'Marcus L.', 'Contact BlueWave Lines for a vessel position report.'],
  ['SHP 10033', 'Extended dwell time', 'Medium', 'Open', 'Unassigned', 'Request a status update from the origin terminal.'],
  ['SHP 10031', 'Missed delivery appointment', 'Medium', 'Open', 'Unassigned', 'Rebook the appointment with the receiving facility.'],
  ['SHP 10029', 'Route deviation', 'Low', 'Open', 'Priya N.', 'Confirm the revised route with IronRail Logistics.'],
].map(([shipment_reference, type, severity, status, assignee, recommended_action]) => ({ shipment_reference, type, severity, status, assignee, recommended_action }))

const day = (n: number, h: number) => { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(h, 0, 0, 0); return d.toISOString() }
export const demoAppointments = () => [
  ['Chicago DC 4', 'SHP 10034', 'Meridian Freight', day(0, 9), '2 hours', 'Scheduled'],
  ['Dallas Warehouse', 'SHP 10025', 'Meridian Freight', day(0, 14), '2 hours', 'At risk'],
  ['Memphis Hub', 'SHP 10028', 'Meridian Freight', day(1, 10), '1 hour', 'Scheduled'],
  ['Denver Cross Dock', 'SHP 10029', 'IronRail Logistics', day(2, 8), '3 hours', 'Scheduled'],
  ['Seattle Fulfillment', 'SHP 10031', 'Parcelio Express', day(3, 13), '1 hour', 'Scheduled'],
].map(([facility, shipment_reference, carrier, starts_at, window, status]) => ({ facility, shipment_reference, carrier, starts_at, window, status }))

export const demoDocuments = () => [
  ['BOL SHP 10025.pdf', 'Bill of lading', 'SHP 10025', 'Team'], ['POD SHP 10028.pdf', 'Proof of delivery', 'SHP 10028', 'Customer visible'],
  ['Invoice ORD 5526.pdf', 'Commercial invoice', 'SHP 10030', 'Finance'], ['Packing list SHP 10026.pdf', 'Packing list', 'SHP 10026', 'Team'],
  ['Customs entry SHP 10033.pdf', 'Customs document', 'SHP 10033', 'Admins'],
].map(([name, doc_type, shipment_reference, access]) => ({ name, doc_type, shipment_reference, access }))

// Static demonstration series for charts
export const volumeSeries = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'].map((m, i) => ({ m, volume: [420, 465, 510, 488, 560, 604][i], delayed: [48, 52, 61, 49, 58, 54][i] }))
export const modeMix = [{ name: 'Road', value: 46 }, { name: 'Ocean', value: 22 }, { name: 'Air', value: 12 }, { name: 'Rail', value: 8 }, { name: 'Intermodal', value: 7 }, { name: 'Parcel', value: 5 }]
export const carrierPerf = [
  { name: 'Meridian', onTime: 94, exceptions: 3 }, { name: 'BlueWave', onTime: 88, exceptions: 6 },
  { name: 'SkyBridge', onTime: 91, exceptions: 4 }, { name: 'IronRail', onTime: 86, exceptions: 7 }, { name: 'Parcelio', onTime: 93, exceptions: 3 },
]
export const dwell = [{ f: 'Chicago DC 4', h: 3.1 }, { f: 'Dallas Warehouse', h: 5.4 }, { f: 'Memphis Hub', h: 2.2 }, { f: 'Denver Cross Dock', h: 4.6 }, { f: 'Seattle Fulfillment', h: 3.8 }]
export const regionPerf = [{ r: 'North America', v: 92 }, { r: 'Europe', v: 89 }, { r: 'Asia Pacific', v: 85 }, { r: 'Africa', v: 82 }]
