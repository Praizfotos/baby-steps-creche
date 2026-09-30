import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { EXPO_OUT } from '@/lib/motion'

type Tone = 'light' | 'dark'

type Values = {
  name: string
  email: string
  phone: string
  age: string
  date: string
  message: string
}

const EMPTY: Values = { name: '', email: '', phone: '', age: '', date: '', message: '' }

const AGE_OPTIONS = [
  'Under 12 months',
  '12–18 months',
  '18 months – 2 years',
  '2–3 years',
  '3–4 years',
  '4–5 years',
]

function validate(v: Values) {
  const e: Partial<Record<keyof Values, string>> = {}
  if (v.name.trim().length < 2) e.name = 'Please tell us your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    e.email = 'Please enter a valid email address.'
  if (v.phone.trim().replace(/[^\d]/g, '').length < 6)
    e.phone = 'A number we can reach you on.'
  return e
}

const SHAPES = ['#E8266F', '#0FA79A', '#FFC94A']

function Confetti() {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <span className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 26 }).map((_, i) => {
        const angle = (i / 26) * Math.PI * 2 + (i % 3)
        const dist = 110 + ((i * 37) % 130)
        const size = 7 + ((i * 5) % 9)
        const round = i % 3
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              width: size,
              height: size,
              background: SHAPES[i % 3],
              borderRadius: round === 0 ? '50%' : round === 1 ? '3px' : '0 0 50% 50%',
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist + 70,
              opacity: [1, 1, 0],
              scale: 1,
              rotate: (i % 2 ? 1 : -1) * 220,
            }}
            transition={{ duration: 1.5 + (i % 5) * 0.14, ease: EXPO_OUT, delay: (i % 7) * 0.03 }}
          />
        )
      })}
    </span>
  )
}

