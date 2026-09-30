import { useRef, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Check, Clock, MapPin, Phone, Users } from 'lucide-react'
import { usePageMeta, SectionHead, Wave, Tag, Counter, Footprints } from '@/components/ui'
import { Photo } from '@/components/Photo'
import { IMAGES } from '@/lib/images'
import { Reveal, StaggerGroup, StaggerItem, PillCTA, EXPO_OUT, EASE_OUT } from '@/lib/motion'

/* ---------------------------------------------------------------- data ---- */
type Tone = 'pink' | 'teal' | 'navy'

const TONE: Record<
  Tone,
  {
    section: string
    pill: string
    head: string
    lede: string
    kicker: string
    item: string
    check: string
    frame: string
    card: string
    day: string
  }
> = {
  pink: {
    section: 'bg-pink-soft',
    pill: 'bg-white text-pink-dark border border-pink/20',
    head: 'text-navy',
    lede: 'text-navy-soft',
    kicker: 'text-pink-dark',
    item: 'text-navy',
    check: 'bg-pink text-white',
    frame: 'bg-white/70',
    card: 'bg-white border-line',
    day: 'text-pink',
  },
  teal: {
    section: 'bg-teal-soft',
    pill: 'bg-white text-teal-dark border border-teal/25',
    head: 'text-navy',
    lede: 'text-navy-soft',
    kicker: 'text-teal-dark',
    item: 'text-navy',
    check: 'bg-teal text-white',
    frame: 'bg-white/70',
    card: 'bg-white border-line',
    day: 'text-teal-dark',
  },
  navy: {
    section: 'bg-navy',
    pill: 'bg-sun text-navy',
    head: 'text-cream',
    lede: 'text-cream/70',
    kicker: 'text-sun',
    item: 'text-cream/90',
    check: 'bg-sun text-navy',
    frame: 'bg-white/10',
    card: 'bg-white/[0.06] border-white/15',
    day: 'text-sun',
  },
}

const PROGRAMS = [
  {
    id: 'little-sprouts',
    name: 'Little Sprouts',
    age: '6 – 18 months',
    tone: 'pink' as const,
    p: 'The first months away from home are about one predictable person, not a full calendar. We keep the nap and feeding times you already have at home for at least three months, then move onto the room rhythm only when your child is ready.',
    does: [
      'Floor play on soft mats, in a room kept quiet after lunch',
      'The same key caregiver for bottles, naps and nappy changes, Monday to Friday',
      'A sensory tray swapped every week — oats, cool gel, warm rice, water',
      'Mirror wall and low climbing frames built for children not yet walking',
    ],
    week: [
      { d: 'Mon & Thu', t: 'Songs on the rug at 09:15' },
      { d: 'Wed', t: 'Water play in the garden' },
      { d: 'Fri', t: 'Picture books, one lap at a time' },
      { d: 'Daily', t: 'Two hours outside, whatever the weather' },
    ],
    slot: 'prog1' as const,
    mask: 'mask-arch' as const,
    alt: 'A baby laughing while lying beside a red balloon',
    aspect: 'aspect-[4/5]',
    note: 'Naps logged for you',
  },
  {
    id: 'toddler-trailblazers',
    name: 'Toddler Trailblazers',
    age: '18 months – 3 years',
    tone: 'teal' as const,
    p: '“Me do it” is the whole programme. The day is built from short tasks a toddler can finish alone — coat on, cups to the table, shoes in the basket — with enough time left over to do them badly and try again.',
    does: [
      'Circle time every morning, songs and first words in German and English',
      'Coats, cups and shoes done by the child, not for the child',
      'Potty training supported at your pace and written into the daily note',
      'Bikes, mud kitchen and the long walk to the duck pond in Volkspark',
    ],
    week: [
      { d: 'Mon', t: 'Baking at the big table' },
      { d: 'Tue & Thu', t: 'Obstacle course in the garden' },
      { d: 'Wed', t: 'Walk to the duck pond' },
      { d: 'Fri', t: 'Music circle with shakers and drums' },
    ],
    slot: 'blocks' as const,
    mask: 'mask-blob' as const,
    alt: 'A child’s hands stacking wooden picture blocks into a tall tower',
    aspect: 'aspect-[5/4]',
    note: 'Potty training at your pace',
  },
  {
    id: 'pre-k-pathfinders',
    name: 'Pre-K Pathfinders',
    age: '3 – 5 years',
    tone: 'navy' as const,
    p: 'Letters, numbers and projects that run for a whole week — build a shop, grow cress, post a letter on Schönhauser Allee. School readiness comes out of real errands, not worksheets at a table.',
    does: [
      'A new project week every fortnight, finished and hung up for parents',
      'Numbers and letters through cooking, counting and writing real lists',
      'German–English story circle, then retelling it in your own words',
      'A transition plan with your Grundschule, agreed from the spring',
    ],
    week: [
      { d: 'Mon', t: 'Project time — one question for the week' },
      { d: 'Tue', t: 'Numbers at the table, cooking and counting' },
      { d: 'Thu', t: 'German–English story circle' },
      { d: 'Fri', t: 'Werkstatt: scissors, glue, cardboard' },
    ],
    slot: 'prog3' as const,
    mask: 'mask-soft' as const,
    alt: 'Two young girls reading a picture book together outdoors',
    aspect: 'aspect-[4/3]',
    note: 'Portfolio since day one',
  },
]

