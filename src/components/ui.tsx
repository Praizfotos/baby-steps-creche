import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useReducedMotion, AnimatePresence, motion } from 'motion/react'
import { Reveal, EXPO_OUT } from '@/lib/motion'

/* --------------------------------------------------------------------------
   Page <title> + meta description
   -------------------------------------------------------------------------- */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', description)
  }, [title, description])
}

/* --------------------------------------------------------------------------
   Scroll to top on route change
   -------------------------------------------------------------------------- */
export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

/* --------------------------------------------------------------------------
   Section pattern: STEP 0X eyebrow + big Baloo heading + short paragraph
   -------------------------------------------------------------------------- */
export function SectionHead({
  step,
  kicker,
  title,
  lede,
  align = 'left',
  tone = 'pink',
  className = '',
  id,
}: {
  step?: string
  kicker?: string
  title: ReactNode
  lede?: ReactNode
  align?: 'left' | 'center'
  tone?: 'pink' | 'teal' | 'sun' | 'cream'
  className?: string
  id?: string
}) {
  const eyebrowTone =
    tone === 'teal'
      ? 'text-teal'
      : tone === 'sun'
        ? 'text-[#c98b00]'
        : tone === 'cream'
          ? 'text-sun'
          : 'text-pink'

  return (
    <div
      className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}
    >
      {(step || kicker) && (
        <p className={`eyebrow ${eyebrowTone} ${align === 'center' ? 'justify-center' : ''}`}>
          {step ? `${step}${kicker ? ` · ${kicker}` : ''}` : kicker}
        </p>
      )}
      <h2 id={id} className="h2 mt-4">
        {title}
      </h2>
      {lede && <p className="lede mt-5">{lede}</p>}
    </div>
  )
}

/* --------------------------------------------------------------------------
   Wavy divider — put it as the last child of a section.
   `from` paints the wave's own background, `to` paints the shape below it.
   -------------------------------------------------------------------------- */
const PATH =
  'M0,44 C170,86 330,8 520,30 C700,52 840,96 1040,58 C1210,26 1330,44 1440,60 L1440,100 L0,100 Z'

export function Wave({
  from,
  to,
  flip = false,
  className = '',
}: {
  from: string
  to: string
  flip?: boolean
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={`wave ${className}`}
      style={{ background: from, transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" focusable="false">
        <path d={PATH} fill={to} />
      </svg>
    </div>
  )
}

/* --------------------------------------------------------------------------
   Animated counter
   -------------------------------------------------------------------------- */
export function Counter({
  to,
  duration = 1.4,
  prefix = '',
  suffix = '',
  className = '',
}: {
  to: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0

    const run = () => {
      if (started.current) return
      started.current = true
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setN(to)
        return
      }
      const start = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / (duration * 1000))
        const eased = 1 - Math.pow(1 - p, 3)
        setN(Math.round(to * eased))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) run()
    }

    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {n}
      {suffix}
    </span>
  )
}

/* --------------------------------------------------------------------------
   Overlapping pull quote — floats across a section boundary
   -------------------------------------------------------------------------- */
export function PullQuote({
  children,
  cite,
  className = '',
}: {
  children: ReactNode
  cite?: string
  className?: string
}) {
  return (
    <Reveal className={className}>
      <figure className="relative rounded-[30px] border border-line bg-white p-8 shadow-lift sm:p-10">
        <span
          aria-hidden="true"
          className="absolute -top-7 left-8 font-heading text-[86px] leading-none text-pink/20"
        >
          “
        </span>
        <blockquote className="relative font-heading text-[clamp(21px,2.4vw,29px)] font-bold leading-snug text-navy">
          {children}
        </blockquote>
        {cite && (
          <figcaption className="mt-5 text-[14px] font-semibold uppercase tracking-[0.14em] text-navy-soft">
            {cite}
          </figcaption>
        )}
      </figure>
    </Reveal>
  )
}

/* --------------------------------------------------------------------------
   Small labeled pill used for ages, times, room labels
   -------------------------------------------------------------------------- */
export function Tag({
  children,
  tone = 'pink',
  className = '',
}: {
  children: ReactNode
  tone?: 'pink' | 'teal' | 'sun' | 'navy' | 'white'
  className?: string
}) {
  const tones = {
    pink: 'bg-pink-soft text-pink-dark',
    teal: 'bg-teal-soft text-teal-dark',
    sun: 'bg-sun/25 text-[#8a5f00]',
    navy: 'bg-navy text-cream',
    white: 'bg-white text-navy border border-line',
  }
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-bold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

/* --------------------------------------------------------------------------
   Decorative footprint trail (aria-hidden)
   -------------------------------------------------------------------------- */
export function Footprints({
  className = '',
  count = 5,
  color = '#E8266F',
}: {
  className?: string
  count?: number
  color?: string
}) {
  return (
    <span className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={16}
          height={16}
          fill={color}
          className="absolute"
          style={{
            left: `${(i % 3) * 46}px`,
            top: `${i * 54}px`,
            transform: `rotate(${i % 2 ? 18 : -14}deg)`,
            opacity: 0.28 + (i % 3) * 0.14,
          }}
        >
          <ellipse cx="9" cy="7.5" rx="3.1" ry="4.2" />
          <ellipse cx="15.4" cy="11" rx="2.6" ry="3.6" />
          <path d="M6.4 15.6c0-2.4 1.6-4.3 3.6-4.3s3.5 1.7 3.5 3.9c0 2.5-1.4 4.6-3.5 4.6s-3.6-1.9-3.6-4.2z" />
        </svg>
      ))}
    </span>
  )
}

/* --------------------------------------------------------------------------
   Collapsible — smooth height accordion body (used by FAQ blocks)
   -------------------------------------------------------------------------- */
export function Collapsible({
  show,
  children,
  className = '',
}: {
  show: boolean
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          className={className}
          initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: EXPO_OUT }}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
