/* ==========================================================================
   motion.ts — shared animation primitives (motion/react only)
   Transform + opacity only. Every component respects useReducedMotion.
   ========================================================================== */
import { useRef, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from 'motion/react'

export const EXPO_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number]
export const EASE_OUT = [0, 0, 0.2, 1] as [number, number, number, number]

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  x?: number
  scale?: number
  once?: boolean
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'footer'
}

/** Scroll reveal. Fires once, then unmounts from the observer. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  x = 0,
  scale = 1,
  once = true,
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion()
  const Tag = motion[as] as typeof motion.div
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y, x, scale }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, ease: EXPO_OUT, delay }}
    >
      {children}
    </Tag>
  )
}

export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}

export const staggerChild = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EXPO_OUT } },
}

/** Parent that reveals its children one after another. */
export function StaggerGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  )
}

/** Wraps a button/link and gives it a soft magnetic pull toward the cursor. */
export function MagneticButton({
  children,
  className,
  strength = 0.32,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  function move(e: ReactMouseEvent) {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      style={reduce ? undefined : { x: sx, y: sy, display: 'inline-block' }}
      onMouseMove={move}
      onMouseLeave={reset}
    >
      {children}
    </motion.span>
  )
}

type PillVariant = 'pink' | 'teal' | 'navy' | 'sun' | 'outline'

const PILL: Record<PillVariant, string> = {
  pink: 'bg-pink text-white hover:bg-pink-dark shadow-[0_14px_30px_-16px_rgba(232,38,111,.9)]',
  teal: 'bg-teal text-white hover:bg-teal-dark shadow-[0_14px_30px_-16px_rgba(15,167,154,.9)]',
  navy: 'bg-navy text-cream hover:bg-[#171530]',
  sun: 'bg-sun text-navy hover:brightness-[1.06] shadow-[0_14px_30px_-16px_rgba(255,201,74,.9)]',
  outline:
    'bg-transparent text-navy border-2 border-navy/15 hover:border-navy/40 hover:bg-white',
}

/** The brand pill CTA. Renders as a router link (`to`) or a button (`onClick`). */
export function PillCTA({
  children,
  to,
  href,
  variant = 'pink',
  className = '',
  onClick,
  type,
  disabled,
  ariaLabel,
}: {
  children: ReactNode
  to?: string
  href?: string
  variant?: PillVariant
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  ariaLabel?: string
}) {
  const reduce = useReducedMotion()
  const base =
    'group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-[15px] font-semibold transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed'
  const cls = `${base} ${PILL[variant]} ${className}`

  const inner = (
    <>
      <span>{children}</span>
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </>
  )

  const hover = reduce ? {} : { y: -3, scale: 1.03 }
  const tap = reduce ? {} : { y: 0, scale: 0.98 }

  return (
    <MagneticButton className="inline-block">
      <motion.span
        className="inline-block"
        whileHover={hover}
        whileTap={tap}
        transition={{ duration: 0.3, ease: EXPO_OUT }}
      >
        {to ? (
          <Link to={to} className={cls} aria-label={ariaLabel} onClick={onClick}>
            {inner}
          </Link>
        ) : href ? (
          <a href={href} className={cls} aria-label={ariaLabel} onClick={onClick}>
            {inner}
          </a>
        ) : (
          <button type={type ?? 'button'} disabled={disabled} className={cls} onClick={onClick}>
            {inner}
          </button>
        )}
      </motion.span>
    </MagneticButton>
  )
}

/** Fade + rise used for one-off elements entering on mount. */
export function Enter({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EXPO_OUT, delay }}
    >
      {children}
    </motion.div>
  )
}

export type { HTMLMotionProps }
