import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, AnimatePresence } from 'motion/react'
import { usePageMeta, SectionHead, Wave, Tag } from '@/components/ui'
import { Photo } from '@/components/Photo'
import { IMAGES, type ImageKey } from '@/lib/images'
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
  PillCTA,
  EXPO_OUT,
  EASE_OUT,
} from '@/lib/motion'

/* ---------------------------------------------------------------- data ---- */

type ScheduleRow = { time: string; t: string; p: string }

const AGE_TABS: {
  id: string
  label: string
  age: string
  tabAge: string
  p: string
  slot: ImageKey
  alt: string
  rows: ScheduleRow[]
}[] = [
  {
    id: 'sprouts',
    label: 'Little Sprouts',
    age: '6 – 18 months',
    tabAge: '6–18m',
    p: 'Feeds and naps follow the schedule you already have at home. The first weeks are about trust, so nothing gets hurried and nobody is weaned on our calendar.',
    slot: 'prog1',
    alt: 'A baby laughing while lying beside a red balloon',
    rows: [
      { time: '07:30', t: 'Bottle or breakfast', p: 'On your rhythm, held in arms if that is what works.' },
      { time: '09:30', t: 'Floor play', p: 'Mirror wall, water tray, low climbing frames, one key adult.' },
      { time: '11:00', t: 'Naps on cots', p: 'Lights down, white noise on, sleeps logged for your note.' },
      { time: '15:00', t: 'Fruit and bread', p: 'Soft pieces at the table, self-fed with a hand nearby.' },
    ],
  },
  {
    id: 'toddlers',
    label: 'Toddlers',
    age: '18 months – 3 years',
    tabAge: '18m–3y',
    p: 'The age of “me do it”. The day is built from short, repeatable tasks — hanging coats, setting cups, shoes in the basket — with the time to finish them.',
    slot: 'blocks',
    alt: 'A child’s hand stacking illustrated picture blocks into a tower',
    rows: [
      { time: '09:00', t: 'Circle and songs', p: 'German and English, the weather chart, the same eight songs.' },
      { time: '10:00', t: 'Outside, two hours', p: 'Buckets, bikes, the mud kitchen — Matschhose when it rains.' },
      { time: '13:00', t: 'Rest, then books', p: 'Cots for the sleepers, a quiet corner for the rest.' },
      { time: '15:00', t: 'Snack they help set', p: 'Cups and plates to the table, then the daily update.' },
    ],
  },
  {
    id: 'prek',
    label: 'Pre-K',
    age: '3 – 5 years',
    tabAge: '3–5y',
    p: 'Letters, numbers and long projects — building a shop, growing cress, posting letters on Schönhauser Allee. School readiness comes out of real tasks, not worksheets.',
    slot: 'prog3',
    alt: 'Two young girls reading a picture book together outdoors',
    rows: [
      { time: '09:00', t: 'Project hour', p: 'One idea for weeks at a time, kept in a folder the child owns.' },
      { time: '10:15', t: 'Walk to the park', p: 'Volkspark four minutes away, in every weather, in a group of six.' },
      { time: '13:30', t: 'Quiet hour', p: 'Books, puzzles and drawing — the practice of sitting still.' },
      { time: '15:00', t: 'Snack and handover', p: 'The day’s photo, the day’s note, a transition plan from the spring.' },
    ],
  },
]

type TimelineSlot = {
  time: string
  t: string
  p: string
  see: string
  tone: string
  icon: ReactNode
}

