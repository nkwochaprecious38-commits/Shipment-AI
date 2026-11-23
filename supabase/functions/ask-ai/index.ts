// Supabase Edge Function: server side AI assistant.
// Secrets required: ANTHROPIC_API_KEY. (SUPABASE_URL and SUPABASE_ANON_KEY are provided automatically.)
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const auth = req.headers.get('Authorization') ?? ''
    // The user's own JWT is forwarded, so row level security limits data to their organization.
    const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } })
    const { data: u } = await sb.auth.getUser()
    if (!u.user) return json({ error: 'Unauthorized' }, 401)
    const { question } = await req.json()
    if (!question || typeof question !== 'string' || question.length > 1000) return json({ error: 'Invalid question' }, 400)

    const [s, e, a] = await Promise.all([
      sb.from('shipments').select('reference,order_number,customer,carrier,mode,origin,destination,status,priority,eta,original_eta,last_update').limit(300),
      sb.from('exceptions').select('shipment_reference,type,severity,status,assignee,detected_at').limit(200),
      sb.from('appointments').select('facility,shipment_reference,carrier,starts_at,status,arrival_time').limit(200),
    ])
    const key = Deno.env.get('ANTHROPIC_API_KEY')
    if (!key) return json({ error: 'ANTHROPIC_API_KEY is not set' }, 500)

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-5-5', max_tokens: 1000,
        system: `You are Shipment AI, a logistics assistant. Answer ONLY from the JSON records provided. If the records do not contain the answer, say so plainly. Never invent shipments, times or statistics. Current time: ${new Date().toISOString()}. Do not use dashes or hyphens as punctuation in your answer; use colons or commas instead. Be concise.`,
        messages: [{ role: 'user', content: `Records:\n${JSON.stringify({ shipments: s.data, exceptions: e.data, appointments: a.data })}\n\nQuestion: ${question}` }],
      }),
    })
    if (!r.ok) return json({ error: 'AI service error' }, 502)
    const d = await r.json()
    return json({ answer: d.content?.map((c: any) => c.text).join('') ?? '' })
  } catch (err) { return json({ error: String(err) }, 500) }
})
