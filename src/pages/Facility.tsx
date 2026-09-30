import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check, ChevronLeft, ChevronRight, Leaf, Maximize2, ShieldCheck, Trees, X } from 'lucide-react'
import { usePageMeta, SectionHead, Wave, Tag, Footprints } from '@/components/ui'
import { Photo } from '@/components/Photo'
import { IMAGES, type ImageKey } from '@/lib/images'
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
  PillCTA,
  Enter,
  EXPO_OUT,
  EASE_OUT,
} from '@/lib/motion'

/* ---------------------------------------------------------------- data ---- */

type Tone = 'pink' | 'teal' | 'sun' | 'navy'

type Room = {
  id: string
  name: string
  sub: string
  tag: string
  tone: Tone
  slot: ImageKey
  alt: string
  caption: string
  span: string
  desc: string
  features: string[]
}

const ROOMS: Room[] = [
  {
    id: 'play',
    name: 'Play Room',
    sub: '58 m² · child height',
    tag: 'Ground floor',
    tone: 'pink',
    slot: 'fac1',
    alt: 'The play room at Baby Steps — an open floor with soft edges',
    caption: 'Open floor, soft edges, toys swapped every fortnight',
    span: 'lg:col-span-2 lg:row-span-2',
    desc: 'The biggest room in the house and the emptiest. Mats, a low climbing frame and one shelf of toys that changes every fortnight — enough clear floor to run a train line from the door to the window.',
    features: [
      'Sensory tray swapped every week',
      'Low hooks for coats and bags',
      'Windows that open ten centimetres',
      'Two caregivers in the room all day',
    ],
  },
  {
    id: 'reading',
    name: 'Reading Corner',
    sub: '600 books',
    tag: 'Quiet half-room',
    tone: 'sun',
    slot: 'fac2',
    alt: 'The reading corner at Baby Steps — picture books on low shelves',
    caption: 'Six hundred books, half of them in English',
    span: 'lg:col-span-2',
    desc: 'A quiet half-room off the play space: cushions, a window bench and six hundred picture books, half of them in English. One book at a time, returned to the shelf by the child who chose it.',
    features: [
      '600 picture books, German and English',
      'Story circle at 13:30',
      'A window bench that fits two',
      'Soft rug and low light for rest hour',
    ],
  },
  {
    id: 'yard',
    name: 'Outdoor Yard',
    sub: '400 m² · gated',
    tag: 'Two hours a day',
    tone: 'teal',
    slot: 'fac3',
    alt: 'The gated garden and courtyard at Baby Steps, four hundred square metres',
    caption: 'Sand pit, mud kitchen and beds they plant themselves',
    span: '',
    desc: 'Four hundred square metres of gated garden and courtyard: sand pit, mud kitchen, bikes and raised beds the children plant themselves. Two hours a day, every day, rain included.',
    features: [
      'Sand pit and mud kitchen',
      'Bikes, balls and a climbing arch',
      'Vegetable beds at child height',
      'Gate locked from the inside',
    ],
  },
  {
    id: 'nap',
    name: 'Nap Room',
    sub: '12 cots',
    tag: 'Rest · 12:30 – 14:30',
    tone: 'navy',
    slot: 'fac4',
    alt: 'A baby asleep on a cot in the nap room during rest time',
    caption: 'Blackout blinds, white noise, air purifier',
    span: '',
    desc: 'Twelve cots, blackout blinds and an air purifier running on low all day. Babies keep the rhythm they have at home; older children rest next door with books once the cots are full.',
    features: [
      'Twelve cots, one blanket rule',
      'Blackout blinds and white noise',
      'Air purifier, window cracked open',
      'Sleeps logged in your daily note',
    ],
  },
]

type PlanRoom = {
  id: string
  name: string
  tag: string
  tone: Tone
  x: number
  y: number
  w: number
  h: number
  dim: string
  hot: string
  label: string
  sub: string
  details: string
  facts: { k: string; v: string }[]
}

