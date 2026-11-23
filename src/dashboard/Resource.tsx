import { ReactNode, useMemo, useState } from 'react'
import { useTable } from '../lib/useTable'
import { Demo } from '../components/ui'

export interface Col<T> { key: string; label: string; render?: (r: T, api: Api<T>) => ReactNode }
export interface FieldDef { key: string; label: string; type?: 'text' | 'number' | 'select' | 'datetime' | 'checkbox' | 'file' | 'email'; options?: string[]; required?: boolean; default?: any }
export interface Api<T> { update: (id: string, p: Record<string, any>) => Promise<string>; remove: (id: string) => Promise<string>; rows: T[] }

const toLocal = (iso?: string) => { if (!iso) return ''; const d = new Date(iso); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16) }

export function PageTitle({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (<div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>{sub && <p className="mt-1 text-sm text-muted">{sub}</p>}</div><div className="flex flex-wrap gap-2">{children}</div></div>)
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-midnight/50 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-auto rounded-t-2xl bg-white p-6 shadow-lift sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h2 className="font-display text-xl font-extrabold">{title}</h2><button onClick={onClose} aria-label="Close" className="text-2xl leading-none text-muted">×</button></div>{children}
      </div>
    </div>)
}

export function RecordForm({ fields, initial, onSave, onCancel, label = 'Save' }: { fields: FieldDef[]; initial: Record<string, any>; onSave: (v: Record<string, any>) => Promise<string>; onCancel: () => void; label?: string }) {
  const [v, setV] = useState<Record<string, any>>(() => {
    const o: Record<string, any> = {}
    fields.forEach((f) => { o[f.key] = f.type === 'datetime' ? toLocal(initial[f.key]) : initial[f.key] ?? f.default ?? (f.type === 'checkbox' ? false : f.type === 'select' ? f.options![0] : '') })
    return o
  })
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    for (const f of fields) if (f.required && (v[f.key] === '' || v[f.key] == null)) { setErr(`${f.label} is required.`); return }
    const out: Record<string, any> = {}
    fields.forEach((f) => { const x = v[f.key]; out[f.key] = f.type === 'datetime' ? (x ? new Date(x).toISOString() : null) : f.type === 'number' ? (x === '' ? null : Number(x)) : f.type === 'file' ? x : x === '' ? null : x })
    setBusy(true); const m = await onSave(out); setBusy(false)
    if (m) setErr(m)
  }
  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      {err && <div role="alert" className="rounded-lg border border-alert/30 bg-alert/5 p-3 text-sm text-alert">{err}</div>}
      {fields.map((f) => (
        <div key={f.key}>
          {f.type === 'checkbox' ? (
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={!!v[f.key]} onChange={(e) => setV({ ...v, [f.key]: e.target.checked })} />{f.label}</label>
          ) : (<>
            <label className="label" htmlFor={'f' + f.key}>{f.label}{f.required && ' *'}</label>
            {f.type === 'select' ? (
              <select id={'f' + f.key} className="input" value={v[f.key]} onChange={(e) => setV({ ...v, [f.key]: e.target.value })}>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>
            ) : f.type === 'file' ? (
              <input id={'f' + f.key} type="file" className="input" onChange={(e) => setV({ ...v, [f.key]: e.target.files?.[0] ?? null })} />
            ) : (
              <input id={'f' + f.key} className="input" type={f.type === 'datetime' ? 'datetime-local' : f.type ?? 'text'} value={v[f.key] ?? ''} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} />
            )}</>)}
        </div>))}
      <div className="flex justify-end gap-2 pt-2"><button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button><button className="btn-primary" disabled={busy}>{busy ? 'Saving...' : label}</button></div>
    </form>)
}

interface Props<T> {
  table: string; title: string; sub?: string; cols: Col<T>[]; fields: FieldDef[]; seed?: () => any[]; searchKeys: string[]
  noun: string; toolbar?: (api: Api<T> & { reload: () => void }) => ReactNode; header?: (rows: T[]) => ReactNode
  prepare?: (v: Record<string, any>) => Promise<Record<string, any>>; extraActions?: (r: T, api: Api<T>) => ReactNode; allowEdit?: boolean
  filter?: { key: string; options: string[] }
}

