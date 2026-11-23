import { useRef, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { PageTitle } from './Resource'

const suggestions = ['Where are my delayed shipments?', 'Which shipments are expected tomorrow?', 'Which carriers have the highest delivery exception rate?', 'Which shipments are at risk of arriving late?', 'What is the status of shipment SHP 10025?', 'Which deliveries are still awaiting pickup?', 'Summarize my logistics performance this month.', 'Which facilities have the longest dwell times?']
interface M { role: 'user' | 'assistant'; text: string; error?: boolean }

export default function Assistant() {
  const [msgs, setMsgs] = useState<M[]>([]); const [q, setQ] = useState(''); const [busy, setBusy] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])
  const ask = async (text: string) => {
    if (!text.trim() || busy) return
    setMsgs((m) => [...m, { role: 'user', text }]); setQ(''); setBusy(true)
    const { data, error } = await supabase.functions.invoke('ask-ai', { body: { question: text } })
    setBusy(false)
    if (error || !data?.answer) setMsgs((m) => [...m, { role: 'assistant', error: true, text: 'The assistant is not connected yet. Deploy the ask-ai function and set ANTHROPIC_API_KEY as described in the README, then try again.' }])
    else setMsgs((m) => [...m, { role: 'assistant', text: data.answer }])
  }
  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col">
      <PageTitle title="Ask Shipment AI" sub="Answers are generated server side from your organization's shipment records." />
      <div className="card flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-auto p-5" aria-live="polite">
          {msgs.length === 0 && <div><p className="mb-4 text-sm text-muted">Try asking:</p><div className="flex flex-wrap gap-2">{suggestions.map((s) => <button key={s} onClick={() => ask(s)} className="rounded-full border border-line px-3 py-1.5 text-left text-sm hover:border-ocean hover:text-ocean">{s}</button>)}</div></div>}
          {msgs.map((m, i) => <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : ''}`}><div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${m.role === 'user' ? 'bg-ocean text-white' : m.error ? 'border border-orange/40 bg-orange/10' : 'bg-cool'}`}>{m.text}</div></div>)}
          {busy && <div className="text-sm text-muted">Thinking...</div>}<div ref={end} />
        </div>
        <form className="flex gap-2 border-t border-line p-3" onSubmit={(e) => { e.preventDefault(); ask(q) }}>
          <input className="input" aria-label="Your question" placeholder="Ask about your shipments" value={q} onChange={(e) => setQ(e.target.value)} /><button className="btn-primary" disabled={busy}>Send</button>
        </form>
      </div>
    </div>)
}