const COMPARE = [
  {
    name: 'Little Sprouts',
    age: '6 – 18 months',
    size: 'Max 6 · 3:1',
    focus: 'Trust, sensory play, sleep',
    rhythm: 'Bottles and naps on your schedule',
    tone: 'pink' as const,
  },
  {
    name: 'Toddler Trailblazers',
    age: '18 m – 3 y',
    size: 'Max 8 · 4:1',
    focus: 'Language, independence, potty',
    rhythm: 'Circle 09:00, outside 10:00',
    tone: 'teal' as const,
  },
  {
    name: 'Pre-K Pathfinders',
    age: '3 – 5 years',
    size: 'Max 10 · 4:1',
    focus: 'Projects, pre-literacy, friendships',
    rhythm: 'Project block 09:30, library walk weekly',
    tone: 'sun' as const,
  },
]

const COLS = ['Age', 'Group size', 'Focus', 'Daily rhythm'] as const

const MILESTONES = [
  { at: '6 months', t: 'Sits and reaches', p: 'Floor time, sensory tray, first solids at the big table.' },
  { at: '12 months', t: 'Cruising and first words', p: 'Low frames to pull up on. Names for everything, in two languages.' },
  { at: '18 months', t: 'Walking and testing', p: 'Circle time starts. Potty training begins when you say so.' },
  { at: '2 years', t: 'Two-word sentences', p: 'Coats and cups by hand. Bikes in the garden every afternoon.' },
  { at: '3 years', t: 'First real friendships', p: 'Project weeks begin. Conflicts get talked through, not separated.' },
  { at: '4 years', t: 'Long projects', p: 'Build a shop, grow cress, post a letter on Schönhauser Allee.' },
  { at: '5 years', t: 'Ready for Grundschule', p: 'A transition plan with your school, agreed from the spring.' },
]

const DOT = ['bg-pink', 'bg-teal', 'bg-sun']