const TIMELINE: TimelineSlot[] = [
  {
    time: '7:30 AM',
    t: 'Drop-off & Free Play',
    p: 'Coats into baskets, breakfast at the big table, and whatever is out on the floor that morning. Handovers are unhurried — we would rather you stayed an extra five minutes.',
    see: 'A hello at the door, and a first line in your update by 9:00.',
    tone: 'bg-pink-soft text-pink-dark',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5.5 8.5h13v11h-13z" />
        <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
        <path d="M12 12.5v3" />
      </svg>
    ),
  },
  {
    time: '9:00 AM',
    t: 'Morning Circle',
    p: 'Songs in German and English, the weather chart, then one long activity — painting, water play, or the project of the week. Nobody has to sit still for it.',
    see: 'The song from circle time, so it keeps playing at home.',
    tone: 'bg-teal-soft text-teal-dark',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="9" r="2.6" />
        <circle cx="16.6" cy="10" r="2" />
        <path d="M3.8 18.6a5.4 5.4 0 0 1 10.4 0" />
        <path d="M15.2 18.6a4.6 4.6 0 0 1 5.2-4.2" />
      </svg>
    ),
  },
  {
    time: '10:00 AM',
    t: 'Outdoor Play',
    p: 'Two hours in our garden or across the road in Volkspark: buckets, mud kitchen, bikes and the walk to the duck pond. Rain suits, Matschhose and spare boots live by the door.',
    see: 'The puddle your child found, and dry socks back in the bag.',
    tone: 'bg-sun text-navy',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7.6 15.6a3.6 3.6 0 1 1 .7-7.15 5.1 5.1 0 0 1 9.6 1.4A3.1 3.1 0 0 1 17.4 15.6z" />
        <path d="M9 18.4l-.9 2.2M13 18.4l-.9 2.2M17 18.4l-.9 2.2" />
      </svg>
    ),
  },
  {
    time: '12:00 PM',
    t: 'Lunch & Rest',
    p: 'Organic, mostly vegetarian, cooked here this morning and served family style. Then cots for the little ones, books and puzzles for those who have stopped sleeping.',
    see: 'What was actually eaten, and exactly how long the nap was.',
    tone: 'bg-white text-navy',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3.6 11.6h16.8c0 4.6-3.8 8.4-8.4 8.4s-8.4-3.8-8.4-8.4z" />
        <path d="M9.4 8.6c0-1.5 1.4-2 1.4-3.4M14 8.6c0-1.5 1.4-2 1.4-3.4" />
      </svg>
    ),
  },
  {
    time: '2:00 PM',
    t: 'Creative Time',
    p: 'Clay, collage and projects that run for weeks — the cardboard shop, the cress on the windowsill, the letters for Schönhauser Allee. Long tables, washable everything.',
    see: 'The finished thing, photographed before it goes home in a bag.',
    tone: 'bg-pink-soft text-pink-dark',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4.6 19.4l3.6-.9L18.7 8a2 2 0 0 0 0-2.8l-1-1a2 2 0 0 0-2.8 0L4.4 14.7z" />
        <path d="M14.4 6.6l3 3" />
      </svg>
    ),
  },
  {
    time: '4:00 PM',
    t: 'Snack & Pick-up',
    p: 'Fruit and bread from 15:00, then a slow wave of goodbyes. Late pick-up is included until 17:00, by arrangement with your key caregiver.',
    see: 'Your update already waiting before you leave the office.',
    tone: 'bg-teal-soft text-teal-dark',
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 8.6c-1-1.2-2.4-1.9-3.8-1.9-2.2 0-3.7 2-3.7 4.9 0 3.6 2.3 7.4 4.6 7.4 1 0 1.7-.6 2.9-.6s1.9.6 2.9.6c2.3 0 4.6-3.8 4.6-7.4 0-2.9-1.5-4.9-3.7-4.9-1.4 0-2.8.7-3.8 1.9z" />
        <path d="M12 8.6V6.2c0-1.2 1-2.2 2.4-2.5" />
      </svg>
    ),
  },
]

