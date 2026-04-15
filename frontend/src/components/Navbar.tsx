import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaHeartbeat, FaBars, FaTimes, FaMotorcycle, FaChartBar, FaClipboardList, FaGlobe, FaSignOutAlt } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../stores'

interface NavbarProps {
  onOpenLangPicker: () => void
}

const LANG_LABELS: Record<string, string> = {
  en: 'EN',
  ta: 'தமிழ்',
  hi: 'हिंदी',
}

const Navbar: React.FC<NavbarProps> = ({ onOpenLangPicker }) => {
  const location  = useLocation()
  const navigate  = useNavigate()
  const [open, setOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const { isAuthenticated, role, logout } = useAuth()

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/')
    setOpen(false)
  }

  // Role-based nav links
  const workerLinks = [
    { path: '/worker', label: t('nav_worker'), icon: FaMotorcycle, desc: 'Your coverage' },
  ]
  const adminLinks = [
    { path: '/admin',  label: t('nav_admin'),  icon: FaChartBar,      desc: 'Dashboard'     },
    { path: '/claims', label: t('nav_claims'), icon: FaClipboardList, desc: 'Manage claims' },
  ]
  const publicLinks = [
    { path: '/worker', label: t('nav_worker'), icon: FaMotorcycle,    desc: 'Your coverage' },
    { path: '/admin',  label: t('nav_admin'),  icon: FaChartBar,      desc: 'Dashboard'     },
    { path: '/claims', label: t('nav_claims'), icon: FaClipboardList, desc: 'Manage claims' },
  ]

  const links = !isAuthenticated ? publicLinks : role === 'worker' ? workerLinks : adminLinks

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-red-700 transition-colors">
              <FaHeartbeat className="text-white text-lg" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold text-red-600 tracking-tight">Carely</span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide">{t('nav_tagline')}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5">
            {links.map(link => {
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`group flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-red-600 text-white shadow-md shadow-red-200'
                      : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <link.icon className={`text-xs flex-shrink-0 ${active ? 'text-red-200' : 'text-red-400 group-hover:text-red-500'}`} />
                  <span>{link.label}</span>
                </Link>
              )
            })}

            {/* Language switcher */}
            <button
              onClick={onOpenLangPicker}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all border border-gray-200 hover:border-red-200 ml-1"
            >
              <FaGlobe className="text-red-400 text-xs" />
              <span className="text-xs">{LANG_LABELS[i18n.language] ?? 'EN'}</span>
            </button>

            {/* Logout — only when authenticated */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all border border-gray-200 hover:border-red-200"
              >
                <FaSignOutAlt className="text-xs" />
                <span className="text-xs">Logout</span>
              </button>
            )}
          </div>

          {/* Mobile right side */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenLangPicker}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200 transition-all"
            >
              <FaGlobe className="text-red-400 text-[10px]" />
              <span>{LANG_LABELS[i18n.language] ?? 'EN'}</span>
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              {open ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 pt-2 border-t border-red-50 space-y-1">
            {links.map(link => {
              const active = isActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <link.icon className={`text-sm ${active ? 'text-red-200' : 'text-red-400'}`} />
                  <div>
                    <p className="leading-none">{link.label}</p>
                    <p className={`text-[10px] mt-0.5 ${active ? 'text-red-200' : 'text-gray-400'}`}>{link.desc}</p>
                  </div>
                </Link>
              )
            })}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all"
              >
                <FaSignOutAlt className="text-sm text-red-400" />
                <p className="leading-none">Logout</p>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