/** All coordinates live in the plan's 800 × 520 viewBox. */
const PLAN: PlanRoom[] = [
  {
    id: 'plan-play',
    name: 'Play Room',
    tag: 'Ground floor · 58 m²',
    tone: 'pink',
    x: 56,
    y: 56,
    w: 310,
    h: 200,
    dim: '#FFE3EE',
    hot: '#FFC7DD',
    label: 'Play Room',
    sub: '58 m² · child height',
    details:
      'The biggest room in the house, kept mostly empty so a train line can run the full length of the floor. Low shelves, a climbing frame and a sensory tray that changes every fortnight.',
    facts: [
      { k: 'Floor', v: '58 m²' },
      { k: 'Adults', v: 'Two caregivers' },
      { k: 'Windows', v: 'Open 10 cm' },
    ],
  },
  {
    id: 'plan-reading',
    name: 'Reading Corner',
    tag: 'Quiet half-room',
    tone: 'sun',
    x: 382,
    y: 56,
    w: 172,
    h: 200,
    dim: '#FFEFC9',
    hot: '#FFDD8E',
    label: 'Reading Corner',
    sub: '600 books',
    details:
      'Cushions, a window bench and six hundred picture books, half of them in English. One book at a time, returned to the shelf by the child who chose it.',
    facts: [
      { k: 'Books', v: '600, German & English' },
      { k: 'Circle', v: 'Story time 13:30' },
      { k: 'Seating', v: 'Window bench for two' },
    ],
  },
  {
    id: 'plan-nap',
    name: 'Nap Room',
    tag: 'Rest · 12:30 – 14:30',
    tone: 'navy',
    x: 382,
    y: 272,
    w: 172,
    h: 102,
    dim: '#DFF6F2',
    hot: '#B7E5DF',
    label: 'Nap Room',
    sub: '12 cots',
    details:
      'Twelve cots, blackout blinds and an air purifier running on low all day. Babies keep their own rhythm; older children rest next door with books once the cots are full.',
    facts: [
      { k: 'Cots', v: 'Twelve' },
      { k: 'Air', v: 'Purifier, window cracked' },
      { k: 'Logged', v: 'Sleeps in your daily note' },
    ],
  },
  {
    id: 'plan-entry',
    name: 'Entrance',
    tag: 'Kastanienallee 24',
    tone: 'pink',
    x: 56,
    y: 272,
    w: 140,
    h: 102,
    dim: '#FFF0E0',
    hot: '#FFE0C2',
    label: 'Entrance',
    sub: 'keypad',
    details:
      'One door, one keypad, one sign-in book. You get the code on day one, visitors are announced at the desk, and nobody leaves with a child who is not on the list.',
    facts: [
      { k: 'Entry', v: 'Keypad code' },
      { k: 'Visitors', v: 'Sign in at the desk' },
      { k: 'Pick-up', v: 'Photo ID until we know you' },
    ],
  },
  {
    id: 'plan-garden',
    name: 'Garden',
    tag: '400 m² · gated',
    tone: 'teal',
    x: 600,
    y: 40,
    w: 172,
    h: 440,
    dim: '#DFF6F2',
    hot: '#B7E7E0',
    label: 'Garden',
    sub: '400 m²',
    details:
      'Grass, sand and bark right outside the door, plus raised beds the children plant themselves. Two hours a day, every day, in every weather.',
    facts: [
      { k: 'Surface', v: 'Grass, sand, bark' },
      { k: 'Gate', v: 'Locked from inside' },
      { k: 'Hours', v: 'Two hours a day' },
    ],
  },
]

const SAFETY = [
  {
    t: 'Secure keypad entry',
    p: 'The code is handed over on day one and changes only when a family leaves the house.',
  },
  {
    t: 'CCTV at the entrances',
    p: 'Front door and garden gate, kept for thirty days. Never a camera inside the rooms.',
  },
  {
    t: 'First-aid trained staff',
    p: 'Three paediatric first-aiders on site every day, recertified every two years.',
  },
  {
    t: 'Allergy-aware meals',
    p: 'Allergies live on the kitchen board and in each child’s file. Nothing is guessed at the table.',
  },
  {
    t: 'Daily cleaning',
    p: 'Floors and toys twice a day, cots and changing mats after every use.',
  },
  {
    t: 'Sign-out procedure',
    p: 'Only named adults collect. Photo ID checked until we know your face.',
  },
]

const MENU = [
  { d: 'Mon', t: 'Lentil dahl with rice and cucumber' },
  { d: 'Wed', t: 'Potato and leek soup with fresh bread' },
  { d: 'Fri', t: 'Vegetable pasta, parmesan on the side' },
]

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/* -------------------------------------------------------------- helpers ---- */