const BERLIN = [
  {
    slot: 'rain' as const,
    tag: 'All weather',
    tone: 'teal' as const,
    t: 'Outside, rain included',
    p: 'Two hours out whatever the sky is doing. Matschhose, rain jacket and spare boots live by the door — send a puddle suit rather than a day off. Volkspark is four minutes away.',
    alt: 'A child in a rain suit and boots playing outside in wet weather',
    offset: '',
  },
  {
    slot: 'day2' as const,
    tag: 'Cooked here',
    tone: 'pink' as const,
    t: 'Lunch from this morning',
    p: 'Organic, mostly vegetarian, on the table at 12:00 and eaten together. Menus go out every Sunday, and we cook around allergies rather than around convenience.',
    alt: 'A bowl of fresh fruit and berries prepared for lunch',
    offset: 'md:mt-10',
  },
  {
    slot: 'fac4' as const,
    tag: '13:00 – 14:30',
    tone: 'sun' as const,
    t: 'Rest that actually happens',
    p: 'Cots, blackout blinds and an air purifier in the nap room. Infants sleep on their home rhythm; older children get an hour of books and puzzles next door.',
    alt: 'A baby asleep on a cot during rest time',
    offset: 'md:mt-5',
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

/** Sun-yellow clock with slowly turning hands (parked under reduced motion). */
function ClockArt() {
  const reduce = useReducedMotion()
  const spin = (dur: number) =>
    reduce ? undefined : { duration: dur, repeat: Infinity, ease: 'linear' as const }

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="A sun-yellow clock marking the hours of the day at Baby Steps"
      className="h-auto w-full"
    >
      <circle cx="100" cy="100" r="97" fill="#FFF0E0" />
      <circle cx="100" cy="100" r="87" fill="#FFC94A" />
      <circle cx="100" cy="100" r="87" fill="none" stroke="#242138" strokeOpacity="0.08" strokeWidth="2" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1="100"
          y1="24"
          x2="100"
          y2={i % 3 === 0 ? 37 : 32}
          stroke="#242138"
          strokeOpacity={i % 3 === 0 ? 0.5 : 0.25}
          strokeWidth={i % 3 === 0 ? 5 : 3}
          strokeLinecap="round"
          transform={`rotate(${i * 30} 100 100)`}
        />
      ))}
      <motion.g
        style={{ transformBox: 'view-box', transformOrigin: '100px 100px' }}
        initial={reduce ? false : { rotate: -40 }}
        animate={reduce ? { rotate: -40 } : { rotate: [320, -40] }}
        transition={spin(52)}
      >
        <line x1="100" y1="106" x2="100" y2="42" stroke="#242138" strokeWidth="6.5" strokeLinecap="round" />
      </motion.g>
      <motion.g
        style={{ transformBox: 'view-box', transformOrigin: '100px 100px' }}
        initial={reduce ? false : { rotate: 64 }}
        animate={reduce ? { rotate: 64 } : { rotate: [424, 64] }}
        transition={spin(624)}
      >
        <line x1="100" y1="106" x2="100" y2="66" stroke="#242138" strokeWidth="10" strokeLinecap="round" />
      </motion.g>
      <circle cx="100" cy="100" r="8.5" fill="#E8266F" />
      <circle cx="100" cy="100" r="3" fill="#FFF9F1" />
    </svg>
  )
}

