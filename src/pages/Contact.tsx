import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  ArrowUp,
  MessageCircle,
  Users,
  KeyRound,
  TrainFront,
  TramFront,
  Bike,
} from 'lucide-react'
import { usePageMeta, SectionHead, Wave, Footprints, Tag } from '@/components/ui'
import ContactForm from '@/components/ContactForm'
import { Reveal, StaggerGroup, StaggerItem, PillCTA, Enter, EXPO_OUT } from '@/lib/motion'

/* ---------------------------------------------------------------- data ---- */
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Kastanienallee+24,+10435+Berlin'

type ContactRow = {
  icon: typeof Phone
  t: string
  href?: string
  v: string
  note: string
}

const CONTACT_ROWS: ContactRow[] = [
  {
    icon: Phone,
    t: 'Phone',
    href: 'tel:+493012345678',
    v: '+49 30 1234 5678',
    note: 'Answered Mon – Fri, 07:30 – 17:00',
  },
  {
    icon: Mail,
    t: 'Email',
    href: 'mailto:hello@babysteps.de',
    v: 'hello@babysteps.de',
    note: 'We reply within one working day',
  },
  {
    icon: Clock,
    t: 'Opening hours',
    v: 'Mon – Fri 07:30 – 17:00\nTours 10:00 Tue & Thu',
    note: 'Late pick-up by arrangement',
  },
]

const ARRIVAL = [
  { icon: TrainFront, t: 'U2', p: 'Eberswalder Straße, 6 minutes on foot' },
  { icon: TramFront, t: 'Tram M1', p: 'Kollwitzstraße, past the park' },
  { icon: Bike, t: 'Bikes', p: 'Racks behind the courtyard gate' },
]

const NEXT_STEPS = [
  {
    icon: MessageCircle,
    t: 'We reply within a day',
    p: 'A person, not an autoresponder — usually the same day, with a tour slot that suits you.',
  },
  {
    icon: Users,
    t: 'You visit and meet the team',
    p: 'Tuesday or Thursday at 10:00. Forty minutes, three families at a time, your child with you.',
  },
  {
    icon: KeyRound,
    t: 'Trial days and enrollment',
    p: 'Two or three settling-in mornings at your child’s pace, then the Kita-Gutschein paperwork.',
  },
]

