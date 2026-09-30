import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Menu, X, Phone } from 'lucide-react'
import { PillCTA, EXPO_OUT } from '@/lib/motion'

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programs' },
  { to: '/day-here', label: 'A Day Here' },
  { to: '/facility', label: 'Facility' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="Baby Steps — home">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-pink text-white transition-transform duration-300 group-hover:-rotate-6">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
          <ellipse cx="9" cy="7.5" rx="3.1" ry="4.2" />
          <ellipse cx="15.4" cy="11" rx="2.6" ry="3.6" />
          <path d="M6.4 15.6c0-2.4 1.6-4.3 3.6-4.3s3.5 1.7 3.5 3.9c0 2.5-1.4 4.6-3.5 4.6s-3.6-1.9-3.6-4.2z" />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={`block font-heading text-[21px] font-extrabold tracking-tight ${
            dark ? 'text-cream' : 'text-navy'
          }`}
        >
          Baby Steps
        </span>
        <span className="block text-[10.5px] font-semibold uppercase tracking-[0.2em] text-pink">
          Creche &amp; Daycare
        </span>
      </span>
    </Link>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const link = ({ isActive }: { isActive: boolean }) =>
    `relative text-[15px] font-semibold transition-colors duration-200 ${
      isActive ? 'text-pink' : 'text-navy-soft hover:text-navy'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-cream/90 backdrop-blur-md">
      <div className="wrap flex h-[74px] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={link} end={n.to === '/'}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+493012345678"
            className="hidden items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[14px] font-semibold text-navy transition hover:border-pink/40 hover:text-pink xl:inline-flex"
          >
            <Phone size={15} aria-hidden="true" /> +49 30 1234 5678
          </a>
          <Link
            to="/contact"
            className="hidden rounded-full bg-pink px-5 py-2.5 text-[14.5px] font-semibold text-white transition-colors duration-300 hover:bg-pink-dark md:inline-block"
          >
            Book a tour
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-navy lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            className="border-t border-line bg-cream lg:hidden"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EXPO_OUT }}
            style={{ overflow: 'hidden' }}
          >
            <nav aria-label="Mobile" className="wrap flex flex-col gap-1 py-4">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.4, ease: EXPO_OUT }}
                >
                  <NavLink
                    to={n.to}
                    end={n.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-2xl px-4 py-3 text-[17px] font-semibold ${
                        isActive ? 'bg-pink-soft text-pink' : 'text-navy hover:bg-cream-deep'
                      }`
                    }
                  >
                    {n.label}
                    <span aria-hidden="true">→</span>
                  </NavLink>
                </motion.div>
              ))}
              <div className="mt-3 px-4">
                <PillCTA to="/contact" variant="pink" className="w-full">
                  Book a tour
                </PillCTA>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