/* ---------------------------------------------------------------- page ---- */
export default function DayHere() {
  usePageMeta(
    'A Day at Baby Steps — 7:30 to 17:00, hour by hour',
    'The daily rhythm at Baby Steps creche in Prenzlauer Berg: drop-off at 7:30, morning circle, outdoor play in every weather, organic lunch, rest, creative time and pick-up — plus the parent update by 3 PM.',
  )

  const reduce = useReducedMotion()
  const [tab, setTab] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const listRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 88%', 'end 72%'],
  })
  const draw = useTransform(scrollYProgress, [0, 1], [0.03, 1])

  function onTabKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const n = AGE_TABS.length
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (i + 1) % n
    else if (e.key === 'ArrowLeft') next = (i - 1 + n) % n
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = n - 1
    if (next === null) return
    e.preventDefault()
    setTab(next)
    tabRefs.current[next]?.focus()
  }

  const active = AGE_TABS[tab]

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden">
        <div className="wrap grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-24 lg:pt-14">
          <div className="relative z-10">
            <p className="eyebrow">
              <svg viewBox="0 0 24 30" width="13" height="17" fill="none" aria-hidden="true">
                <path
                  d="M12 2C8 2 6 6 6 10c0 3 1.2 4.5 1.2 7 0 4-2.8 5-2.8 8.5 0 1.5 1.2 2.5 3 2.5 3 0 4.6-2 4.6-2s1.6 2 4.6 2c1.8 0 3-1 3-2.5 0-3.5-2.8-4.5-2.8-8.5 0-2.5 1.2-4 1.2-7 0-4-2-8-6-8z"
                  fill="currentColor"
                />
              </svg>
              STEP 03 · A Day at Baby Steps
            </p>

            <h1 className="display mt-5">
              <Line delay={0.05}>Every step of</Line>
              <Line delay={0.16}>the day,</Line>
              <Line delay={0.27}>mapped out</Line>
            </h1>

            <motion.p
              className="lede mt-7 max-w-xl"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EXPO_OUT, delay: 0.5 }}
            >
              Doors open at 7:30 and the last coat is buttoned by 17:00. Here is what happens in
              between — hour by hour, for all three rooms.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-4"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EXPO_OUT, delay: 0.62 }}
            >
              <PillCTA to="/contact" variant="pink">
                Book a tour
              </PillCTA>
              <PillCTA href="tel:+493012345678" variant="outline">
                +49 30 1234 5678
              </PillCTA>
            </motion.div>

            <motion.div
              className="mt-10 flex items-center gap-3 text-[13.5px] font-semibold uppercase tracking-[0.16em] text-navy-soft"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <span className="h-8 w-px bg-line" aria-hidden="true" />
              Mon – Fri 07:30 – 17:00
            </motion.div>
          </div>

          {/* clock art */}
          <div className="relative">
            <motion.span
              className="absolute -left-3 -top-5 h-24 w-24 rounded-full bg-pink-soft lg:-left-8 lg:h-32 lg:w-32"
              aria-hidden="true"
              initial={reduce ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: EXPO_OUT, delay: 0.2 }}
            />
            <motion.span
              className="absolute -right-2 top-8 h-16 w-16 rounded-full border-[10px] border-teal/35 lg:right-2 lg:h-24 lg:w-24"
              aria-hidden="true"
              initial={reduce ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: EXPO_OUT, delay: 0.35 }}
            />
            <motion.span
              className="absolute bottom-4 left-3 hidden h-16 w-16 rotate-12 rounded-[16px] bg-sun/70 lg:block"
              aria-hidden="true"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.5 }}
            />
            <span
              className="absolute left-1/2 top-1/2 -z-10 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream-deep"
              aria-hidden="true"
            />

            <motion.figure
              className="relative mx-auto max-w-[430px]"
              initial={reduce ? false : { opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: EXPO_OUT, delay: 0.25 }}
            >
              <ClockArt />
              <figcaption className="mt-5 text-center text-[13px] font-bold uppercase tracking-[0.16em] text-navy-soft">
                Doors open 7:30 · last pick-up 17:00
              </figcaption>
            </motion.figure>

            <motion.div
              className="absolute -left-1 top-6 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13.5px] font-bold shadow-lift sm:-left-5"
              initial={reduce ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EXPO_OUT, delay: 1 }}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-teal-soft text-teal-dark">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7.6 15.6a3.6 3.6 0 1 1 .7-7.15 5.1 5.1 0 0 1 9.6 1.4A3.1 3.1 0 0 1 17.4 15.6z" />
                  <path d="M9 18.4l-.9 2.2M13 18.4l-.9 2.2" />
                </svg>
              </span>
              Out in every weather
            </motion.div>

            <motion.div
              className="absolute -right-1 bottom-10 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13.5px] font-bold shadow-lift sm:-right-5"
              initial={reduce ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EXPO_OUT, delay: 1.15 }}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-pink-soft text-pink">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 8v4.4l2.8 1.6" />
                </svg>
              </span>
              Update by 15:00
            </motion.div>
          </div>
        </div>
      </section>

      <Wave from="#FFF9F1" to="#FFFFFF" />

      {/* ========================== AGE TABS ========================== */}
      <section className="section bg-white" id="ages">
        <div className="wrap">
          <SectionHead
            kicker="By age"
            title="Same day, three speeds"
            lede="The clock stays the same. What fills it changes with the room your child walks into."
            align="center"
          />

          <div
            role="tablist"
            aria-label="A day by age group"
            className="mx-auto mt-9 flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-full border border-line bg-cream p-1.5"
          >
            {AGE_TABS.map((t, i) => {
              const on = tab === i
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  type="button"
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={on}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setTab(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={`relative rounded-full px-4 py-2.5 text-center text-[14.5px] font-bold transition-colors duration-200 sm:px-6 ${
                    on ? 'text-cream' : 'text-navy-soft hover:text-navy'
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId={reduce ? undefined : 'agePill'}
                      className="absolute inset-0 rounded-full bg-navy"
                      transition={{ type: 'spring', stiffness: 430, damping: 36 }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">
                    {t.label}
                    <span
                      className={`mt-0.5 block text-[11px] font-bold uppercase tracking-[0.12em] ${
                        on ? 'text-cream/65' : 'text-navy-soft/70'
                      }`}
                    >
                      {t.tabAge}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              role="tabpanel"
              id={`panel-${active.id}`}
              aria-labelledby={`tab-${active.id}`}
              tabIndex={0}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="mt-9 rounded-[30px] border border-line bg-cream p-6 sm:p-8 lg:p-10"
            >
              <div className="grid gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
                <div>
                  <Tag tone="pink">{active.age}</Tag>
                  <h3 className="h3 mt-4">
                    {active.id === 'sprouts'
                      ? 'Little Sprouts'
                      : active.id === 'toddlers'
                        ? 'Toddler Trailblazers'
                        : 'Pre-K Pathfinders'}
                  </h3>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-navy-soft">{active.p}</p>

                  <p className="mt-6 text-[12.5px] font-extrabold uppercase tracking-[0.16em] text-pink">
                    Sample schedule
                  </p>
                  <ol className="mt-3 overflow-hidden rounded-[22px] border border-line bg-white">
                    {active.rows.map((r, i) => (
                      <li
                        key={r.time}
                        className={`flex gap-4 px-5 py-4 ${i ? 'border-t border-line' : ''}`}
                      >
                        <span className="w-[52px] shrink-0 pt-1 text-[13px] font-extrabold uppercase tracking-[0.1em] text-pink">
                          {r.time}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-heading text-[17px] font-bold leading-snug">
                            {r.t}
                          </span>
                          <span className="mt-0.5 block text-[14.5px] leading-snug text-navy-soft">
                            {r.p}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                <figure className="relative">
                  <Photo
                    src={IMAGES[active.slot]}
                    alt={active.alt}
                    w={800}
                    h={640}
                    mask="mask-arch"
                    className="aspect-[4/5] w-full"
                  />
                  <figcaption className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="pill-note shadow-lift">
                      {active.rows[0].time} start · {active.rows[active.rows.length - 1].time} snack
                    </span>
                  </figcaption>
                </figure>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Wave from="#FFFFFF" to="#FFF0E0" />

      {/* =========================== TIMELINE =========================== */}
      <section className="section bg-cream-deep" id="timeline">
        <div className="wrap">
          <SectionHead
            kicker="The clock"
            title="7:30 to 4:00, stop by stop"
            lede="Six anchors hold the day together. Everything else — the extra walk, the second helping — happens around them."
          />

          <div ref={listRef} className="relative mt-14">
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-[20.5px] top-0 w-[3px] rounded-full bg-line lg:left-1/2 lg:-ml-[1.5px]"
            />
            <motion.span
              aria-hidden="true"
              className="absolute bottom-0 left-[20.5px] top-0 w-[3px] origin-top rounded-full bg-pink lg:left-1/2 lg:-ml-[1.5px]"
              style={reduce ? undefined : { scaleY: draw }}
            />

            <ol className="relative space-y-7">
              {TIMELINE.map((s, i) => {
                const right = i % 2 === 1
                return (
                  <li key={s.t} className="relative pl-[60px] lg:grid lg:grid-cols-2 lg:pl-0">
                    <span
                      className={`absolute left-0 top-5 z-10 grid h-11 w-11 place-items-center rounded-full ring-4 ring-cream-deep lg:left-1/2 lg:-translate-x-1/2 ${s.tone}`}
                      aria-hidden="true"
                    >
                      {s.icon}
                    </span>

                    <Reveal
                      delay={0.04}
                      className={right ? 'lg:col-start-2 lg:pl-20' : 'lg:col-start-1 lg:pr-20'}
                    >
                      <div className="rounded-[24px] border border-line bg-white p-5 transition-shadow duration-300 hover:shadow-lift sm:p-6">
                        <span className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-pink">
                          {s.time}
                        </span>
                        <h3 className="mt-2 font-heading text-[22px] font-bold">{s.t}</h3>
                        <p className="mt-2 text-[15.5px] leading-relaxed text-navy-soft">{s.p}</p>
                        <div className="mt-4 rounded-2xl bg-pink-soft px-4 py-3">
                          <p className="text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-pink-dark">
                            What parents see
                          </p>
                          <p className="mt-1 text-[14.5px] leading-snug text-pink-dark/90">{s.see}</p>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                )
              })}
            </ol>
          </div>

          <Reveal delay={0.1} className="mt-9 flex flex-wrap gap-3">
            <span className="pill-note">House clock, all three rooms</span>
            <span className="pill-note">Infant and pre-school rooms shift by about an hour</span>
            <span className="pill-note">Late pick-up until 17:00</span>
          </Reveal>
        </div>
      </section>

      <Wave from="#FFF0E0" to="#FFFFFF" />

      {/* ========================= BERLIN TOUCHES ========================= */}
      <section className="section bg-white" id="berlin">
        <div className="wrap">
          <SectionHead
            kicker="Berlin"
            title="Built for this weather"
            lede="Rain suits by the door, lunch cooked this morning, and a rest that actually happens."
            align="center"
          />

          <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.09}>
            {BERLIN.map((b) => (
              <StaggerItem key={b.slot} className={b.offset}>
                <figure className="flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-cream transition-shadow duration-300 hover:shadow-lift">
                  <Photo
                    src={IMAGES[b.slot]}
                    alt={b.alt}
                    w={800}
                    h={600}
                    className="aspect-[4/3] w-full"
                  />
                  <figcaption className="flex flex-1 flex-col p-6">
                    <Tag tone={b.tone}>{b.tag}</Tag>
                    <h3 className="mt-3.5 font-heading text-[21px] font-bold">{b.t}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-navy-soft">{b.p}</p>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <Wave from="#FFFFFF" to="#242138" />

      {/* ======================= PARENT UPDATE ======================= */}
      <section className="section relative z-10 bg-navy pt-12 lg:pt-16" id="update">
        <div className="wrap grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="order-2 lg:order-1">
            <SectionHead
              kicker="The 3 PM update"
              title="You will know how the day went"
              lede="One photo and one note from the key caregiver, by 15:00. No app to open, no group chat to scroll."
              tone="cream"
            />

            <h3 className="h3 mt-8 text-cream">What lands on your phone</h3>
            <ul className="mt-5 space-y-5">
              {[
                'A photo from the afternoon, taken by the person who spent the day with your child.',
                'One honest sentence — what was eaten, how long the nap was, what made them laugh.',
                'A mood mark, so you can see the shape of the week at a glance.',
              ].map((li) => (
                <li key={li} className="flex gap-4">
                  <span
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-sun"
                    aria-hidden="true"
                  />
                  <span className="text-[15.5px] leading-relaxed text-cream/75">{li}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <PillCTA to="/contact" variant="sun">
                See it in person
              </PillCTA>
            </div>
          </div>

          <div className="relative z-20 order-1 -mt-20 self-start lg:order-2 lg:-mt-40">
            <Reveal x={40} y={0} delay={0.1} className="mx-auto w-full max-w-[330px]">
              <div className="rounded-[38px] border border-line bg-white p-2.5 shadow-lift">
                <div className="overflow-hidden rounded-[30px] bg-cream">
                  <div className="flex items-center justify-between px-4 pt-3.5 text-[11.5px] font-bold text-navy-soft">
                    <span>15:04</span>
                    <span className="flex items-center gap-1" aria-hidden="true">
                      <i className="h-1.5 w-1.5 rounded-full bg-navy/45" />
                      <i className="h-1.5 w-1.5 rounded-full bg-navy/45" />
                      <i className="h-1.5 w-3.5 rounded-sm bg-navy/45" />
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2.5 border-b border-line px-4 pb-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-pink font-heading text-[13px] font-extrabold text-white">
                      BS
                    </span>
                    <span className="min-w-0">
                      <span className="block font-heading text-[14.5px] font-bold leading-tight">
                        Baby Steps
                      </span>
                      <span className="block text-[11.5px] text-navy-soft">
                        Kastanienallee 24 · Today
                      </span>
                    </span>
                    <span className="ml-auto rounded-full bg-teal-soft px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wider text-teal-dark">
                      New
                    </span>
                  </div>

                  <Photo
                    src={IMAGES.day1}
                    alt="A child painting a bright picture with strokes of orange and blue"
                    w={800}
                    h={600}
                    className="aspect-[4/3] w-full"
                  />

                  <div className="px-4 pb-4 pt-4">
                    <p className="text-[14.5px] leading-relaxed text-navy">
                      Lina ate most of her pasta, then carried the cups to the sink. Seventy minutes
                      on the cot, and the rest of the afternoon in the sand pit.
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-pink-soft px-3.5 py-3">
                      <span className="text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-pink-dark">
                        Mood
                      </span>
                      <span className="text-[14px] font-bold text-pink-dark">
                        <span aria-hidden="true">😊</span> Settled &amp; sunny
                      </span>
                    </div>
                    <p className="mt-3 text-center text-[11.5px] text-navy-soft">
                      Sent by Mara · key caregiver
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Wave from="#242138" to="#FFF9F1" />

      {/* ============================== CTA ============================== */}
      <section className="section" id="visit">
        <div className="wrap text-center">
          <SectionHead
            kicker="Visit us"
            title="See it in person"
            lede="Tours run Tuesday and Thursday at 10:00, when the rooms are in full swing and you can watch an ordinary day rather than a tidy one."
            align="center"
          />

          <Reveal className="mt-9 flex flex-wrap justify-center gap-4">
            <PillCTA to="/contact" variant="pink">
              See it in person
            </PillCTA>
            <PillCTA href="tel:+493012345678" variant="outline">
              Call +49 30 1234 5678
            </PillCTA>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="pill-note">Kastanienallee 24, 10435 Berlin</span>
            <span className="pill-note">Prenzlauer Berg</span>
            <span className="pill-note">Mon – Fri 7:30 – 17:00</span>
            <span className="pill-note">hello@babysteps.de</span>
          </Reveal>
        </div>
      </section>
    </>
  )
}
