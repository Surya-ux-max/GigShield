import React, { useState, useEffect } from 'react'
import {
  FaCheckCircle, FaClock, FaTimesCircle, FaFileAlt,
  FaDownload, FaSearch, FaFilter, FaArrowUp, FaArrowDown,
  FaCircle, FaBolt, FaExclamationTriangle, FaChevronDown,
  FaTimes, FaShieldAlt, FaMapMarkerAlt, FaCalendarAlt
} from 'react-icons/fa'
import { apiClient } from '../api/client'

interface Claim {
  id: number
  worker_id: string
  amount: number
  status: 'PENDING' | 'VERIFIED' | 'APPROVED' | 'PAID' | 'REJECTED'
  date: string
  description: string
  fraud_score: number
  zone?: string
  trigger?: string
}

const SAMPLE: Claim[] = [
  { id: 2891, worker_id: 'W-1042', amount: 500, status: 'PAID',     date: '2024-06-15', description: 'Heavy rainfall disruption — Zone 4',    fraud_score: 0.08, zone: 'Chennai Central',  trigger: 'Rain'     },
  { id: 2890, worker_id: 'W-0987', amount: 300, status: 'APPROVED', date: '2024-06-14', description: 'Extreme temperature event — Zone 2',    fraud_score: 0.12, zone: 'Coimbatore North', trigger: 'Heat'     },
  { id: 2889, worker_id: 'W-1103', amount: 450, status: 'VERIFIED', date: '2024-06-13', description: 'Air quality degradation — Zone 1',      fraud_score: 0.15, zone: 'Madurai South',    trigger: 'AQI'      },
  { id: 2888, worker_id: 'W-0754', amount: 250, status: 'PENDING',  date: '2024-06-12', description: 'Platform downtime — Swiggy outage',     fraud_score: 0.22, zone: 'Salem East',       trigger: 'Platform' },
  { id: 2887, worker_id: 'W-1201', amount: 500, status: 'REJECTED', date: '2024-06-11', description: 'Claim disputed — insufficient evidence', fraud_score: 0.71, zone: 'Trichy West',      trigger: 'Rain'     },
  { id: 2886, worker_id: 'W-0631', amount: 200, status: 'PAID',     date: '2024-06-10', description: 'Traffic congestion — Zone 3',           fraud_score: 0.09, zone: 'Chennai Central',  trigger: 'Traffic'  },
  { id: 2885, worker_id: 'W-0812', amount: 350, status: 'APPROVED', date: '2024-06-09', description: 'Flooding event — Zone 4',               fraud_score: 0.18, zone: 'Chennai Central',  trigger: 'Rain'     },
  { id: 2884, worker_id: 'W-1055', amount: 500, status: 'VERIFIED', date: '2024-06-08', description: 'Extreme heat — delivery drop 62%',      fraud_score: 0.11, zone: 'Coimbatore North', trigger: 'Heat'     },
]

/* ── STATUS CONFIG ── */
const statusCfg: Record<string, { label: string; bg: string; text: string; border: string; icon: React.ElementType }> = {
  PAID:     { label: 'Paid',     bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  icon: FaCheckCircle },
  APPROVED: { label: 'Approved', bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   icon: FaCheckCircle },
  VERIFIED: { label: 'Verified', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: FaClock       },
  PENDING:  { label: 'Pending',  bg: 'bg-gray-100',  text: 'text-gray-600',   border: 'border-gray-200',   icon: FaClock       },
  REJECTED: { label: 'Rejected', bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    icon: FaTimesCircle },
}