/* -------------------------------------------------------------- helpers ---- */
function Line({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useReducedMotion()
  return (
    <span className="block overflow-hidden pb-1">
      <motion.span
        className="block"
        initial={reduce ? false : { y: '110%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 0.9, ease: EXPO_OUT, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

function MapArt() {
  const reduce = useReducedMotion()
  return (
    <svg
      viewBox="0 0 640 420"
      role="img"
      aria-label="Stylised street map of Kastanienallee 24 in Prenzlauer Berg, with the walking route from the U-Bahn and a pin on Baby Steps"
      className="block h-auto w-full"
    >
      <rect width="640" height="420" fill="#FFF0E0" />

      {/* park + blocks */}
      <rect x="468" y="118" width="152" height="126" rx="18" fill="#DFF6F2" />
      <text x="544" y="186" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0A7C72">
        Volkspark
      </text>
      <rect x="34" y="124" width="142" height="108" rx="14" fill="#FFE3EE" />
      <rect x="250" y="124" width="150" height="108" rx="14" fill="#FFC94A" opacity="0.4" />
      <rect x="34" y="300" width="142" height="86" rx="14" fill="#DFF6F2" />
      <rect x="468" y="300" width="152" height="86" rx="14" fill="#FFE3EE" />

      {/* streets */}
      <g fill="none" stroke="#FFFFFF" strokeLinecap="round">
        <path d="M0 96H640" strokeWidth="16" />
        <path d="M0 270H640" strokeWidth="30" />
        <path d="M210 0V420" strokeWidth="24" />
        <path d="M440 0V420" strokeWidth="16" />
      </g>

      <text x="40" y="277" fontSize="15" fontWeight="700" fill="#5B5872">
        Kastanienallee
      </text>
      <text x="474" y="102" fontSize="13" fontWeight="600" fill="#5B5872">
        Oderberger Straße
      </text>
      <text transform="translate(436 40) rotate(90)" fontSize="13" fontWeight="600" fill="#5B5872">
        Dunckerstraße
      </text>

      {/* walking route */}
      <path
        d="M210 371V270h76"
        fill="none"
        stroke="#0FA79A"
        strokeWidth="5"
        strokeDasharray="11 9"
        strokeLinecap="round"
      />
      <circle cx="210" cy="386" r="15" fill="#0FA79A" />
      <text
        x="210"
        y="391"
        textAnchor="middle"
        fontSize="14"
        fontWeight="800"
        fill="#FFFFFF"
        letterSpacing="0.5"
      >
        U
      </text>
      <text x="210" y="417" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#5B5872">
        U2 · 6 min walk
      </text>

      {/* pin */}
      <g transform="translate(300 270)">
        <ellipse cx="0" cy="4" rx="16" ry="6" fill="#242138" opacity="0.16" />
        <motion.g
          animate={reduce ? undefined : { y: [0, -12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M0 0c0 0-17-19-17-32a17 17 0 1 1 34 0C17-19 0 0 0 0z" fill="#E8266F" />
          <circle cx="0" cy="-32" r="7" fill="#FFFFFF" />
        </motion.g>
      </g>
    </svg>
  )
}

/* ---------------------------------------------------------------- page ---- */
export default function Contact() {
  usePageMeta(
    'Contact & Visits — Baby Steps Creche, Prenzlauer Berg',
    'Kastanienallee 24, 10435 Berlin. Tours at 10:00 on Tuesday and Thursday. Call +49 30 1234 5678 or send a message — we reply within one working day.',
  )

  const reduce = useReducedMotion()
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative">
        <div className="wrap grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10 lg:pb-20 lg:pt-16">
          <div className="relative z-10">
            <p className="eyebrow">
              <svg viewBox="0 0 24 30" width="13" height="17" fill="none" aria-hidden="true">
                <path
                  d="M12 2C8 2 6 6 6 10c0 3 1.2 4.5 1.2 7 0 4-2.8 5-2.8 8.5 0 1.5 1.2 2.5 3 2.5 3 0 4.6-2 4.6-2s1.6 2 4.6 2c1.8 0 3-1 3-2.5 0-3.5-2.8-4.5-2.8-8.5 0-2.5 1.2-4 1.2-7 0-4-2-8-6-8z"
                  fill="currentColor"
                />
              </svg>
              STEP 06 · Visit Us
            </p>

            <h1 className="display mt-5">
              <Line delay={0.05}>Let's take the{' '}</Line>
              <Line delay={0.16}>first step{' '}</Line>
              <Line delay={0.27}>together</Line>
            </h1>

            <Enter delay={0.5} className="mt-7 max-w-xl">
              <p className="lede">
                Tours run Tuesday and Thursday at 10:00 — forty minutes, three families, your child
                with you. Tell us who you are and we hold a slot.
              </p>
            </Enter>

            <Enter delay={0.62} className="mt-9 flex flex-wrap items-center gap-4">
              <PillCTA href="tel:+493012345678" variant="pink">
                Call +49 30 1234 5678
              </PillCTA>
              <PillCTA href="#message" variant="outline">
                Send a message
              </PillCTA>
            </Enter>

            <Enter
              delay={0.78}
              className="mt-8 flex items-center gap-3 text-[13.5px] font-semibold uppercase tracking-[0.16em] text-navy-soft"
            >
              <span className="h-8 w-px bg-line" aria-hidden="true" />
              One reply, one working day
            </Enter>
          </div>

          {/* floating art + tour card, the card crosses into the navy section */}
          <div className="relative z-10 lg:-mb-52">
            <div className="relative mx-auto aspect-square w-full max-w-[440px] rounded-full bg-cream-deep">
              <motion.span
                aria-hidden="true"
                className="absolute -right-2 top-6 h-16 w-16 rounded-full border-[10px] border-teal/35 sm:h-20 sm:w-20"
                initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: EXPO_OUT, delay: 0.45 }}
              />
              <motion.span
                aria-hidden="true"
                className="absolute bottom-8 left-3 h-12 w-12 rounded-2xl bg-pink-soft sm:h-14 sm:w-14"
                initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: 12 }}
                animate={{ opacity: 1, scale: 1, rotate: 12 }}
                transition={{ duration: 0.8, ease: EXPO_OUT, delay: 0.58 }}
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-0"
                animate={reduce ? undefined : { y: [0, -18, 0], rotate: [0, 3, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Footprints className="left-[24%] top-[16%]" count={4} color="#E8266F" />
              </motion.div>
            </div>

            <div className="relative z-10 mx-auto mt-7 max-w-[440px] rounded-[26px] border border-line bg-white p-6 shadow-lift sm:p-7">
              <p className="eyebrow eyebrow-teal">Next tours</p>
              <p className="mt-3 font-heading text-[30px] font-extrabold leading-none">
                {'Tue & Thu · 10:00'}
              </p>
              <p className="mt-2.5 text-[15px] leading-relaxed text-navy-soft">
                Forty minutes in the rooms while they are full. Bring your child — the rooms say
                more than this page can.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Tag tone="pink">Step-free entry</Tag>
                <Tag tone="sun">Buggy storage</Tag>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Wave from="#FFF9F1" to="#242138" />

      {/* ============================ FORM ============================ */}
      <section className="section bg-navy lg:pt-44" id="message">
        <div className="wrap">
          <SectionHead
            kicker="Send a message"
            title="Tell us about your child"
            lede="Age, the week you would like to start, and anything we should know — allergies, a sibling already here, a Tuesday that suits you."
            align="center"
            tone="cream"
          />

          <Reveal
            delay={0.08}
            className="mx-auto mt-10 max-w-3xl rounded-[30px] border border-white/10 bg-white/[0.05] p-6 sm:p-8 lg:p-10"
          >
            <ContactForm tone="dark" submitLabel="Send message" />
          </Reveal>

          <Reveal delay={0.16} className="mt-7 flex flex-wrap justify-center gap-3">
            <span className="pill-note">Reply within one working day</span>
            <span className="pill-note">Tours 10:00 Tue &amp; Thu</span>
            <span className="pill-note">No obligation</span>
          </Reveal>
        </div>
      </section>

      <Wave from="#242138" to="#FFF0E0" />

      {/* ========================== INFO PANEL ========================== */}
      <section className="section bg-cream-deep" id="visit">
        <div className="wrap">
          <SectionHead
            kicker="Find us"
            title="The corner house with the red door"
            lede="Kastanienallee 24, between Dunckerstraße and the park. Buzzer 4, step-free from the pavement."
          />

          <Reveal
            delay={0.06}
            className="mt-10 grid overflow-hidden rounded-[30px] border border-line bg-white shadow-lift lg:grid-cols-[1.02fr_0.98fr]"
          >
            <div className="p-7 lg:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-pink-soft text-pink">
                <MapPin size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-[26px]">Baby Steps Creche &amp; Daycare</h3>
              <address className="mt-2 text-[17px] not-italic leading-relaxed text-navy-soft">
                Kastanienallee 24
                <br />
                10435 Berlin
                <br />
                Prenzlauer Berg
              </address>
              <div className="mt-5 flex flex-wrap gap-2">
                <Tag tone="teal">Step-free entry</Tag>
                <Tag tone="sun">Buzzer 4</Tag>
                <Tag tone="pink">Buggy storage</Tag>
              </div>
            </div>

            <div className="border-t border-line lg:border-l lg:border-t-0">
              {CONTACT_ROWS.map((r) => (
                <div
                  key={r.t}
                  className="flex gap-4 border-b border-line px-6 py-6 last:border-b-0 sm:px-7"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-cream-deep text-teal-dark">
                    <r.icon size={19} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-heading text-[17px] font-bold">{r.t}</h3>
                    {r.href ? (
                      <a
                        href={r.href}
                        className="mt-1 block break-words text-[16.5px] font-semibold text-pink transition-transform duration-300 hover:translate-x-1 hover:text-pink-dark"
                      >
                        {r.v}
                      </a>
                    ) : (
                      <p className="mt-1 whitespace-pre-line text-[16.5px] font-semibold text-navy">
                        {r.v}
                      </p>
                    )}
                    <p className="mt-1 text-[14px] text-navy-soft">{r.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Wave from="#FFF0E0" to="#FFFFFF" />

      {/* =========================== MAP CARD =========================== */}
      <section className="section bg-white" id="map">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
          <div>
            <SectionHead
              kicker="Getting here"
              title="Six minutes from Eberswalder Straße"
              lede="Come by U-Bahn, tram or bike. The courtyard gate is the one with the red door beside it."
            />

            <ul className="mt-7 space-y-3.5">
              {ARRIVAL.map((a) => (
                <li key={a.t} className="flex items-start gap-3.5 text-[15.5px] text-navy-soft">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-teal-soft text-teal-dark">
                    <a.icon size={15} aria-hidden="true" />
                  </span>
                  <span>
                    <strong className="font-bold text-navy">{a.t}</strong> — {a.p}
                  </span>
                </li>
              ))}
            </ul>

            <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-2.5 rounded-full bg-pink px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_14px_30px_-16px_rgba(232,38,111,.9)] transition-colors duration-300 hover:bg-pink-dark"
              >
                Get directions
                <Navigation
                  size={17}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
              <span className="text-[14.5px] text-navy-soft">Opens in a new tab</span>
            </Reveal>
          </div>

          <Reveal
            x={40}
            className="relative overflow-hidden rounded-[30px] border border-line bg-cream-deep shadow-lift"
          >
            <MapArt />
            <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13.5px] font-bold shadow-lift">
              <MapPin size={14} className="text-pink" aria-hidden="true" />
              Kastanienallee 24
            </span>
          </Reveal>
        </div>
      </section>

      <Wave from="#FFFFFF" to="#FFF9F1" />

      {/* ======================= WHAT HAPPENS NEXT ======================= */}
      <section className="section bg-cream" id="next">
        <div className="wrap">
          <SectionHead
            kicker="What happens next"
            title="Three steps, then a first day"
            lede="Nothing is held until you have seen the rooms and your child has had a morning here."
            align="center"
          />

          <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.12}>
            {NEXT_STEPS.map((s, i) => (
              <StaggerItem key={s.t}>
                <article className="relative h-full rounded-[26px] border border-line bg-white p-7 transition-shadow duration-300 hover:shadow-lift">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-pink-soft text-pink">
                    <s.icon size={19} aria-hidden="true" />
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute right-6 top-6 font-heading text-[34px] font-extrabold leading-none text-pink/20"
                  >
                    {`0${i + 1}`}
                  </span>
                  <h3 className="mt-5 font-heading text-[22px]">{s.t}</h3>
                  <p className="mt-2.5 text-[15.5px] leading-relaxed text-navy-soft">{s.p}</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal delay={0.1} className="mt-9 text-center text-[15.5px] text-navy-soft">
            Still weighing it up?{' '}
            <Link to="/faq" className="font-bold text-pink underline-offset-4 hover:underline">
              The FAQ covers fees, vouchers and settling-in
            </Link>
            .
          </Reveal>
        </div>
      </section>

      {/* =========================== SOCIALS =========================== */}
      <section className="bg-pink-soft py-12 sm:py-14" aria-labelledby="socials-title">
        <div className="wrap flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">Follow the day</p>
            <h2 id="socials-title" className="mt-3 font-heading text-[28px] sm:text-[32px]">
              Garden mornings, craft afternoons
            </h2>
            <p className="mt-2 max-w-xl text-[15.5px] text-navy-soft">
              The walk to the duck pond, the mud kitchen, and whatever came out of the paint tray.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.instagram.com/praizfotos/"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-11 items-center rounded-full border border-navy/12 bg-white px-5 text-[14.5px] font-semibold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-pink hover:bg-pink hover:text-white"
            >
              Instagram
            </a>
            <a
              href="https://web.facebook.com/praiz.asala.1"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex h-11 items-center rounded-full border border-navy/12 bg-white px-5 text-[14.5px] font-semibold text-navy transition-all duration-300 hover:-translate-y-0.5 hover:border-pink hover:bg-pink hover:text-white"
            >
              Facebook
            </a>
          </div>
        </div>
      </section>

      {/* ========================= SCROLL TO TOP ========================= */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="to-top"
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.8 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.8 }}
            whileHover={reduce ? undefined : { y: -3, scale: 1.1 }}
            transition={{ duration: 0.35, ease: EXPO_OUT }}
            className="fixed bottom-6 right-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-navy shadow-lift transition-transform duration-300 hover:scale-110 sm:bottom-8 sm:right-8"
          >
            <ArrowUp size={18} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