function RoomCard({
  room,
  index,
  onOpen,
}: {
  room: Room
  index: number
  onOpen: (i: number, el: HTMLElement) => void
}) {
  return (
    <StaggerItem className={room.span}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-white transition-shadow duration-300 hover:shadow-lift">
        <div className="relative min-h-[200px] flex-1 overflow-hidden lg:min-h-0">
          <Photo
            src={IMAGES[room.slot]}
            alt={room.alt}
            w={800}
            h={640}
            className="absolute inset-0 h-full w-full"
            imgClassName="transition-transform duration-700 group-hover:scale-105"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-navy/75 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
          <span className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-2 text-[14px] font-semibold leading-snug text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {room.caption}
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-4 grid h-9 w-9 translate-y-1 place-items-center rounded-full bg-white text-navy shadow-soft opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Maximize2 size={15} />
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <h3 className="font-heading text-[19px] font-bold">{room.name}</h3>
          <span className="text-right text-[12px] font-extrabold uppercase tracking-[0.12em] text-navy-soft">
            {room.sub}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => onOpen(index, e.currentTarget)}
          className="absolute inset-1 z-10 rounded-[20px]"
          aria-label={`Open the ${room.name} in a larger view`}
        />
      </article>
    </StaggerItem>
  )
}

function RoomLightbox({
  room,
  index,
  total,
  onClose,
  onPrev,
  onNext,
  restoreFocus,
}: {
  room: Room
  index: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  restoreFocus: () => void
}) {
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        onNext()
        return
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onPrev()
        return
      }
      if (e.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement

      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault()
          last.focus()
        }
      } else if (active === last || !panel.contains(active)) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      restoreFocus()
    }
  }, [onClose, onPrev, onNext, restoreFocus])

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
    >
      <motion.span
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-navy/75 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-lightbox-title"
        className="relative z-10 max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white shadow-lift"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
        transition={{ duration: 0.4, ease: EXPO_OUT }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close room view"
          className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-navy shadow-soft transition-colors duration-300 hover:bg-pink hover:text-white"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="grid md:grid-cols-[1.02fr_0.98fr]">
          <div className="relative aspect-[16/11] w-full md:aspect-auto md:min-h-[460px]">
            <Photo
              src={IMAGES[room.slot]}
              alt={room.alt}
              w={800}
              h={640}
              eager
              className="absolute inset-0 h-full w-full md:rounded-l-[28px]"
            />
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <Tag tone={room.tone}>{room.tag}</Tag>
            <h3 id="room-lightbox-title" className="h3 mt-4">
              {room.name}
            </h3>
            <p className="mt-3 text-[15.5px] leading-relaxed text-navy-soft">{room.desc}</p>

            <h4 className="mt-6 font-heading text-[13.5px] font-extrabold uppercase tracking-[0.16em] text-pink">
              In the room
            </h4>
            <ul className="mt-3 space-y-2.5">
              {room.features.map((f) => (
                <li key={f} className="flex gap-3 text-[15px] leading-snug text-navy">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-soft text-teal-dark"
                  >
                    <Check size={12} strokeWidth={3.5} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-5">
              <button
                type="button"
                onClick={onPrev}
                aria-label="Previous room"
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-navy transition-colors duration-300 hover:border-pink hover:text-pink"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <span className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-navy-soft">
                {index + 1} / {total}
              </span>
              <button
                type="button"
                onClick={onNext}
                aria-label="Next room"
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white text-navy transition-colors duration-300 hover:border-pink hover:text-pink"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-3 text-center text-[12.5px] text-navy-soft">
              Arrow keys to browse · Esc to close
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ---------------------------------------------------------------- page ---- */
export default function Facility() {
  usePageMeta(
    'Our Facility — Rooms, Garden & Floor Plan | Baby Steps Creche Berlin',
    'Walk the four rooms of Baby Steps creche in Prenzlauer Berg: play room, reading corner, 400 m² gated yard and nap room — plus an interactive floor plan, safety checks and freshly cooked meals.',
  )

  const reduce = useReducedMotion()
  const [open, setOpen] = useState<number | null>(null)
  const [plan, setPlan] = useState(0)
  const triggerRef = useRef<HTMLElement | null>(null)

  const openRoom = useCallback((i: number, el: HTMLElement) => {
    triggerRef.current = el
    setOpen(i)
  }, [])
  const closeRoom = useCallback(() => setOpen(null), [])
  const nextRoom = useCallback(
    () => setOpen((i) => (i === null ? 0 : (i + 1) % ROOMS.length)),
    [],
  )
  const prevRoom = useCallback(
    () => setOpen((i) => (i === null ? 0 : (i - 1 + ROOMS.length) % ROOMS.length)),
    [],
  )
  const restoreFocus = useCallback(() => {
    triggerRef.current?.focus()
    triggerRef.current = null
  }, [])

  const active = PLAN[plan]

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-cream">
        <div className="wrap grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:pb-24 lg:pt-16">
          <div className="relative z-10">
            <Enter delay={0.04}>
              <p className="eyebrow">STEP 04 · Around Our Space</p>
            </Enter>

            <Enter delay={0.14}>
              <h1 className="display mt-5">
                Every corner made for{' '}
                <span className="whitespace-nowrap text-pink">little explorers</span>
              </h1>
            </Enter>

            <Enter delay={0.26}>
              <p className="lede mt-6 max-w-xl">
                Four rooms and a 400 m² garden on Kastanienallee, everything set at a height a child
                can reach. See the house here first — then walk it with us.
              </p>
            </Enter>

            <Enter delay={0.38}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PillCTA to="/contact" variant="pink">
                  Book a tour
                </PillCTA>
                <PillCTA href="#rooms" variant="outline">
                  Explore the rooms
                </PillCTA>
              </div>
            </Enter>

            <Enter delay={0.5}>
              <div className="mt-9 flex flex-wrap gap-3">
                <span className="pill-note">Play · Read · Nap · Garden</span>
                <span className="pill-note">400 m² garden and courtyard</span>
                <span className="pill-note">Mon – Fri 7:30 – 17:00</span>
              </div>
            </Enter>
          </div>

          {/* art — arch photo, offset block, floating badges */}
          <div className="relative">
            <Enter delay={0.1} className="relative mx-auto w-full max-w-[500px]">
              <span
                aria-hidden="true"
                className="absolute -right-5 -top-5 h-[86%] w-[76%] rounded-[46px] bg-teal-soft lg:-right-9 lg:-top-9"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-5 -left-4 hidden h-24 w-24 rotate-6 rounded-[22px] bg-sun/55 sm:block"
              />

              <Photo
                src={IMAGES.fac1}
                alt="Sunlit play room at Baby Steps with an open floor and soft edges"
                w={800}
                h={640}
                mask="mask-arch"
                eager
                className="relative aspect-[4/5] w-full"
              />

              <Enter delay={0.8} className="absolute -bottom-6 -left-3 w-24 sm:w-32">
                <Photo
                  src={IMAGES.fac2}
                  alt="The reading corner at Baby Steps with picture books on low shelves"
                  w={700}
                  h={700}
                  mask="mask-blob"
                  className="aspect-square w-full border-[6px] border-cream shadow-lift"
                />
              </Enter>

              <Enter
                delay={0.95}
                className="absolute right-0 top-6 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13.5px] font-bold shadow-lift sm:-right-6"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-teal-soft text-teal-dark">
                  <Trees size={15} aria-hidden="true" />
                </span>
                400 m² garden
              </Enter>

              <Enter
                delay={1.1}
                className="absolute bottom-12 right-2 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13.5px] font-bold shadow-lift sm:-right-4"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-pink-soft text-pink">
                  <ShieldCheck size={15} aria-hidden="true" />
                </span>
                Keypad entry
              </Enter>
            </Enter>
          </div>
        </div>
      </section>

      <Wave from="#FFF9F1" to="#FFFFFF" />

      {/* ========================= ROOM EXPLORER ========================= */}
      <section className="section bg-white" id="rooms" aria-labelledby="rooms-title">
        <div className="wrap">
          <SectionHead
            step="STEP 05"
            kicker="Room explorer"
            title="Four rooms, sized for small people"
            lede="Hover to look closer, tap to step inside. Every room opens with what is actually in it."
            align="center"
            id="rooms-title"
          />

          <StaggerGroup
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[320px_320px]"
            stagger={0.09}
          >
            {ROOMS.map((r, i) => (
              <RoomCard key={r.id} room={r} index={i} onOpen={openRoom} />
            ))}
          </StaggerGroup>

          <Reveal delay={0.08} className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="pill-note">Click a room to open it</span>
            <span className="pill-note">Same four spaces every day</span>
            <span className="pill-note">Windows open 10 cm, never further</span>
          </Reveal>
        </div>
      </section>

      <Wave from="#FFFFFF" to="#FFF0E0" />

      {/* ========================== FLOOR PLAN ========================== */}
      <section className="section bg-cream-deep" id="plan" aria-labelledby="plan-title">
        <Footprints className="right-6 top-12 hidden lg:block" count={4} color="#0FA79A" />
        <div className="wrap">
          <SectionHead
            step="STEP 06"
            kicker="Floor plan"
            title="One floor, four rooms, a garden"
            lede="Hover, tap or tab through the plan. The panel beside it tells you what sits inside each space."
            align="center"
            id="plan-title"
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
            {/* plan drawing */}
            <div className="relative rounded-[30px] border border-line bg-white p-3 sm:p-5">
              <svg
                viewBox="0 0 800 520"
                className="block h-auto w-full"
                aria-hidden="true"
                focusable="false"
              >
                <rect x="8" y="8" width="784" height="504" rx="30" fill="#FFF9F1" />

                {/* garden */}
                <rect
                  x="600"
                  y="40"
                  width="172"
                  height="440"
                  rx="24"
                  fill="#DFF6F2"
                  stroke="#0FA79A"
                  strokeOpacity="0.55"
                  strokeWidth="2.5"
                  strokeDasharray="11 9"
                />

                {/* building shell */}
                <rect
                  x="40"
                  y="40"
                  width="530"
                  height="350"
                  rx="26"
                  fill="#FFFFFF"
                  stroke="#242138"
                  strokeOpacity="0.16"
                  strokeWidth="2.5"
                />

                {/* link door to the garden */}
                <rect
                  x="570"
                  y="206"
                  width="30"
                  height="40"
                  rx="5"
                  fill="#FFF9F1"
                  stroke="#242138"
                  strokeOpacity="0.2"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
                <path
                  d="M578 226 H594"
                  stroke="#0FA79A"
                  strokeWidth="3"
                  strokeDasharray="5 6"
                  strokeLinecap="round"
                />

                {/* lockers — decorative */}
                <rect
                  x="212"
                  y="272"
                  width="154"
                  height="102"
                  rx="18"
                  fill="#FFF9F1"
                  stroke="#242138"
                  strokeOpacity="0.12"
                  strokeWidth="2"
                />
                <text
                  x="289"
                  y="330"
                  textAnchor="middle"
                  fontSize="13"
                  fill="#5B5872"
                  opacity="0.85"
                >
                  Lockers &amp; sink
                </text>

                {/* rooms */}
                {PLAN.map((r, i) => (
                  <rect
                    key={r.id}
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    rx={22}
                    fill={plan === i ? r.hot : r.dim}
                    stroke="#242138"
                    strokeOpacity={plan === i ? 0.5 : 0.16}
                    strokeWidth={2.5}
                    className="transition-colors duration-300"
                  />
                ))}

                {/* garden details */}
                <circle cx="655" cy="140" r="26" fill="#0FA79A" fillOpacity="0.22" />
                <circle cx="738" cy="172" r="18" fill="#0FA79A" fillOpacity="0.22" />
                <circle cx="648" cy="350" r="20" fill="#0FA79A" fillOpacity="0.22" />
                <circle cx="740" cy="380" r="22" fill="#0FA79A" fillOpacity="0.22" />
                <rect
                  x="618"
                  y="412"
                  width="136"
                  height="50"
                  rx="14"
                  fill="#FFC94A"
                  fillOpacity="0.5"
                />
                <text
                  x="686"
                  y="443"
                  textAnchor="middle"
                  fontSize="13"
                  fill="#8A5F00"
                  fontWeight="700"
                >
                  Sand pit
                </text>

                {/* room labels */}
                <g>
                  {PLAN.map((r, i) => (
                    <g key={`${r.id}-label`}>
                      <text
                        x={r.x + r.w / 2}
                        y={r.y + r.h / 2 - 4}
                        textAnchor="middle"
                        fontSize="19"
                        fontWeight={plan === i ? 800 : 700}
                        fill="#242138"
                        className="font-heading"
                      >
                        {r.label}
                      </text>
                      <text
                        x={r.x + r.w / 2}
                        y={r.y + r.h / 2 + 20}
                        textAnchor="middle"
                        fontSize="12.5"
                        fill="#5B5872"
                      >
                        {r.sub}
                      </text>
                    </g>
                  ))}
                </g>

                {/* entrance on Kastanienallee */}
                <path
                  d="M104 390 H152"
                  stroke="#242138"
                  strokeOpacity="0.55"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <path
                  d="M128 452 V406"
                  stroke="#E8266F"
                  strokeWidth="3"
                  strokeDasharray="7 7"
                  strokeLinecap="round"
                />
                <path
                  d="M121 414 l7 -9 l7 9"
                  fill="none"
                  stroke="#E8266F"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text
                  x="128"
                  y="478"
                  textAnchor="middle"
                  fontSize="12.5"
                  fontWeight="700"
                  fill="#5B5872"
                >
                  Kastanienallee 24
                </text>
              </svg>

              {/* hotspots */}
              <div className="absolute inset-3 sm:inset-5">
                {PLAN.map((r, i) => (
                  <button
                    key={`hot-${r.id}`}
                    type="button"
                    aria-pressed={plan === i}
                    aria-label={`${r.name} — show details`}
                    onMouseEnter={() => setPlan(i)}
                    onFocus={() => setPlan(i)}
                    onClick={() => setPlan(i)}
                    style={{
                      left: `${(r.x / 800) * 100}%`,
                      top: `${(r.y / 520) * 100}%`,
                      width: `${(r.w / 800) * 100}%`,
                      height: `${(r.h / 520) * 100}%`,
                    }}
                    className="absolute rounded-[18px] transition-colors duration-200 hover:bg-navy/[0.05]"
                  />
                ))}
              </div>
            </div>

            {/* side panel */}
            <div className="self-start rounded-[30px] border border-line bg-white p-6 sm:p-7 lg:sticky lg:top-28">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-teal">
                Now showing
              </p>
              <div aria-live="polite" className="min-h-[290px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active.id}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: EASE_OUT }}
                  >
                    <div className="mt-4">
                      <Tag tone={active.tone}>{active.tag}</Tag>
                    </div>
                    <h3 className="h3 mt-4">{active.name}</h3>
                    <p className="mt-3 text-[15.5px] leading-relaxed text-navy-soft">
                      {active.details}
                    </p>
                    <dl className="mt-6 space-y-3 border-t border-line pt-5">
                      {active.facts.map((f) => (
                        <div
                          key={f.k}
                          className="flex items-baseline justify-between gap-4"
                        >
                          <dt className="text-[12.5px] font-extrabold uppercase tracking-[0.12em] text-navy-soft">
                            {f.k}
                          </dt>
                          <dd className="text-right text-[15px] font-semibold text-navy">
                            {f.v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="mt-5 border-t border-line pt-5 text-[13.5px] text-navy-soft">
                Hover, tap or tab a room to change the panel.
              </p>
            </div>
          </div>

          <Reveal delay={0.08} className="mt-7 flex flex-wrap justify-center gap-3">
            <span className="pill-note">Entrance on Kastanienallee</span>
            <span className="pill-note">Garden straight off the play room</span>
            <span className="pill-note">One floor, no stairs</span>
          </Reveal>
        </div>
      </section>

      <Wave from="#FFF0E0" to="#FFF9F1" />

      {/* ========================= SAFETY & CARE ========================= */}
      <section
        className="section bg-cream pb-32 lg:pb-44"
        id="safety"
        aria-labelledby="safety-title"
      >
        <div className="wrap">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHead
              step="STEP 07"
              kicker="Safety & care"
              title="Six things we do every single day"
              lede="So you never have to ask about them at the door."
              id="safety-title"
            />
            <Reveal delay={0.1} className="flex flex-wrap gap-3">
              <span className="pill-note">Code from day one</span>
              <span className="pill-note">First aid on every shift</span>
            </Reveal>
          </div>

          <ul className="mt-12 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {SAFETY.map((s, i) => (
              <Reveal
                key={s.t}
                as="li"
                delay={i * 0.07}
                className="flex gap-4 border-t border-line pt-6"
              >
                <motion.span
                  aria-hidden="true"
                  className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal text-white"
                  initial={reduce ? false : { scale: 0, rotate: -25 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                  transition={{ duration: 0.5, ease: EXPO_OUT, delay: 0.08 + i * 0.12 }}
                >
                  <Check size={17} strokeWidth={3.2} />
                </motion.span>
                <div>
                  <h3 className="font-heading text-[19px] font-bold">{s.t}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-navy-soft">{s.p}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.1} className="relative mt-12">
            <Photo
              src={IMAGES.fac5}
              alt="The art table at Baby Steps — washable everything"
              w={900}
              h={560}
              className="aspect-[16/9] w-full rounded-[30px] sm:aspect-[16/6]"
            />
            <span className="pill-note absolute bottom-4 left-4 right-4 shadow-lift sm:right-auto">
              Art table · washable everything
            </span>
          </Reveal>
        </div>
      </section>

      {/* ============================ MEALS BAND ============================ */}
      {/* the photo card crosses the boundary into the safety section above */}
      <section
        className="relative bg-teal pt-16 pb-20 lg:pt-24 lg:pb-28"
        id="meals"
        aria-labelledby="meals-title"
      >
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="order-2 lg:order-1 lg:pt-14">
            <p className="eyebrow text-white">STEP 08 · Meals</p>
            <h2 id="meals-title" className="h2 mt-4 text-white">
              Lunch is cooked here, this morning
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/85">
              Organic, mostly vegetarian, on the table at 12:00 and eaten together family style.
              Menus go out every Sunday, and we cook around allergies rather than around
              convenience.
            </p>

            <div className="mt-8 rounded-[26px] bg-white p-5 shadow-lift sm:p-6">
              <h3 className="font-heading text-[15px] font-extrabold uppercase tracking-[0.16em] text-pink">
                A week on the table
              </h3>
              <ul className="mt-4">
                {MENU.map((m, i) => (
                  <li
                    key={m.d}
                    className={`flex gap-4 py-3 ${i ? 'border-t border-line' : 'pt-0'}`}
                  >
                    <span className="w-[46px] shrink-0 pt-0.5 text-[12.5px] font-extrabold uppercase tracking-[0.12em] text-teal">
                      {m.d}
                    </span>
                    <span className="text-[15.5px] leading-snug text-navy">{m.t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-[13.5px] font-semibold text-navy-soft">
                <Leaf size={15} className="shrink-0 text-teal" aria-hidden="true" />
                Fruit and bread at 15:00, every day
              </p>
            </div>
          </div>

          <figure className="relative z-10 order-1 -mt-24 sm:-mt-32 lg:order-2 lg:-mt-44">
            <div className="rounded-[30px] border border-line bg-white p-2.5 shadow-lift">
              <Photo
                src={IMAGES.day2}
                alt="A bowl of fresh fruit and berries prepared for the afternoon snack"
                w={800}
                h={500}
                className="aspect-[4/3] w-full rounded-[22px]"
              />
              <figcaption className="flex items-center justify-between gap-3 px-3 py-3.5">
                <span className="text-[14.5px] font-bold text-navy">
                  Fruit and bread, 15:00
                </span>
                <Tag tone="teal">Cooked here</Tag>
              </figcaption>
            </div>
          </figure>
        </div>
      </section>

      <Wave from="#0FA79A" to="#242138" />

      {/* ============================== CTA ============================== */}
      <section className="section bg-navy" aria-labelledby="visit-title">
        <div className="wrap max-w-3xl text-center">
          <SectionHead
            step="STEP 09"
            kicker="Visit us"
            title="Walk the rooms yourself"
            lede="Tours run Tuesday and Thursday at 10:00, while the rooms are busy — an ordinary day, not a tidy one. Bring your child; they check the garden first."
            align="center"
            tone="cream"
            id="visit-title"
          />

          <Reveal delay={0.06} className="mt-9 flex flex-wrap justify-center gap-4">
            <PillCTA to="/contact" variant="sun">
              Book a tour
            </PillCTA>
            <a
              href="tel:+493012345678"
              className="inline-flex items-center gap-2.5 rounded-full border-2 border-white/25 px-7 py-3.5 text-[15px] font-semibold text-cream transition-colors duration-300 hover:border-sun hover:text-sun"
            >
              +49 30 1234 5678
            </a>
          </Reveal>

          <Reveal delay={0.14} className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="pill-note">Kastanienallee 24, 10435 Berlin</span>
            <span className="pill-note">Prenzlauer Berg</span>
            <span className="pill-note">Mon – Fri 7:30 – 17:00</span>
            <span className="pill-note">hello@babysteps.de</span>
          </Reveal>
        </div>
      </section>

      <AnimatePresence>
        {open !== null && (
          <RoomLightbox
            key="room-lightbox"
            room={ROOMS[open]}
            index={open}
            total={ROOMS.length}
            onClose={closeRoom}
            onPrev={prevRoom}
            onNext={nextRoom}
            restoreFocus={restoreFocus}
          />
        )}
      </AnimatePresence>
    </>
  )
}
