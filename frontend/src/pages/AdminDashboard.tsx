import React, { useEffect, useRef, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import {
  FaUsers, FaShieldAlt, FaClipboard, FaExclamationTriangle,
  FaArrowUp, FaArrowDown, FaCircle, FaBolt, FaChartLine,
  FaClock, FaCheckCircle, FaDownload, FaSyncAlt
} from 'react-icons/fa'
import { useData, loadDashboardStats } from '../stores'

/* ── DATA ── */
const areaData = [
  { time: '00:00', workers: 112, claims: 4,  payouts: 1800 },
  { time: '03:00', workers: 118, claims: 6,  payouts: 2700 },
  { time: '06:00', workers: 145, claims: 9,  payouts: 4050 },
  { time: '09:00', workers: 178, claims: 14, payouts: 6300 },
  { time: '12:00', workers: 200, claims: 22, payouts: 9900 },
  { time: '15:00', workers: 192, claims: 18, payouts: 8100 },
  { time: '18:00', workers: 210, claims: 25, payouts: 11250 },
  { time: '21:00', workers: 185, claims: 16, payouts: 7200 },
  { time: '23:59', workers: 170, claims: 11, payouts: 4950 },
]

const monthlyBar = [
  { month: 'Jan', subscriptions: 100, claims: 8,  fraud: 1 },
  { month: 'Feb', subscriptions: 115, claims: 12, fraud: 2 },
  { month: 'Mar', subscriptions: 128, claims: 15, fraud: 1 },
  { month: 'Apr', subscriptions: 140, claims: 18, fraud: 3 },
  { month: 'May', subscriptions: 158, claims: 22, fraud: 2 },
  { month: 'Jun', subscriptions: 174, claims: 25, fraud: 4 },
]

const donutData = [
  { name: 'Paid',     value: 42, color: '#16a34a' },
  { name: 'Approved', value: 28, color: '#2563eb' },
  { name: 'Verified', value: 18, color: '#d97706' },
  { name: 'Pending',  value: 8,  color: '#9ca3af' },
  { name: 'Rejected', value: 4,  color: '#dc2626' },
]

const riskMatrix = [
  { zone: 'Chennai Central',  risk: 'HIGH',   score: 0.84, triggers: 3, active: 142, disruption: 'Rain + Traffic' },
  { zone: 'Coimbatore North', risk: 'MEDIUM', score: 0.61, triggers: 1, active: 98,  disruption: 'Heat'          },
  { zone: 'Madurai South',    risk: 'MEDIUM', score: 0.57, triggers: 1, active: 76,  disruption: 'AQI'           },
  { zone: 'Salem East',       risk: 'LOW',    score: 0.29, triggers: 0, active: 54,  disruption: '—'             },
  { zone: 'Trichy West',      risk: 'LOW',    score: 0.22, triggers: 0, active: 61,  disruption: '—'             },
]

const activityFeed = [
  { id: 1, type: 'PAYOUT',  msg: 'Worker W-1042 received ₹450 payout',         time: '2m ago',  dot: 'bg-green-500'  },
  { id: 2, type: 'TRIGGER', msg: 'Disruption trigger fired — Chennai Zone 4',  time: '5m ago',  dot: 'bg-red-500'    },
  { id: 3, type: 'FRAUD',   msg: 'Fraud flag raised on Claim #2891',            time: '11m ago', dot: 'bg-orange-500' },
  { id: 4, type: 'CLAIM',   msg: 'Auto-claim generated for 18 workers',         time: '18m ago', dot: 'bg-blue-500'   },
  { id: 5, type: 'PAYOUT',  msg: 'Batch payout ₹8,100 processed successfully', time: '24m ago', dot: 'bg-green-500'  },
  { id: 6, type: 'TRIGGER', msg: 'AQI threshold breached — Madurai Zone 2',    time: '31m ago', dot: 'bg-red-500'    },
  { id: 7, type: 'CLAIM',   msg: 'Claim #2890 verified by AI engine',           time: '38m ago', dot: 'bg-blue-500'   },
]

const tickerItems = [
  { label: 'ACTIVE WORKERS',     value: '1,284',   delta: '+3.2%',  up: true  },
  { label: 'LIVE SUBSCRIPTIONS', value: '974',     delta: '+1.8%',  up: true  },
  { label: 'CLAIMS TODAY',       value: '47',      delta: '+12.5%', up: true  },
  { label: 'PAYOUTS TODAY',      value: '₹21,600', delta: '+8.4%',  up: true  },
  { label: 'FRAUD RATE',         value: '2.1%',    delta: '-0.3%',  up: false },
  { label: 'AVG PAYOUT TIME',    value: '2.4 min', delta: '-0.8%',  up: false },
  { label: 'RISK INDEX',         value: '0.61',    delta: '+0.04',  up: true  },
  { label: 'ZONES MONITORED',    value: '24',      delta: '0%',     up: true  },
]

/* ── TICKER ── */
function Ticker() {
  const doubled = [...tickerItems, ...tickerItems]
  return (
    <div className="bg-red-600 overflow-hidden h-9 flex items-center">
      <div className="flex-shrink-0 bg-red-800 h-full flex items-center px-4 gap-2">
        <span className="text-white text-[10px] font-black tracking-widest uppercase">Live</span>
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex animate-[ticker_30s_linear_infinite] whitespace-nowrap">
          {doubled.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-6 text-[11px] border-r border-red-500">
              <span className="text-red-200 font-semibold tracking-wider">{item.label}</span>
              <span className="text-white font-black">{item.value}</span>
              <span className={`flex items-center gap-0.5 font-bold ${item.up ? 'text-green-300' : 'text-red-200'}`}>
                {item.up ? <FaArrowUp className="text-[8px]" /> : <FaArrowDown className="text-[8px]" />}
                {item.delta}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── PANEL HEADER ── */
function PanelHeader({ title, sub, badge }: { title: string; sub?: string; badge?: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-red-600 rounded-full" />
        <div>
          <h2 className="text-gray-900 font-black text-sm tracking-wide">{title}</h2>
          {sub && <p className="text-gray-400 text-[11px] mt-0.5">{sub}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {badge && <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{badge}</span>}
        <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600">
          <FaCircle className="text-[6px] animate-pulse" /> LIVE
        </span>
      </div>
    </div>
  )
}

/* ── TOOLTIP ── */
const LightTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-gray-500 text-xs font-semibold mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-xs font-bold" style={{ color: p.color }}>
          {p.name}: <span className="text-gray-900">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

/* ── RISK BADGE ── */
function RiskBadge({ risk }: { risk: string }) {
  const map: Record<string, string> = {
    HIGH:   'bg-red-100 text-red-700 border-red-200',
    MEDIUM: 'bg-orange-100 text-orange-700 border-orange-200',
    LOW:    'bg-green-100 text-green-700 border-green-200',
  }
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border tracking-widest ${map[risk] ?? map.LOW}`}>
      {risk}
    </span>
  )
}

/* ── KPI CARD ── */
interface KpiProps {
  label: string; value: string | number; delta: string; up: boolean
  sub: string; icon: React.ElementType; sparkData: number[]
}
function KpiCard({ label, value, delta, up, sub, icon: Icon, sparkData }: KpiProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-[11px] font-bold tracking-widest uppercase">{label}</span>
        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
          <Icon className="text-red-600 text-sm" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
        <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {up ? <FaArrowUp className="text-[8px]" /> : <FaArrowDown className="text-[8px]" />}
          {delta}
        </span>
        <div className="w-20 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData.map((v, i) => ({ i, v }))}>
              <Line type="monotone" dataKey="v" stroke={up ? '#16a34a' : '#dc2626'} strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

const axisStyle = {
  stroke: '#e5e7eb',
  tick: { fill: '#9ca3af', fontSize: 11 },
}

/* ── MAIN ── */
const AdminDashboard: React.FC = () => {
  const { stats, loading } = useData()
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [activeChart, setActiveChart] = useState<'workers' | 'claims' | 'payouts'>('claims')

  useEffect(() => {
    loadDashboardStats()
    const t = setInterval(() => setLastUpdated(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const kpiCards: KpiProps[] = [
    { label: 'Total Workers',        value: stats?.total_workers        || 1284, delta: '+3.2%',  up: true,  sub: 'Registered gig workers',  icon: FaUsers,               sparkData: [110,125,138,150,162,175,188,200,210,220] },
    { label: 'Active Subscriptions', value: stats?.active_subscriptions || 974,  delta: '+1.8%',  up: true,  sub: 'Plans active right now',   icon: FaShieldAlt,           sparkData: [80,88,95,102,110,118,125,132,140,148]   },
    { label: 'Total Claims',         value: stats?.total_claims         || 347,  delta: '+12.5%', up: true,  sub: 'All-time claim count',     icon: FaClipboard,           sparkData: [20,28,35,42,50,58,65,72,80,88]          },
    { label: 'Fraud Detected',       value: stats?.fraud_detected       || 14,   delta: '-0.3%',  up: false, sub: 'Flagged this period',      icon: FaExclamationTriangle, sparkData: [8,9,11,10,12,11,13,12,14,14]            },
  ]

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm font-medium">Loading dashboard...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══════════════════════════════════
          SECTION 1 — LIVE TICKER
      ══════════════════════════════════ */}
      <Ticker />

      {/* ══════════════════════════════════
          SECTION 2 — PAGE HEADER
      ══════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <span className="text-gray-400 text-[10px] font-bold tracking-widest uppercase">Carely Operations Center</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-400 text-xs mt-0.5">
              Last updated: {lastUpdated.toLocaleTimeString('en-IN')} · All zones monitored
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { loadDashboardStats(); setLastUpdated(new Date()) }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 transition-colors"
            >
              <FaSyncAlt className="text-[10px]" /> Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-xs font-semibold text-white transition-colors shadow-sm shadow-red-200">
              <FaDownload className="text-[10px]" /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-8">

        {/* ══════════════════════════════════
            SECTION 3 — KPI CARDS
        ══════════════════════════════════ */}
        <section>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Key Performance Indicators</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((k, i) => <KpiCard key={i} {...k} />)}
          </div>
        </section>

        {/* ══════════════════════════════════
            SECTION 4 — INTRADAY AREA CHART
        ══════════════════════════════════ */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <PanelHeader
            title="Intraday Activity"
            sub="Workers online · Claims filed · Payouts processed — today"
            badge="24h"
          />
          <div className="flex gap-2 mb-5">
            {(['workers', 'claims', 'payouts'] as const).map(k => (
              <button
                key={k}
                onClick={() => setActiveChart(k)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  activeChart === k
                    ? 'bg-red-600 text-white shadow-sm shadow-red-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#dc2626" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="time" {...axisStyle} />
              <YAxis {...axisStyle} />
              <Tooltip content={<LightTooltip />} />
              <Area
                type="monotone"
                dataKey={activeChart}
                stroke="#dc2626"
                strokeWidth={2.5}
                fill="url(#areaGrad)"
                dot={false}
                activeDot={{ r: 5, fill: '#dc2626', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        {/* ══════════════════════════════════
            SECTION 5 — BAR CHART + DONUT
        ══════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Monthly bar — 2/3 */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <PanelHeader title="Monthly Volume" sub="Subscriptions · Claims · Fraud flags per month" badge="6M" />
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyBar} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" {...axisStyle} />
                <YAxis {...axisStyle} />
                <Tooltip content={<LightTooltip />} />
                <Bar dataKey="subscriptions" fill="#dc2626" radius={[4,4,0,0]} />
                <Bar dataKey="claims"        fill="#fca5a5" radius={[4,4,0,0]} />
                <Bar dataKey="fraud"         fill="#fde68a" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            {/* legend */}
            <div className="flex gap-5 mt-4">
              {[['#dc2626','Subscriptions'],['#fca5a5','Claims'],['#fde68a','Fraud']].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
                  {l}
                </div>
              ))}
            </div>
          </div>

          {/* Donut — 1/3 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <PanelHeader title="Claims Status" sub="Distribution by outcome" />
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%" cy="50%"
                  innerRadius={52} outerRadius={78}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip content={<LightTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-3">
              {donutData.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-gray-500">{d.name}</span>
                  </div>
                  <span className="text-gray-900 font-bold">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            SECTION 6 — RISK MATRIX + FEED
        ══════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Zone risk matrix — 2/3 */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <PanelHeader title="Zone Risk Matrix" sub="Real-time disruption scores by delivery zone" />
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Zone','Risk','Score','Triggers','Active Workers','Disruption'].map(h => (
                      <th key={h} className="pb-3 text-left text-gray-400 font-bold uppercase tracking-wider pr-4 text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {riskMatrix.map((row, i) => (
                    <tr key={i} className="hover:bg-red-50 transition-colors">
                      <td className="py-3.5 pr-4 text-gray-900 font-semibold">{row.zone}</td>
                      <td className="py-3.5 pr-4"><RiskBadge risk={row.risk} /></td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${row.score * 100}%`,
                                background: row.score > 0.7 ? '#dc2626' : row.score > 0.5 ? '#d97706' : '#16a34a',
                              }}
                            />
                          </div>
                          <span className="text-gray-600 font-mono">{row.score.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`font-black ${row.triggers > 0 ? 'text-red-600' : 'text-gray-300'}`}>
                          {row.triggers}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-gray-600 font-mono">{row.active}</td>
                      <td className="py-3.5 text-gray-500">{row.disruption}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live activity feed — 1/3 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
            <PanelHeader title="Live Activity" sub="System events stream" />
            <div className="space-y-4 flex-1 overflow-y-auto max-h-64">
              {activityFeed.map(ev => (
                <div key={ev.id} className="flex gap-3 items-start">
                  <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ev.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 text-[11px] leading-relaxed">{ev.msg}</p>
                    <p className="text-gray-400 text-[10px] mt-0.5">{ev.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            SECTION 7 — BOTTOM METRICS STRIP
        ══════════════════════════════════ */}
        <section>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Operational Metrics</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FaClock,             label: 'Avg Payout Time', value: '2.4 min', delta: '-0.8%', up: false },
              { icon: FaCheckCircle,       label: 'Success Rate',    value: '98.5%',   delta: '+0.2%', up: true  },
              { icon: FaBolt,              label: 'Auto-Triggers',   value: '24',      delta: '+4',    up: true  },
              { icon: FaChartLine,         label: 'Pending Claims',  value: String(stats?.pending_claims ?? 12), delta: '-3', up: false },
            ].map((m, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:border-red-200 transition-colors">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <m.icon className="text-red-600 text-sm" />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{m.label}</p>
                  <p className="text-gray-900 text-xl font-black">{m.value}</p>
                  <span className={`text-[10px] font-bold flex items-center gap-0.5 mt-0.5 ${m.up ? 'text-green-600' : 'text-red-600'}`}>
                    {m.up ? <FaArrowUp className="text-[8px]" /> : <FaArrowDown className="text-[8px]" />}
                    {m.delta} vs last period
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

export default AdminDashboard