export default function ContactForm({
  tone = 'light',
  compact = false,
  submitLabel = 'Request a callback',
  className = '',
}: {
  tone?: Tone
  compact?: boolean
  submitLabel?: string
  className?: string
}) {
  const reduce = useReducedMotion()
  const [values, setValues] = useState<Values>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')

  const dark = tone === 'dark'

  function set<K extends keyof Values>(k: K, v: string) {
    setValues((s) => ({ ...s, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }
  function blur<K extends keyof Values>(k: K) {
    setTouched((t) => ({ ...t, [k]: true }))
    const next = validate({ ...values })
    setErrors((e) => ({ ...e, [k]: next[k] }))
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    const next = validate(values)
    setErrors(next)
    setTouched({ name: true, email: true, phone: true })
    if (Object.values(next).some(Boolean)) return
    setState('sending')
    window.setTimeout(() => setState('done'), 1200)
  }

  const field = dark
    ? 'w-full rounded-[40px] border border-white/12 bg-white/[0.08] px-6 py-3.5 text-[15.5px] text-cream placeholder:text-cream/40 outline-none transition-all duration-300 focus:bg-white/[0.14] focus:scale-[1.01] focus:border-sun/50'
    : 'w-full rounded-[40px] border border-line bg-cream px-6 py-3.5 text-[15.5px] text-navy placeholder:text-navy-soft/60 outline-none transition-all duration-300 focus:border-pink/50 focus:bg-white focus:scale-[1.01]'

  const labelCls = dark
    ? 'mb-2 block text-[12.5px] font-bold uppercase tracking-[0.14em] text-cream/55'
    : 'mb-2 block text-[12.5px] font-bold uppercase tracking-[0.14em] text-navy-soft'

  const errCls = dark ? 'mt-2 block text-[13px] font-semibold text-sun' : 'mt-2 block text-[13px] font-semibold text-pink'

  function ErrorMsg({ msg, id }: { msg?: string; id: string }) {
    return (
      <span id={id} aria-live="polite" className="block min-h-[18px]">
        {msg ? <span className={errCls}>{msg}</span> : null}
      </span>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {state === 'done' ? (
          <motion.div
            key="done"
            className="relative overflow-hidden rounded-[30px] border border-sun/40 bg-white/70 p-9 text-center"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EXPO_OUT }}
            role="status"
            aria-live="polite"
          >
            <Confetti />
            <div className="relative">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal-soft text-teal-dark">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
                  <path
                    d="M5 13l4.5 4.5L19 7"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h3 className="mt-5 text-[26px]">Thank you — message sent</h3>
              <p className={`lede mx-auto mt-3 max-w-md ${dark ? 'text-cream/70' : ''}`}>
                We reply within one working day, usually sooner. If it is urgent, call us on{' '}
                <a href="tel:+493012345678" className="font-bold text-teal">
                  +49 30 1234 5678
                </a>
                .
              </p>
              <button
                type="button"
                onClick={() => {
                  setValues(EMPTY)
                  setTouched({})
                  setErrors({})
                  setState('idle')
                }}
                className="mt-6 rounded-full border-2 border-navy/15 px-6 py-2.5 text-[14.5px] font-semibold transition hover:border-navy/40 hover:bg-white"
              >
                Send another
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={submit}
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: EXPO_OUT }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="cf-name">
                  Parent's name
                </label>
                <input
                  id="cf-name"
                  className={field}
                  placeholder="First and last name"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => set('name', e.target.value)}
                  onBlur={() => blur('name')}
                  aria-invalid={!!errors.name}
                  aria-describedby="cf-name-err"
                />
                <ErrorMsg msg={touched.name ? errors.name : ''} id="cf-name-err" />
              </div>

              <div>
                <label className={labelCls} htmlFor="cf-phone">
                  Phone
                </label>
                <input
                  id="cf-phone"
                  type="tel"
                  className={field}
                  placeholder="+49 30 …"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  onBlur={() => blur('phone')}
                  aria-invalid={!!errors.phone}
                  aria-describedby="cf-phone-err"
                />
                <ErrorMsg msg={touched.phone ? errors.phone : ''} id="cf-phone-err" />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="cf-email">
                  Email
                </label>
                <input
                  id="cf-email"
                  type="email"
                  className={field}
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => set('email', e.target.value)}
                  onBlur={() => blur('email')}
                  aria-invalid={!!errors.email}
                  aria-describedby="cf-email-err"
                />
                <ErrorMsg msg={touched.email ? errors.email : ''} id="cf-email-err" />
              </div>

              <div>
                <label className={labelCls} htmlFor="cf-age">
                  Child's age
                </label>
                <select
                  id="cf-age"
                  className={field}
                  value={values.age}
                  onChange={(e) => set('age', e.target.value)}
                >
                  <option value="">Please choose</option>
                  {AGE_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!compact && (
              <div className="mt-4">
                <label className={labelCls} htmlFor="cf-date">
                  Preferred visit date
                </label>
                <input
                  id="cf-date"
                  type="date"
                  className={field}
                  value={values.date}
                  onChange={(e) => set('date', e.target.value)}
                />
              </div>
            )}

            <div className="mt-4">
              <label className={labelCls} htmlFor="cf-message">
                Message
              </label>
              <textarea
                id="cf-message"
                rows={compact ? 3 : 4}
                className={`${field} resize-none ${dark ? 'rounded-[28px]' : 'rounded-[28px]'}`}
                placeholder="Anything we should know — allergies, a tour date that suits you, questions about the rooms."
                value={values.message}
                onChange={(e) => set('message', e.target.value)}
              />
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <motion.button
                type="submit"
                disabled={state === 'sending'}
                whileHover={reduce ? undefined : { y: -3, scale: 1.03 }}
                whileTap={reduce ? undefined : { y: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: EXPO_OUT }}
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-sun px-8 py-4 text-[15.5px] font-bold text-navy shadow-[0_16px_34px_-18px_rgba(255,201,74,.95)] disabled:opacity-60"
              >
                <motion.span animate={{ rotate: state === 'sending' ? 360 : 0 }} transition={{ duration: 1, repeat: state === 'sending' ? Infinity : 0, ease: 'linear' }}>
                  {state === 'sending' ? '◌' : '→'}
                </motion.span>
                {state === 'sending' ? 'Sending…' : submitLabel}
              </motion.button>
              <p className={`text-[14.5px] ${dark ? 'text-cream/60' : 'text-navy-soft'}`}>
                Or call{' '}
                <a
                  href="tel:+493012345678"
                  className={`font-bold ${dark ? 'text-sun' : 'text-teal-dark'}`}
                >
                  +49 30 1234 5678
                </a>{' '}
                — we answer between 07:30 and 17:00.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