export default function Resource<T extends { id: string; is_demo?: boolean }>(p: Props<T>) {
  const t = useTable<T>(p.table, p.seed)
  const [q, setQ] = useState(''); const [fv, setFv] = useState('All')
  const [edit, setEdit] = useState<T | 'new' | null>(null)
  const [note, setNote] = useState('')
  const rows = useMemo(() => t.rows.filter((r: any) => (fv === 'All' || r[p.filter!.key] === fv) && (!q || p.searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(q.toLowerCase())))), [t.rows, q, fv, p.filter, p.searchKeys])
  const api: Api<T> = { update: t.update, remove: t.remove, rows: t.rows }
  const save = async (vals: Record<string, any>) => {
    let v = vals
    try { v = p.prepare ? await p.prepare(vals) : vals } catch (e: any) { return e.message || 'Could not prepare the record.' }
    const m = edit === 'new' ? await t.add(v) : await t.update((edit as T).id, v)
    if (!m) setEdit(null); return m
  }
  const hasDemo = t.rows.some((r) => r.is_demo)
  return (
    <div>
      <PageTitle title={p.title} sub={p.sub}>
        {p.toolbar?.({ ...api, reload: t.reload })}
        {p.seed && t.rows.length === 0 && !t.loading && <button className="btn-secondary" onClick={async () => setNote((await t.loadDemo()) || 'Demonstration data loaded.')}>Load demonstration data</button>}
        <button className="btn-primary" onClick={() => setEdit('new')}>Add {p.noun}</button>
      </PageTitle>
      {p.header?.(t.rows)}
      {(t.error || note) && <div role="status" className={`mb-4 rounded-lg border p-3 text-sm ${t.error ? 'border-alert/30 bg-alert/5 text-alert' : 'border-teal/30 bg-teal/10 text-[#0f7d78]'}`}>{t.error || note}</div>}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
          <input className="input max-w-xs" placeholder={`Search ${p.title.toLowerCase()}`} aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
          {p.filter && <select className="input max-w-[11rem]" aria-label="Filter" value={fv} onChange={(e) => setFv(e.target.value)}>{['All', ...p.filter.options].map((o) => <option key={o}>{o}</option>)}</select>}
          {hasDemo && <Demo />}
          <span className="ml-auto text-xs text-muted">{rows.length} of {t.rows.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-cool text-xs uppercase tracking-wide text-muted"><tr>{p.cols.map((c) => <th key={c.key} className="whitespace-nowrap px-4 py-3 font-semibold">{c.label}</th>)}<th className="px-4 py-3 text-right font-semibold">Actions</th></tr></thead>
            <tbody className="divide-y divide-line">
              {t.loading ? <tr><td colSpan={p.cols.length + 1} className="p-8 text-center text-muted">Loading...</td></tr>
                : rows.length === 0 ? <tr><td colSpan={p.cols.length + 1} className="p-10 text-center text-muted">No {p.title.toLowerCase()} yet. Use Add {p.noun}{p.seed ? ' or load demonstration data' : ''}.</td></tr>
                : rows.map((r: any) => (
                  <tr key={r.id} className="hover:bg-cool/60">
                    {p.cols.map((c) => <td key={c.key} className="whitespace-nowrap px-4 py-3">{c.render ? c.render(r, api) : String(r[c.key] ?? '')}</td>)}
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      {p.extraActions?.(r, api)}
                      {p.allowEdit !== false && <button className="px-2 text-xs font-bold text-ocean" onClick={() => setEdit(r)}>Edit</button>}
                      <button className="px-2 text-xs font-bold text-alert" onClick={async () => { if (confirm(`Delete this ${p.noun.toLowerCase()}?`)) { const m = await t.remove(r.id); if (m) setNote(m) } }}>Delete</button>
                    </td>
                  </tr>))}
            </tbody>
          </table>
        </div>
      </div>
      {edit && <Modal title={edit === 'new' ? `Add ${p.noun}` : `Edit ${p.noun}`} onClose={() => setEdit(null)}>
        <RecordForm fields={p.fields} initial={edit === 'new' ? {} : (edit as any)} onSave={save} onCancel={() => setEdit(null)} /></Modal>}
    </div>)
}
