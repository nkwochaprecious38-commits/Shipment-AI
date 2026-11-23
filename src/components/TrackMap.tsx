import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Shipment } from '../lib/util'

const color = (s: string) => ({ Delivered: '#18A6A0', 'In transit': '#2676C9', Delayed: '#E69A45', Exception: '#D92D20', 'Pending pickup': '#667085' } as any)[s] ?? '#2676C9'

export default function TrackMap({ shipments, selected, onSelect, height = 420 }: { shipments: Shipment[]; selected?: string | null; onSelect?: (id: string) => void; height?: number }) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layer = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!el.current || map.current) return
    map.current = L.map(el.current, { scrollWheelZoom: false, worldCopyJump: true }).setView([30, 0], 2)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors', maxZoom: 18 }).addTo(map.current)
    layer.current = L.layerGroup().addTo(map.current)
    return () => { map.current?.remove(); map.current = null }
  }, [])

  useEffect(() => {
    const g = layer.current, m = map.current
    if (!g || !m) return
    g.clearLayers()
    const pts: L.LatLngExpression[] = []
    shipments.forEach((s) => {
      const sel = s.id === selected
      if (s.origin_lat != null && s.dest_lat != null) {
        L.polyline([[s.origin_lat, s.origin_lng!], [s.dest_lat, s.dest_lng!]], { color: color(s.status), weight: sel ? 3 : 1.5, opacity: sel ? 0.9 : 0.4, dashArray: '6 6' }).addTo(g)
        L.circleMarker([s.origin_lat, s.origin_lng!], { radius: 4, color: '#142B45', fillColor: '#fff', fillOpacity: 1, weight: 2 }).addTo(g)
        L.circleMarker([s.dest_lat, s.dest_lng!], { radius: 4, color: '#142B45', fillColor: '#142B45', fillOpacity: 1, weight: 2 }).addTo(g)
      }
      if (s.current_lat != null) {
        const p: L.LatLngExpression = [s.current_lat, s.current_lng!]
        pts.push(p)
        L.circleMarker(p, { radius: sel ? 10 : 7, color: '#fff', weight: 2, fillColor: color(s.status), fillOpacity: 1 })
          .bindTooltip(`${s.reference}: ${s.status}`).on('click', () => onSelect?.(s.id)).addTo(g)
      }
    })
    const sel = shipments.find((s) => s.id === selected)
    if (sel?.current_lat != null) m.flyTo([sel.current_lat, sel.current_lng!], Math.max(m.getZoom(), 4), { duration: 0.6 })
    else if (pts.length > 1) m.fitBounds(L.latLngBounds(pts), { padding: [40, 40], maxZoom: 5 })
  }, [shipments, selected, onSelect])

  return <div ref={el} style={{ height }} className="w-full overflow-hidden rounded-xl border border-line" role="application" aria-label="Shipment map" />
}