const PLANS = [
  {
    name: 'Part-time',
    price: 480,
    line: '3 days a week · 09:00 – 15:00',
    points: ['The shared rhythm of the room, core hours only', 'Change your days with two months’ notice', 'Meals €68 per month, billed separately'],
    featured: false,
  },
  {
    name: 'Full-time',
    price: 790,
    line: '5 days a week · 07:30 – 17:00',
    points: ['The whole day, late pick-up to 16:30 included', 'Daily photo and note from your key caregiver', 'Change or leave with two months’ notice'],
    featured: true,
  },
  {
    name: 'Extended day',
    price: 960,
    line: '5 days a week · 07:00 – 18:30',
    points: ['Doors open at 07:00, staffed from day one', 'Pick-up until 18:30, no late fee', 'Priority place for a younger sibling'],
    featured: false,
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

function CheckList({ items, check, text }: { items: string[]; check: string; text: string }) {
  const reduce = useReducedMotion()
  const view = { once: true, margin: '0px 0px -8% 0px' } as const
  return (
    <ul className="mt-4 space-y-3.5">
      {items.map((item, i) => {
        const delay = 0.08 + i * 0.14
        return (
          <li key={item} className="flex gap-3.5">
            <motion.span
              aria-hidden="true"
              className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${check}`}
              initial={reduce ? false : { scale: 0, rotate: -30 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={view}
              transition={{ duration: 0.5, ease: EXPO_OUT, delay }}
            >
              <Check size={13} strokeWidth={3.5} />
            </motion.span>
            <motion.span
              className={`text-[15.5px] leading-relaxed ${text}`}
              initial={reduce ? false : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={view}
              transition={{ duration: 0.5, ease: EXPO_OUT, delay: delay + 0.06 }}
            >
              {item}
            </motion.span>
          </li>
        )
      })}
    </ul>
  )
}

function WeekList({ week, t }: { week: { d: string; t: string }[]; t: (typeof TONE)[Tone] }) {
  return (
    <div className={`mt-8 rounded-[22px] border p-5 sm:p-6 ${t.card}`}>
      <h3 className={`font-heading text-[15px] font-extrabold uppercase tracking-[0.16em] ${t.kicker}`}>
        Typical week
      </h3>
      <ul className="mt-3.5 space-y-2.5">
        {week.map((w) => (
          <li key={w.d} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <span
              className={`text-[12px] font-extrabold uppercase tracking-[0.14em] ${t.day}`}
            >
              {w.d}
            </span>
            <span className={`text-[15px] ${t.item}`}>{w.t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ProgramSection({
  p,
  index,
  overlap,
}: {
  p: (typeof PROGRAMS)[number]
  index: number
  overlap?: ReactNode
}) {
  const t = TONE[p.tone]
  const flip = index % 2 === 1

  return (
    <section
      className={`section ${t.section} ${p.tone === 'navy' ? 'pt-40 lg:pt-52' : ''}`}
      id={p.id}
      aria-labelledby={`${p.id}-title`}
    >
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className={flip ? 'lg:order-2' : ''}>
          <span
            className={`inline-flex items-center rounded-full px-4 py-1.5 text-[13px] font-extrabold uppercase tracking-[0.14em] ${t.pill}`}
          >
            {p.age}
          </span>

          <h2 id={`${p.id}-title`} className={`h2 mt-5 ${t.head}`}>
            {p.name}
          </h2>

          <p className={`lede mt-5 ${t.lede}`}>{p.p}</p>

          <h3 className={`mt-9 font-heading text-[15px] font-extrabold uppercase tracking-[0.16em] ${t.kicker}`}>
            What your child does
          </h3>
          <CheckList items={p.does} check={t.check} text={t.item} />

          <WeekList week={p.week} t={t} />
        </div>

        <Reveal
          x={flip ? -34 : 34}
          className={`relative ${flip ? 'lg:order-1' : ''}`}
        >
          <span
            className={`absolute -bottom-5 -right-4 h-full w-full rounded-[42px] lg:-bottom-7 lg:-right-7 ${t.frame}`}
            aria-hidden="true"
          />
          <Photo
            src={IMAGES[p.slot]}
            alt={p.alt}
            w={900}
            h={p.tone === 'pink' ? 1120 : 720}
            mask={p.mask}
            className={`relative w-full ${p.aspect}`}
          />
          <span className="pill-note absolute bottom-4 left-4 shadow-lift">{p.note}</span>
        </Reveal>
      </div>

      {overlap}
    </section>
  )
}

/* ---------------------------------------------------------------- page ---- */
export default function Programs() {
  usePageMeta(
    'Programs — Little Sprouts, Toddler Trailblazers, Pre-K Pathfinders | Baby Steps Berlin',
    'Three rooms at Baby Steps in Prenzlauer Berg: Little Sprouts (6–18 months), Toddler Trailblazers (18 months–3 years) and Pre-K Pathfinders (3–5 years). Compare group sizes, daily rhythm and monthly fees.',
  )

  const reduce = useReducedMotion()

  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const d1 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -64])
  const d2 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 46])
  const d3 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -32])

  const tlRef = useRef<HTMLDivElement>(null)
  const tlInView = useInView(tlRef, { once: true, margin: '0px 0px -18% 0px' })
  const { scrollYProgress: tlProgress } = useScroll({
    target: tlRef,
    offset: ['start 85%', 'end 55%'],
  })
  const drawn = useTransform(tlProgress, [0, 0.92], [0, 1])
  const lineScale = reduce ? 1 : drawn

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="wrap grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10 lg:pb-24 lg:pt-16">
          <div className="relative z-10">
            <p className="eyebrow">STEP 02 · Programs</p>

            <h1 className="display mt-5">
              <Line delay={0.05}>Care that grows</Line>
              <Line delay={0.16}>with your child.</Line>
            </h1>

            <motion.p
              className="lede mt-7 max-w-xl"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EXPO_OUT, delay: 0.45 }}
            >
              Three rooms in one building on Kastanienallee — from first solids to the year before
              Grundschule. Each room has its own rhythm, its own nap window and the same two
              caregivers all week.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-4"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EXPO_OUT, delay: 0.58 }}
            >
              <PillCTA to="/contact" variant="pink">
                Book a tour
              </PillCTA>
              <PillCTA href="#compare" variant="outline">
                Compare the rooms
              </PillCTA>
            </motion.div>

            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.85 }}
            >
              <span className="pill-note">Ages 6 months – 5 years</span>
              <span className="pill-note">Mon – Fri 07:30 – 17:00</span>
              <span className="pill-note">Kastanienallee 24, Berlin</span>
            </motion.div>
          </div>

          {/* photo collage — three overlapping blob masks */}
          <div className="relative mx-auto h-[420px] w-full max-w-[540px] sm:h-[500px] lg:h-[560px]">
            <span
              className="absolute left-[4%] top-[6%] h-[76%] w-[66%] rounded-full bg-cream-deep"
              aria-hidden="true"
            />
            <motion.span
              style={{ y: d1 }}
              className="absolute right-[3%] top-0 h-16 w-16 rounded-full bg-sun/50 lg:h-24 lg:w-24"
              aria-hidden="true"
            />
            <motion.span
              style={{ y: d3 }}
              className="absolute bottom-[8%] left-0 hidden h-16 w-16 rounded-full border-[10px] border-teal/35 sm:block"
              aria-hidden="true"
            />

            <motion.figure
              style={{ y: d1 }}
              className="absolute left-0 top-[4%] w-[62%]"
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: EXPO_OUT, delay: 0.2 }}
            >
              <Photo
                src={IMAGES.caregiver}
                alt="A caregiver carrying two little children, one on each hip"
                w={900}
                h={1100}
                mask="mask-blob"
                eager
                className="aspect-[4/5] w-full shadow-lift"
              />
            </motion.figure>

            <motion.figure
              style={{ y: d2 }}
              className="absolute right-0 top-[28%] w-[46%]"
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: EXPO_OUT, delay: 0.38 }}
            >
              <Photo
                src={IMAGES.day1}
                alt="A child painting a bright picture with strokes of orange and blue"
                w={800}
                h={800}
                mask="mask-blob-2"
                className="aspect-square w-full shadow-lift"
              />
            </motion.figure>

            <motion.figure
              style={{ y: d3 }}
              className="absolute left-[26%] top-[56%] w-[46%]"
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: EXPO_OUT, delay: 0.54 }}
            >
              <Photo
                src={IMAGES.fac6}
                alt="The garden door at Baby Steps standing open onto the courtyard"
                w={800}
                h={640}
                mask="mask-blob"
                className="aspect-[5/4] w-full shadow-lift"
              />
            </motion.figure>

            <motion.div
              className="absolute bottom-[2%] right-[2%] flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-bold shadow-lift"
              initial={reduce ? false : { opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EXPO_OUT, delay: 1 }}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-teal-soft text-teal-dark">
                <Users size={15} aria-hidden="true" />
              </span>
              One key person per child
            </motion.div>
          </div>
        </div>
      </section>

      <Wave from="#FFF9F1" to="#FFE3EE" />

      {/* ========================= LITTLE SPROUTS ========================= */}
      <ProgramSection p={PROGRAMS[0]} index={0} />

      <Wave from="#FFE3EE" to="#DFF6F2" />

      {/* ======================= TODDLER TRAILBLAZERS ======================= */}
      <ProgramSection
        p={PROGRAMS[1]}
        index={1}
        overlap={
          <div className="wrap">
            <Reveal className="relative z-20 mx-auto -mb-36 max-w-2xl lg:-mb-52">
              <div className="flex items-start gap-5 rounded-[26px] border border-line bg-white p-6 shadow-lift sm:p-7">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sun text-navy">
                  <Users size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-heading text-[19px] font-extrabold">
                    Moving up is a handover, not a switch
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-navy-soft">
                    Two to three weeks of overlap with the next group before your child changes
                    rooms, and the key person crosses first.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        }
      />

      {/* ======================= PRE-K PATHFINDERS ======================= */}
      <ProgramSection p={PROGRAMS[2]} index={2} />

      <Wave from="#242138" to="#FFFFFF" />

      {/* =========================== COMPARISON =========================== */}
      <section className="section bg-white" id="compare" aria-labelledby="compare-title">
        <div className="wrap">
          <SectionHead
            kicker="Side by side"
            title="Which room fits today"
            lede="Same building, same caregivers, three different days. Here is what changes between the rooms — and what never does."
            align="center"
            id="compare-title"
          />

          {/* desktop: table with a sticky header row */}
          <div className="mt-12 hidden md:block">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Age, group size, focus and daily rhythm for the three Baby Steps programs
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky top-[74px] z-20 rounded-tl-[22px] bg-navy px-5 py-4 text-[12.5px] font-extrabold uppercase tracking-[0.16em] text-sun"
                  >
                    Room
                  </th>
                  {COLS.map((c) => (
                    <th
                      key={c}
                      scope="col"
                      className="sticky top-[74px] z-20 bg-navy px-5 py-4 text-[12.5px] font-extrabold uppercase tracking-[0.16em] text-sun last:rounded-tr-[22px]"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((r, i) => {
                  const last = i === COMPARE.length - 1
                  return (
                    <tr
                      key={r.name}
                      className={`border-b border-line last:border-0 ${i % 2 ? 'bg-cream/70' : 'bg-white'}`}
                    >
                      <th
                        scope="row"
                        className={`px-5 py-6 align-top ${last ? 'rounded-bl-[22px]' : ''}`}
                      >
                        <span className="block font-heading text-[21px] font-extrabold leading-tight">
                          {r.name}
                        </span>
                      </th>
                      <td className="px-5 py-6 align-top">
                        <Tag tone={r.tone}>{r.age}</Tag>
                      </td>
                      <td className="px-5 py-6 align-top text-[14.5px] font-semibold text-navy">
                        {r.size}
                      </td>
                      <td className="px-5 py-6 align-top text-[14.5px] text-navy-soft">{r.focus}</td>
                      <td
                        className={`px-5 py-6 align-top text-[14.5px] text-navy-soft ${
                          last ? 'rounded-br-[22px]' : ''
                        }`}
                      >
                        {r.rhythm}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* mobile: stacked cards */}
          <StaggerGroup className="mt-10 grid gap-5 md:hidden" stagger={0.08}>
            {COMPARE.map((r) => (
              <StaggerItem key={r.name}>
                <article className="rounded-[24px] border border-line bg-white p-6 shadow-soft">
                  <Tag tone={r.tone}>{r.age}</Tag>
                  <h3 className="mt-3 font-heading text-[24px] font-extrabold">{r.name}</h3>
                  <dl className="mt-4 space-y-3">
                    {[
                      { k: 'Group size', v: r.size },
                      { k: 'Focus', v: r.focus },
                      { k: 'Daily rhythm', v: r.rhythm },
                    ].map((row) => (
                      <div
                        key={row.k}
                        className="flex gap-4 border-t border-line pt-3 first:border-0 first:pt-0"
                      >
                        <dt className="w-[104px] shrink-0 text-[11.5px] font-extrabold uppercase tracking-[0.12em] text-navy-soft">
                          {row.k}
                        </dt>
                        <dd className="text-[15px] text-navy">{row.v}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal className="mt-7 text-center text-[14.5px] text-navy-soft">
            Twelve children is our ceiling. Infant and toddler rooms run under it, so every child
            keeps the same key person all week.
          </Reveal>
        </div>
      </section>

      <Wave from="#FFFFFF" to="#FFF9F1" />

      {/* =========================== MILESTONES =========================== */}
      <section className="section overflow-hidden" id="milestones" aria-labelledby="milestones-title">
        <Footprints className="right-6 top-10 hidden lg:block" color="#0fa79a" count={4} />
        <div className="wrap">
          <SectionHead
            kicker="Growing up here"
            title="From first solids to first school bag"
            lede="Children move at their own speed. These are the markers we watch for — and the support that sits behind each one."
            align="center"
            id="milestones-title"
          />

          <div ref={tlRef} className="mt-12">
            <div
              tabIndex={0}
              role="group"
              aria-label="Milestone timeline from 6 months to 5 years, scroll sideways to follow it"
              className="-mx-6 overflow-x-auto px-6 pb-6 scrollbar-none lg:mx-0 lg:px-0"
            >
              <div className="relative min-w-max pr-6">
                <span
                  className="absolute inset-x-0 top-[6px] h-[4px] rounded-full bg-line"
                  aria-hidden="true"
                />
                <motion.span
                  className="absolute inset-x-0 top-[6px] h-[4px] origin-left rounded-full bg-gradient-to-r from-pink via-teal to-sun"
                  style={{ scaleX: lineScale }}
                  aria-hidden="true"
                />
                <ol className="relative flex gap-5">
                  {MILESTONES.map((m, i) => {
                    const delay = 0.12 + i * 0.11
                    const shown = { opacity: 1, scale: 1, y: 0 }
                    const hidden = reduce
                      ? shown
                      : { opacity: 0, scale: 0.7, y: 16 }
                    return (
                      <li key={m.at} className="w-[176px] shrink-0">
                        <motion.span
                          aria-hidden="true"
                          className={`block h-4 w-4 rounded-full ring-4 ring-cream ${DOT[i % DOT.length]}`}
                          initial={hidden}
                          animate={tlInView ? shown : hidden}
                          transition={{ duration: 0.5, ease: EXPO_OUT, delay }}
                        />
                        <motion.div
                          className="mt-5 rounded-[22px] border border-line bg-white p-4 shadow-soft"
                          initial={hidden}
                          animate={tlInView ? shown : hidden}
                          transition={{ duration: 0.55, ease: EASE_OUT, delay: delay + 0.05 }}
                        >
                          <h3 className="font-heading text-[19px] font-extrabold leading-none">
                            {m.at}
                          </h3>
                          <p className="mt-2 text-[14px] font-bold text-pink">{m.t}</p>
                          <p className="mt-1.5 text-[13.5px] leading-snug text-navy-soft">{m.p}</p>
                        </motion.div>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </div>
            <p className="mt-1 text-[14px] text-navy-soft">
              Scroll sideways to follow the line — the timeline draws as you scroll.
            </p>
          </div>
        </div>
      </section>

      <Wave from="#FFF9F1" to="#FFF0E0" />

      {/* ============================= PRICING ============================= */}
      <section className="section bg-cream-deep" id="pricing" aria-labelledby="pricing-title">
        <div className="wrap">
          <SectionHead
            kicker="Fees"
            title="What it costs, in plain euros"
            lede="Fees are per month and hold for a year. Meals are €68 a month on top, cooked here and billed separately."
            align="center"
            id="pricing-title"
          />

          <StaggerGroup className="mt-12 grid items-start gap-6 md:grid-cols-3" stagger={0.1}>
            {PLANS.map((plan) => (
              <StaggerItem key={plan.name} className={plan.featured ? 'lg:-mt-6' : ''}>
                <article
                  className={`flex h-full flex-col rounded-[28px] border p-7 ${
                    plan.featured
                      ? 'border-navy bg-navy text-cream shadow-lift'
                      : 'border-line bg-white shadow-soft'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className={`font-heading text-[23px] font-extrabold ${
                        plan.featured ? 'text-cream' : 'text-navy'
                      }`}
                    >
                      {plan.name}
                    </h3>
                    {plan.featured && (
                      <span className="shrink-0 rounded-full bg-sun px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.12em] text-navy">
                        Most chosen
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-1.5 text-[13.5px] font-semibold ${
                      plan.featured ? 'text-cream/65' : 'text-navy-soft'
                    }`}
                  >
                    {plan.line}
                  </p>

                  <p className="mt-6 flex items-baseline gap-1.5">
                    <span
                      className={`font-heading text-[46px] font-extrabold leading-none ${
                        plan.featured ? 'text-sun' : 'text-pink'
                      }`}
                    >
                      <Counter to={plan.price} prefix="€" />
                    </span>
                    <span
                      className={`text-[14px] font-semibold ${
                        plan.featured ? 'text-cream/60' : 'text-navy-soft'
                      }`}
                    >
                      / month
                    </span>
                  </p>

                  <ul className="mt-6 space-y-3">
                    {plan.points.map((pt) => (
                      <li key={pt} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                            plan.featured ? 'bg-sun text-navy' : 'bg-teal-soft text-teal-dark'
                          }`}
                        >
                          <Check size={12} strokeWidth={3.5} />
                        </span>
                        <span
                          className={`text-[14.5px] leading-relaxed ${
                            plan.featured ? 'text-cream/85' : 'text-navy'
                          }`}
                        >
                          {pt}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-7">
                    <PillCTA to="/contact" variant={plan.featured ? 'sun' : 'outline'}>
                      Ask about a place
                    </PillCTA>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal className="mt-9 flex justify-center">
            <p className="pill-note shadow-soft">
              Ask us about waiting list and Kita-Gutschein support
            </p>
          </Reveal>
        </div>
      </section>

      <Wave from="#FFF0E0" to="#242138" />

      {/* ============================== CTA ============================== */}
      <section className="section bg-navy" id="visit" aria-labelledby="visit-title">
        <div className="wrap grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <SectionHead
              kicker="Next step"
              title="See the room your child would join"
              lede="Tours run Tuesday and Thursday at 10:00, while the rooms are busy — an ordinary day, not a tidy one."
              tone="cream"
              id="visit-title"
            />

            <Reveal className="mt-9 flex flex-wrap items-center gap-4">
              <PillCTA to="/contact" variant="sun">
                Book a tour
              </PillCTA>
              <a
                href="tel:+493012345678"
                className="inline-flex items-center gap-2.5 rounded-full border-2 border-white/20 px-7 py-3.5 text-[15px] font-semibold text-cream transition-colors duration-300 hover:border-sun hover:text-sun"
              >
                <Phone size={16} aria-hidden="true" />
                +49 30 1234 5678
              </a>
            </Reveal>

            <Reveal delay={0.1} className="mt-7">
              <span className="pill-note border-white/15 bg-white/10 text-cream">
                Three families per tour, so you get to ask everything
              </span>
            </Reveal>
          </div>

          <Reveal x={34} className="rounded-[30px] border border-white/10 bg-white/[0.05] p-7 lg:p-9">
            <h3 className="font-heading text-[26px] font-extrabold text-cream">Baby Steps</h3>
            <p className="mt-1.5 text-[15px] text-cream/60">
              Creche &amp; daycare for children 6 months to 5 years
            </p>

            <dl className="mt-7 space-y-5">
              {[
                { icon: MapPin, t: 'Address', v: 'Kastanienallee 24, 10435 Berlin\nPrenzlauer Berg', href: undefined },
                { icon: Phone, t: 'Phone', v: '+49 30 1234 5678', href: 'tel:+493012345678' },
                { icon: Clock, t: 'Hours', v: 'Mon – Fri 07:30 – 17:00', href: undefined },
              ].map((c) => (
                <div key={c.t} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-sun">
                    <c.icon size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-[12.5px] font-extrabold uppercase tracking-[0.16em] text-cream/50">
                      {c.t}
                    </dt>
                    <dd className="mt-1 text-[15.5px] text-cream/85">
                      {c.href ? (
                        <a
                          href={c.href}
                          className="transition-colors duration-300 hover:text-sun"
                        >
                          {c.v}
                        </a>
                      ) : (
                        <span className="whitespace-pre-line">{c.v}</span>
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <p className="mt-7 border-t border-white/10 pt-5 text-[14.5px] text-cream/60">
              Write to{' '}
              <a
                href="mailto:hello@babysteps.de"
                className="font-semibold text-sun underline-offset-4 hover:underline"
              >
                hello@babysteps.de
              </a>{' '}
              — a person replies, usually the same day.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
