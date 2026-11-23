// Supabase Edge Function: REST and webhook ingestion. Deploy with --no-verify-jwt (auth is the x-api-key header).
// POST JSON: a shipment object or an array. Upserts by reference within the key's organization.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })
  const key = req.headers.get('x-api-key')
  if (!key) return new Response(JSON.stringify({ error: 'Missing x-api-key' }), { status: 401 })
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { data: k } = await sb.from('integrations').select('org_id').eq('kind', 'api_key').eq('config->>key', key).maybeSingle()
  if (!k) return new Response(JSON.stringify({ error: 'Invalid API key' }), { status: 401 })
  const body = await req.json().catch(() => null)
  const items = Array.isArray(body) ? body : body ? [body] : []
  const allowed = ['reference','order_number','customer','carrier','mode','origin','destination','origin_lat','origin_lng','dest_lat','dest_lng','current_lat','current_lng','status','priority','eta','original_eta']
  let count = 0
  for (const it of items) {
    if (!it.reference || !it.origin || !it.destination) continue
    const row: Record<string, unknown> = { org_id: k.org_id, last_update: new Date().toISOString() }
    for (const f of allowed) if (it[f] !== undefined) row[f] = it[f]
    const { data: ex } = await sb.from('shipments').select('id').eq('org_id', k.org_id).eq('reference', it.reference).maybeSingle()
    const { error } = ex ? await sb.from('shipments').update(row).eq('id', ex.id) : await sb.from('shipments').insert(row)
    if (!error) count++
  }
  return new Response(JSON.stringify({ processed: count }), { headers: { 'Content-Type': 'application/json' } })
})