function StatusPill({ status }: { status: string }) {
  const c = statusCfg[status] ?? statusCfg.PENDING
  const Icon = c.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black border tracking-wider ${c.bg} ${c.text} ${c.border}`}>
      <Icon className="text-[9px]" /> {c.label}
    </span>
  )
}

function RiskGauge({ score }: { score: number }) {
  const pct   = Math.round(score * 100)
  const color = score > 0.5 ? '#dc2626' : score > 0.3 ? '#d97706' : '#16a34a'
  const label = score > 0.5 ? 'HIGH' : score > 0.3 ? 'MED' : 'LOW'
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-[10px] font-black" style={{ color }}>{label}</span>
    </div>
  )
}

/* ── CLAIM DETAIL DRAWER ── */
function ClaimDrawer({ claim, onClose }: { claim: Claim; onClose: () => void }) {
  const c = statusCfg[claim.status] ?? statusCfg.PENDING
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-md bg-white border-l border-gray-100 h-full overflow-y-auto flex flex-col shadow-2xl">

        {/* ── Drawer Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div>
            <p className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Claim Detail</p>
            <h2 className="text-gray-900 font-black text-lg">#{claim.id}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors">
            <FaTimes className="text-gray-500 text-xs" />
          </button>
        </div>

        <div className="p-6 space-y-5 flex-1">

          {/* status + date */}
          <div className="flex items-center justify-between">
            <StatusPill status={claim.status} />
            <span className="text-gray-400 text-xs font-mono">{claim.date}</span>
          </div>

          {/* amount hero */}
          <div className="bg-red-600 rounded-2xl p-6 text-center shadow-lg shadow-red-100">
            <p className="text-red-200 text-xs font-bold uppercase tracking-wider mb-1">Claim Amount</p>
            <p className="text-5xl font-black text-white">₹{claim.amount}</p>
            <p className={`text-xs font-bold mt-2 ${c.text} bg-white/20 inline-block px-3 py-1 rounded-full`}>{c.label}</p>
          </div>

          {/* details grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Worker ID', value: claim.worker_id,    icon: FaShieldAlt    },
              { label: 'Zone',      value: claim.zone ?? '—',  icon: FaMapMarkerAlt },
              { label: 'Trigger',   value: claim.trigger ?? '—', icon: FaBolt       },
              { label: 'Filed On',  value: claim.date,          icon: FaCalendarAlt },
            ].map((d, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <d.icon className="text-red-400 text-[10px]" />
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{d.label}</p>
                </div>
                <p className="text-gray-900 text-sm font-bold">{d.value}</p>
              </div>
            ))}
          </div>

          {/* description */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2">Description</p>
            <p className="text-gray-700 text-sm leading-relaxed">{claim.description}</p>
          </div>

          {/* fraud score */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Fraud Risk Score</p>
              <span className="text-gray-900 font-black text-sm font-mono">{(claim.fraud_score * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all"
                style={{
                  width: `${claim.fraud_score * 100}%`,
                  background: claim.fraud_score > 0.5 ? '#dc2626' : claim.fraud_score > 0.3 ? '#d97706' : '#16a34a',
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-green-600 text-[9px] font-bold">LOW RISK</span>
              <span className="text-red-600 text-[9px] font-bold">HIGH RISK</span>
            </div>
          </div>

          {/* AI verdict */}
          <div className={`rounded-xl p-4 border ${claim.fraud_score > 0.5 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-center gap-2 mb-1.5">
              <FaShieldAlt className={`text-xs ${claim.fraud_score > 0.5 ? 'text-red-600' : 'text-green-600'}`} />
              <p className={`text-[10px] font-black uppercase tracking-wider ${claim.fraud_score > 0.5 ? 'text-red-700' : 'text-green-700'}`}>
                AI Verdict
              </p>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed">
              {claim.fraud_score > 0.5
                ? 'High fraud probability detected. Manual review required before processing.'
                : 'Claim appears legitimate. Environmental data corroborates the disruption event.'}
            </p>
          </div>
        </div>

        {/* drawer footer */}
        {claim.status === 'VERIFIED' && (
          <div className="px-6 py-5 border-t border-gray-100 flex gap-3 bg-white sticky bottom-0">
            <button className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-xl text-white text-sm font-black transition-colors shadow-sm">
              Approve
            </button>
            <button className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white text-sm font-black transition-colors shadow-sm shadow-red-100">
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── MAIN ── */
const ClaimsPage: React.FC = () => {
  const [claims, setClaims]             = useState<Claim[]>([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState<string | null>(null)
  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [riskFilter, setRiskFilter]     = useState('ALL')
  const [selected, setSelected]         = useState<Claim | null>(null)
  const [sortCol, setSortCol]           = useState<'id' | 'amount' | 'fraud_score' | 'date'>('id')
  const [sortDir, setSortDir]           = useState<'asc' | 'desc'>('desc')

  useEffect(() => { loadClaims() }, [])

  const loadClaims = async () => {
    setLoading(true); setError(null)
    try {
      const res = await apiClient.listAllClaims()
      setClaims((res.claims || []).map((c: any) => ({
        id: c.id, worker_id: c.worker_id?.toString(), amount: c.amount,
        status: c.status, date: c.date, description: c.description || '',
        fraud_score: c.fraud_score || 0, zone: c.zone, trigger: c.trigger,
      })))
    } catch {
      setError('Backend unavailable — showing sample data')
      setClaims(SAMPLE)
    } finally { setLoading(false) }
  }

  const toggleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('desc') }
  }

  const filtered = claims
    .filter(c => {
      const q = search.toLowerCase()
      const matchSearch = c.worker_id?.toLowerCase().includes(q) || c.id.toString().includes(q)
      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter
      const matchRisk   = riskFilter === 'ALL'
        || (riskFilter === 'HIGH'   && c.fraud_score > 0.5)
        || (riskFilter === 'MEDIUM' && c.fraud_score > 0.3 && c.fraud_score <= 0.5)
        || (riskFilter === 'LOW'    && c.fraud_score <= 0.3)
      return matchSearch && matchStatus && matchRisk
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortCol === 'date') return dir * (new Date(a.date).getTime() - new Date(b.date).getTime())
      return dir * ((a[sortCol] as number) - (b[sortCol] as number))
    })

  const statStrip = [
    { label: 'Total Claims',  value: claims.length,                                      delta: '+5',    up: true,  accent: 'border-t-red-600'    },
    { label: 'Paid',          value: claims.filter(c => c.status === 'PAID').length,     delta: '+2',    up: true,  accent: 'border-t-green-500'  },
    { label: 'Pending',       value: claims.filter(c => c.status === 'PENDING').length,  delta: '+1',    up: true,  accent: 'border-t-orange-400' },
    { label: 'Rejected',      value: claims.filter(c => c.status === 'REJECTED').length, delta: '0',     up: false, accent: 'border-t-gray-400'   },
    {
      label: 'Total Paid Out',
      value: `₹${claims.filter(c => c.status === 'PAID').reduce((a, c) => a + c.amount, 0).toLocaleString('en-IN')}`,
      delta: '+₹900', up: true, accent: 'border-t-red-600',
    },
  ]

  const SortIcon = ({ col }: { col: typeof sortCol }) =>
    sortCol === col
      ? sortDir === 'desc'
        ? <FaArrowDown className="text-red-500 text-[9px]" />
        : <FaArrowUp   className="text-red-500 text-[9px]" />
      : <FaChevronDown className="text-gray-300 text-[9px]" />

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══════════════════════════════════
          SECTION 1 — PAGE HEADER
      ══════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FaCircle className="text-[7px] text-red-600 animate-pulse" />
              <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Carely · Claims Engine</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Claims Management</h1>
            <p className="text-gray-400 text-xs mt-0.5">AI-verified parametric insurance claims · Real-time processing</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadClaims}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 transition-colors"
            >
              <FaFileAlt className="text-[10px]" /> Reload
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-xs font-semibold text-white transition-colors shadow-sm shadow-red-200">
              <FaDownload className="text-[10px]" /> Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-6">

        {/* error banner */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 text-xs font-semibold">
            <FaExclamationTriangle /> {error}
          </div>
        )}

        {/* ══════════════════════════════════
            SECTION 2 — STAT STRIP
        ══════════════════════════════════ */}
        <section>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Claims Overview</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {statStrip.map((s, i) => (
              <div key={i} className={`bg-white border border-gray-100 border-t-4 ${s.accent} rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all`}>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">{s.label}</p>
                <p className="text-gray-900 text-2xl font-black">{s.value}</p>
                <span className={`flex items-center gap-1 text-[10px] font-bold mt-1 ${s.up ? 'text-green-600' : 'text-red-600'}`}>
                  {s.up ? <FaArrowUp className="text-[8px]" /> : <FaArrowDown className="text-[8px]" />}
                  {s.delta} today
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════
            SECTION 3 — FILTER BAR
        ══════════════════════════════════ */}
        <section className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-wrap gap-3 items-center">

            {/* search */}
            <div className="relative flex-1 min-w-48">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Search claim ID or worker ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-50 transition-all"
              />
            </div>

            {/* status pills */}
            <div className="flex gap-1.5 flex-wrap">
              {['ALL','PAID','APPROVED','VERIFIED','PENDING','REJECTED'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-black tracking-wider transition-colors ${
                    statusFilter === s
                      ? 'bg-red-600 text-white shadow-sm shadow-red-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* risk filter */}
            <div className="flex gap-1.5">
              {['ALL','HIGH','MEDIUM','LOW'].map(r => (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-black tracking-wider transition-colors ${
                    riskFilter === r
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {r === 'ALL' ? <><FaFilter className="inline mr-1 text-[8px]" />RISK</> : r}
                </button>
              ))}
            </div>

            <span className="text-gray-400 text-xs ml-auto font-semibold">{filtered.length} results</span>
          </div>
        </section>

        {/* ══════════════════════════════════
            SECTION 4 — CLAIMS TABLE
        ══════════════════════════════════ */}
        <section>
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 border-4 border-red-100 border-t-red-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-red-600">
                      {[
                        { label: 'Claim ID',   col: 'id'          as const },
                        { label: 'Worker',     col: null                   },
                        { label: 'Amount',     col: 'amount'      as const },
                        { label: 'Status',     col: null                   },
                        { label: 'Date',       col: 'date'        as const },
                        { label: 'Zone',       col: null                   },
                        { label: 'Trigger',    col: null                   },
                        { label: 'Fraud Risk', col: 'fraud_score' as const },
                        { label: 'Action',     col: null                   },
                      ].map((h, i) => (
                        <th
                          key={i}
                          onClick={() => h.col && toggleSort(h.col)}
                          className={`px-5 py-4 text-left text-red-100 font-bold uppercase tracking-wider ${h.col ? 'cursor-pointer hover:text-white' : ''}`}
                        >
                          <span className="flex items-center gap-1.5">
                            {h.label}
                            {h.col && <SortIcon col={h.col} />}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.length > 0 ? filtered.map(claim => (
                      <tr
                        key={claim.id}
                        className="hover:bg-red-50 transition-colors cursor-pointer"
                        onClick={() => setSelected(claim)}
                      >
                        <td className="px-5 py-4">
                          <span className="text-gray-900 font-black font-mono">#{claim.id}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center text-[9px] font-black text-red-600">
                              {claim.worker_id?.slice(-2)}
                            </div>
                            <span className="text-gray-700 font-mono font-semibold">{claim.worker_id}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-gray-900 font-black">₹{claim.amount}</span>
                        </td>
                        <td className="px-5 py-4">
                          <StatusPill status={claim.status} />
                        </td>
                        <td className="px-5 py-4 text-gray-400 font-mono">{claim.date}</td>
                        <td className="px-5 py-4 text-gray-500">{claim.zone ?? '—'}</td>
                        <td className="px-5 py-4">
                          {claim.trigger
                            ? <span className="flex items-center gap-1 text-orange-600 font-semibold"><FaBolt className="text-[9px]" />{claim.trigger}</span>
                            : <span className="text-gray-300">—</span>
                          }
                        </td>
                        <td className="px-5 py-4">
                          <RiskGauge score={claim.fraud_score} />
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={e => { e.stopPropagation(); setSelected(claim) }}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-lg text-red-600 hover:text-white font-bold transition-all text-[10px]"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={9} className="px-5 py-16 text-center">
                          <FaFileAlt className="text-3xl mx-auto mb-3 text-gray-200" />
                          <p className="text-gray-400 font-semibold text-sm">No claims match your filters</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* ── Table Footer ── */}
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="text-gray-400 text-[11px]">Showing {filtered.length} of {claims.length} claims</span>
                <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-semibold">
                  <FaCircle className="text-[6px] text-green-500 animate-pulse" /> Auto-refreshing every 30s
                </div>
              </div>
            </div>
          )}
        </section>

      </div>

      {/* ══════════════════════════════════
          SECTION 5 — DETAIL DRAWER
      ══════════════════════════════════ */}
      {selected && <ClaimDrawer claim={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export default ClaimsPage
