import { FormEvent, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { fmt } from '../lib/util'
import { useTable } from '../lib/useTable'
import { PageTitle } from './Resource'

export function Team() {
  const { orgId, user } = useAuth()
  const [members, setMembers] = useState<any[]>([]); const [me, setMe] = useState('member'); const [email, setEmail] = useState(''); const [role, setRole] = useState('member'); const [msg, setMsg] = useState('')
  const invites = useTable<any>('invites')
  const load = async () => { const { data } = await supabase.from('memberships').select('id,user_id,role,profiles(full_name,email)').eq('org_id', orgId!); setMembers(data ?? []); setMe((data ?? []).find((m: any) => m.user_id === user?.id)?.role ?? 'member') }
  useEffect(() => { if (orgId) load() }, [orgId])
  const admin = me === 'admin'
  const invite = async (e: FormEvent) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) { setMsg('Enter a valid email.'); return } setMsg((await invites.add({ email: email.toLowerCase(), role })) || 'Invitation saved. They join your organization when they sign up with this email.'); setEmail('') }
  const setR = async (id: string, r: string) => { const { error } = await supabase.from('memberships').update({ role: r }).eq('id', id); setMsg(error ? error.message : 'Role updated.'); load() }
  return (
    <div><PageTitle title="Team" sub="Manage people and roles in your organization." />
      <div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-cool text-xs uppercase text-muted"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th></tr></thead>
        <tbody className="divide-y divide-line">{members.map((m) => <tr key={m.id}><td className="px-4 py-3 font-semibold">{m.profiles?.full_name}</td><td className="px-4 py-3">{m.profiles?.email}</td>
          <td className="px-4 py-3">{admin && m.user_id !== user?.id ? <select className="input max-w-[9rem]" value={m.role} onChange={(e) => setR(m.id, e.target.value)}><option>admin</option><option>member</option><option>viewer</option></select> : m.role}</td></tr>)}</tbody></table></div>
      {msg && <p role="status" className="mt-3 text-sm text-muted">{msg}</p>}
      {admin && <div className="card mt-6 p-5"><h2 className="font-display font-bold">Invite a teammate</h2>
        <form onSubmit={invite} className="mt-3 flex flex-wrap gap-2"><input className="input max-w-xs" aria-label="Email" placeholder="colleague@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <select className="input max-w-[9rem]" aria-label="Role" value={role} onChange={(e) => setRole(e.target.value)}><option>admin</option><option>member</option><option>viewer</option></select><button className="btn-primary">Save invitation</button></form>
        {invites.rows.length > 0 && <ul className="mt-4 text-sm text-muted">{invites.rows.map((i) => <li key={i.id}>{i.email} as {i.role} <button className="ml-2 font-bold text-alert" onClick={() => invites.remove(i.id)}>Remove</button></li>)}</ul>}</div>}
    </div>)
}

export function Settings() {
  const { user, orgId, orgName, signOut } = useAuth()
  const [name, setName] = useState(user?.user_metadata?.full_name ?? ''); const [org, setOrg] = useState(orgName ?? ''); const [msg, setMsg] = useState('')
  const [prefs, setPrefs] = useState<Record<string, boolean>>({ delays: true, exceptions: true, delivered: false, digest: false })
  const [pw, setPw] = useState(''); const [logs, setLogs] = useState<any[]>([])
  useEffect(() => { setOrg(orgName ?? '') }, [orgName])
  useEffect(() => { if (!orgId) return; supabase.from('audit_logs').select('*').eq('org_id', orgId).order('created_at', { ascending: false }).limit(25).then(({ data }) => setLogs(data ?? []))
    supabase.from('profiles').select('prefs').eq('id', user!.id).maybeSingle().then(({ data }) => data?.prefs && setPrefs((p) => ({ ...p, ...data.prefs }))) }, [orgId])
  const saveProfile = async (e: FormEvent) => { e.preventDefault(); const a = await supabase.auth.updateUser({ data: { full_name: name } }); await supabase.from('profiles').update({ full_name: name }).eq('id', user!.id); setMsg(a.error?.message ?? 'Profile saved.') }
  const saveOrg = async (e: FormEvent) => { e.preventDefault(); const { error } = await supabase.from('organizations').update({ name: org }).eq('id', orgId!); setMsg(error ? 'Only organization admins can rename the organization.' : 'Organization saved.') }
  const savePrefs = async (k: string, v: boolean) => { const n = { ...prefs, [k]: v }; setPrefs(n); await supabase.from('profiles').update({ prefs: n }).eq('id', user!.id) }
  const changePw = async (e: FormEvent) => { e.preventDefault(); if (pw.length < 8 || !/\d/.test(pw) || !/[a-z]/.test(pw) || !/[A-Z]/.test(pw)) { setMsg('Password needs at least 8 characters with upper and lower case letters and a number.'); return } const { error } = await supabase.auth.updateUser({ password: pw }); setMsg(error?.message ?? 'Password updated.'); setPw('') }
  const labels: Record<string, string> = { delays: 'Delay alerts', exceptions: 'New exception alerts', delivered: 'Delivery confirmations', digest: 'Daily summary' }
  return (
    <div><PageTitle title="Account Settings" />
      {msg && <div role="status" className="mb-4 rounded-lg border border-line bg-cool p-3 text-sm">{msg}</div>}
      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={saveProfile} className="card space-y-3 p-5"><h2 className="font-display font-bold">Profile</h2><div><label className="label" htmlFor="pn">Full name</label><input id="pn" className="input" value={name} onChange={(e) => setName(e.target.value)} /></div><div><label className="label">Email</label><input className="input bg-cool" value={user?.email ?? ''} readOnly /></div><button className="btn-primary">Save profile</button></form>
        <form onSubmit={saveOrg} className="card space-y-3 p-5"><h2 className="font-display font-bold">Organization</h2><div><label className="label" htmlFor="on">Organization name</label><input id="on" className="input" value={org} onChange={(e) => setOrg(e.target.value)} /></div><button className="btn-primary">Save organization</button></form>
        <div className="card p-5"><h2 className="font-display font-bold">Notification preferences</h2>{Object.keys(labels).map((k) => <label key={k} className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={!!prefs[k]} onChange={(e) => savePrefs(k, e.target.checked)} />{labels[k]}</label>)}</div>
        <form onSubmit={changePw} className="card space-y-3 p-5"><h2 className="font-display font-bold">Security</h2><div><label className="label" htmlFor="np">New password</label><input id="np" type="password" autoComplete="new-password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} /></div><div className="flex gap-2"><button className="btn-primary">Update password</button><button type="button" className="btn-secondary" onClick={signOut}>Log Out</button></div></form>
      </div>
      <div className="card mt-6"><h2 className="border-b border-line p-5 font-display font-bold">Audit log</h2>{logs.length === 0 ? <p className="p-5 text-sm text-muted">No activity recorded yet.</p> :
        <ul className="divide-y divide-line">{logs.map((l) => <li key={l.id} className="flex justify-between gap-3 px-5 py-2.5 text-sm"><span><b>{l.action}</b> <span className="text-muted">{l.detail}</span></span><span className="whitespace-nowrap text-xs text-muted">{fmt(l.created_at)}</span></li>)}</ul>}</div>
    </div>)
}
