
import React from 'react'
import { Link } from 'react-router-dom'
import { FaShieldAlt, FaBolt, FaHeartbeat, FaChartLine, FaArrowRight, FaCheck } from 'react-icons/fa'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-32 md:py-40 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">GigShield AI</span>
            </h1>
            <p className="text-2xl md:text-3xl text-slate-300 mb-8 font-light">
              Parametric Insurance for Gig Workers
            </p>
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Instant protection against income disruption. Get covered, get verified, get paid—all in minutes using AI-powered risk assessment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/worker" className="btn-primary flex items-center justify-center gap-2 group">
                Worker Portal
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/admin" className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-slate-900 hover:-translate-y-1">
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="text-gradient">Why Choose GigShield?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: FaBolt, title: 'Instant Claims', desc: 'No paperwork. Automatic detection and verification.', color: 'cyan' },
            { icon: FaChartLine, title: 'AI Powered', desc: 'ML models detect disruptions in real-time.', color: 'purple' },
            { icon: FaHeartbeat, title: 'Always Available', desc: 'Coverage when you need it most.', color: 'pink' },
            { icon: FaShieldAlt, title: 'Fraud Protected', desc: 'Advanced fraud detection keeps everyone safe.', color: 'green' },
          ].map((feature, i) => {
            const Icon = feature.icon
            const colorMap: { [key: string]: string } = {
              cyan: 'from-cyan-500 to-blue-500',
              purple: 'from-purple-500 to-pink-500',
              pink: 'from-pink-500 to-red-500',
              green: 'from-green-500 to-emerald-500',
            }
            return (
              <div key={i} className="card-glass group hover:shadow-glow-purple">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colorMap[feature.color]} flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-boldtext-center mb-16">
          <span className="text-gradient">How It Works</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Subscribe', desc: 'Choose a coverage plan tailored to your needs' },
            { step: '02', title: 'Get Protected', desc: 'Instant coverage starts immediately' },
            { step: '03', title: 'Claim & Earn', desc: 'Get paid within minutes of disruption detection' },
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="card-glass text-center h-full">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <FaArrowRight className="text-cyan-500 text-3xl" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { value: '100K+', label: 'Happy Workers' },
            { value: '₹5Cr+', label: 'Claims Processed' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat, i) => (
            <div key={i} className="stat-card text-center">
              <div className="text-4xl font-bold text-cyan-300 mb-2">{stat.value}</div>
              <div className="text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="card-glass border-2 border-cyan-400/50 text-center py-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Protected?</h2>
          <p className="text-slate-400 mb-8">Join thousands of gig workers earning with confidence</p>
          <Link to="/worker" className="btn-primary inline-flex items-center justify-center gap-2">
            Start Your First Claim
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
