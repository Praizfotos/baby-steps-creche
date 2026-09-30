import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import {
  ShieldCheck,
  Users,
  Mail,
  Utensils,
  Phone,
  MapPin,
  Clock,
  Star,
} from 'lucide-react'
import { usePageMeta, SectionHead, Wave, Counter, PullQuote, Collapsible } from '@/components/ui'
import { Photo } from '@/components/Photo'
import ContactForm from '@/components/ContactForm'
import { IMAGES } from '@/lib/images'
import { Reveal, StaggerGroup, StaggerItem, PillCTA, EXPO_OUT } from '@/lib/motion'

/* ---------------------------------------------------------------- data ---- */
const VALUES = [
  {
    n: '01',
    t: 'One key person per child',
    p: 'Your child is paired with a named caregiver on day one. The same face at drop-off, the same face at pick-up, and someone who already knows how your child likes to be held.',
  },
  {
    n: '02',
    t: 'Outside, in every weather',
    p: 'Two hours a day in our garden or across the road in Volkspark Prenzlauer Berg. Rain suits and spare boots live by the door — send a puddle suit rather than stay home.',
  },
  {
    n: '03',
    t: 'Food cooked here, this morning',
    p: 'Organic, mostly vegetarian, eaten together at the table. Menus go out every Sunday, and we cook around allergies rather than around convenience.',
  },
]

const STATS = [
  { to: 12, suffix: '', l: 'Children per group, maximum' },
  { to: 4, suffix: ':1', l: 'Children per caregiver' },
  { to: 400, suffix: ' m²', l: 'Garden and courtyard' },
  { to: 3, suffix: ' PM', l: 'Daily photo and note' },
]

const TRUST = [
  { icon: Users, t: 'Small groups', p: 'Twelve children max, one caregiver to four.' },
  { icon: ShieldCheck, t: 'Secured facility', p: 'Keypad entry, gated courtyard, sign-in at the door.' },
  { icon: Mail, t: 'Daily updates', p: 'A photo and a note about the day, by 3 PM.' },
  { icon: Utensils, t: 'Healthy meals', p: 'Organic breakfast, warm lunch, two snacks — cooked here.' },
]

const PROGRAMS = [
  {
    slot: 'prog1' as const,
    age: '6 – 18 months',
    name: 'Little Sprouts',
    p: 'Feeding and nap times follow the schedule you already have at home, so the first weeks are about trust rather than adjustment. Lots of floor time, water play, and one adult who stays with the same small group all day.',
    list: [
      'Home nap and feeding rhythm, kept for at least three months',
      'Sensory corner, mirror wall and low climbing frames',
      'Nappy changes logged and shared in the daily note',
    ],
    tone: 'pink',
  },
  {
    slot: 'prog2' as const,
    age: '18 months – 3 years',
    name: 'Toddler Trailblazers',
    p: 'The age of “me do it”. We build the day around short, repeatable tasks — hanging coats, setting cups, putting shoes in the basket — and give toddlers the time to finish them.',
    list: [
      'Circle time, songs and first words in German and English',
      'Potty training supported at your pace, not ours',
    ],
    tone: 'teal',
  },
  {
    slot: 'prog3' as const,
    age: '3 – 5 years',
    name: 'Pre-K Pathfinders',
    p: 'Letters, numbers and long projects — building a shop, growing cress, posting letters on Schönhauser Allee. School readiness comes out of real tasks, not worksheets.',
    list: [
      'Weekly project weeks with a walk into the neighbourhood',
      'A transition plan with your Grundschule from the spring',
    ],
    tone: 'sun',
  },
]

const DAY = [
  {
    time: '07:30 – 09:00',
    t: 'Arrival & free play',
    p: 'Slow start. Coats off, breakfast at the big table, and whatever is out on the floor that morning.',
  },
  {
    time: '09:00 – 10:00',
    t: 'Morning circle',
    p: 'Songs, the weather, and one long activity — painting, water play, or the week’s project.',
  },
  {
    time: '10:00 – 12:00',
    t: 'Outside, whatever the weather',
    p: 'Our garden in summer, Volkspark in the rain. Buckets, mud kitchen, bikes and the long walk to the duck pond.',
  },
  {
    time: '12:00 – 13:00',
    t: 'Lunch together',
    p: 'Warm food cooked on site, served family style. Everyone sits, nobody is rushed, seconds if you want them.',
  },
  {
    time: '13:00 – 15:00',
    t: 'Rest & quiet corners',
    p: 'Cots for the little ones; books, puzzles and drawing mats for those who have stopped sleeping.',
  },
  {
    time: '15:00 – 17:00',
    t: 'Snack, photo, pick-up',
    p: 'Fruit and bread at 15:00. Your update lands at 15:00 too. Late pick-up until 17:00, by arrangement.',
  },
]

const ROOMS = [
  { slot: 'fac1' as const, label: 'Play room', sub: 'Open floor, soft edges', span: 'lg:col-span-2', ratio: 'aspect-[16/10]' },
  { slot: 'fac2' as const, label: 'Reading corner', sub: '600 picture books', span: '', ratio: 'aspect-square' },
  { slot: 'fac3' as const, label: 'Garden', sub: '400 m², gated', span: '', ratio: 'aspect-[4/5]' },
  { slot: 'fac4' as const, label: 'Nap room', sub: 'Blackout blinds, air purifier', span: '', ratio: 'aspect-[4/3]' },
  { slot: 'fac5' as const, label: 'Art table', sub: 'Washable everything', span: 'lg:col-span-2', ratio: 'aspect-[16/9]' },
  { slot: 'fac6' as const, label: 'Out the door', sub: 'Volkspark, 4 minutes', span: '', ratio: 'aspect-square' },
]

const CHIPS = [
  'Gated courtyard',
  'Keypad entry',
  'Buggy storage',
  'Separate nappy room',
  'Step-free access',
  'Street parking on Kastanienallee',
]

const VOICES = [
  {
    q: 'The 3 PM update is the reason I stopped checking my phone at work. Yesterday it was a photo of Lina asleep in the garden with a leaf stuck to her shoe.',
    who: 'Anneke',
    role: 'Mother of Lina (1 year, 4 months)',
  },
  {
    q: 'We moved from a Kita with 24 children. Emil has the same two caregivers every day, and he learned to put his own shoes on in the first month.',
    who: 'Tobias',
    role: 'Father of Emil (3 years)',
  },
  {
    q: 'They asked how warm Nora likes her porridge, whether she needs white noise, which stuffed animal she sleeps with. Nobody had ever asked us that much before.',
    who: 'Yasmin',
    role: 'Mother of Nora (8 months)',
  },
]

const FAQ_TEASER = [
  {
    q: 'What ages do you take?',
    a: 'From 6 months to 5 years, in three rooms: Little Sprouts (6–18 months), Toddler Trailblazers (18 months–3 years) and Pre-K Pathfinders (3–5 years). Children move up when they are ready, usually over two or three weeks rather than on one fixed date.',
  },
  {
    q: 'What are your opening hours?',
    a: 'Monday to Friday, 07:30 to 17:00. Core hours are 09:00–15:00, when all groups run the same programme; arrival and pick-up are flexible around that. Late pick-up after 16:30 is included.',
  },
  {
    q: 'Do you provide food?',
    a: 'Yes. Organic breakfast from 07:30, a warm lunch cooked on site, and two snacks — one mid-morning, one at 15:00. Menus go out every Sunday. Vegetarian is our default, and we cook around allergies.',
  },
  {
    q: 'How does the settling-in period work?',
    a: 'Two to three weeks, at your child’s pace. On day one you stay for the whole morning. We then shorten your visits together, and your key caregiver calls you the moment your child settles, not at the end of the day.',
  },
  {
    q: 'Can we visit before enrolling?',
    a: 'Please do. Tours run Tuesday and Thursday at 10:00, when the rooms are in full swing and you can see an ordinary day rather than a tidy one. We keep group tours to three families at a time.',
  },
  {
    q: 'How does financing work in Berlin?',
    a: 'We accept the Berlin Kita-Gutschein. Once the Bezirksamt has issued it, bring the voucher to your tour and we handle the paperwork. Meals are billed separately at €68 per month.',
  },
]

const CARD_TONE: Record<string, string> = {
  pink: 'bg-pink-soft',
  teal: 'bg-teal-soft',
  sun: 'bg-sun/25',
}

/* -------------------------------------------------------------- helpers ---- */
function Line({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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

/* ---------------------------------------------------------------- page ---- */
export default function Home() {
  usePageMeta(
    'Baby Steps Creche & Daycare — Prenzlauer Berg, Berlin',
    'A small creche in Prenzlauer Berg for children 6 months to 5 years. Twelve children per group, two hours outside daily, a photo and note by 3 PM.',
  )

  const heroRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const d1 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70])
  const d2 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60])
  const d3 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40])

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="wrap grid items-center gap-12 pb-20 pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:pb-28 lg:pt-16">
          <div className="relative z-10">
            <p className="eyebrow">
              <svg viewBox="0 0 24 30" width="13" height="17" fill="none" aria-hidden="true">
                <path
                  d="M12 2C8 2 6 6 6 10c0 3 1.2 4.5 1.2 7 0 4-2.8 5-2.8 8.5 0 1.5 1.2 2.5 3 2.5 3 0 4.6-2 4.6-2s1.6 2 4.6 2c1.8 0 3-1 3-2.5 0-3.5-2.8-4.5-2.8-8.5 0-2.5 1.2-4 1.2-7 0-4-2-8-6-8z"
                  fill="currentColor"
                />
              </svg>
              Prenzlauer Berg · Berlin
            </p>

            <h1 className="display mt-5">
              <Line delay={0.05}>Where little feet</Line>
              <Line delay={0.16}>take their</Line>
              <Line delay={0.27}>
                first{' '}
                <span className="relative inline-block whitespace-nowrap">
                  big steps
                  <svg
                    viewBox="0 0 300 14"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-3 w-full"
                  >
                    <path
                      d="M2 10 Q75 2 150 8 T298 6"
                      stroke="#FFC94A"
                      strokeWidth="7"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                .
              </Line>
            </h1>

            <motion.p
              className="lede mt-7 max-w-xl"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EXPO_OUT, delay: 0.5 }}
            >
              A creche and daycare for children 6 months to 5 years. Twelve children per group, two
              hours outside every day, and a photo and note from your child’s caregiver by 3&nbsp;PM.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-4"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EXPO_OUT, delay: 0.62 }}
            >
              <PillCTA href="tel:+493012345678" variant="pink">
                Call +49 30 1234 5678
              </PillCTA>
              <PillCTA to="/contact" variant="outline">
                Book a tour
              </PillCTA>
            </motion.div>

            <motion.div
              className="mt-10 flex items-center gap-3 text-[13.5px] font-semibold uppercase tracking-[0.16em] text-navy-soft"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <span className="h-8 w-px bg-line" aria-hidden="true" />
              Scroll to take a look
            </motion.div>
          </div>

          {/* art */}
          <div className="relative">
            <motion.span
              style={{ y: d1 }}
              className="absolute -left-4 -top-6 h-24 w-24 rounded-full bg-sun/45 lg:-left-10 lg:h-32 lg:w-32"
              aria-hidden="true"
            />
            <motion.span
              style={{ y: d2 }}
              className="absolute -right-2 top-10 h-16 w-16 rounded-full border-[10px] border-teal/35 lg:right-0 lg:h-24 lg:w-24"
              aria-hidden="true"
            />
            <motion.span
              style={{ y: d3 }}
              className="absolute bottom-6 left-2 hidden h-20 w-20 rounded-[18px] rotate-12 bg-pink-soft lg:block"
              aria-hidden="true"
            />
            <span
              className="absolute left-1/2 top-1/2 -z-10 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream-deep"
              aria-hidden="true"
            />

            <motion.figure
              className="relative mx-auto max-w-[520px]"
              initial={reduce ? false : { opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: EXPO_OUT, delay: 0.25 }}
            >
              <Photo
                src={IMAGES.hero}
                alt="A laughing toddler with colourful paint on her face and hands, playing outside"
                w={900}
                h={1100}
                mask="mask-blob"
                eager
                className="aspect-[4/5] w-full"
              />
            </motion.figure>

            <motion.div
              className="absolute -left-1 top-16 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13.5px] font-bold shadow-lift sm:-left-6"
              initial={reduce ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EXPO_OUT, delay: 1 }}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-pink-soft text-pink">
                <ShieldCheck size={15} aria-hidden="true" />
              </span>
              Small caring groups
            </motion.div>

            <motion.div
              className="absolute -right-1 bottom-14 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13.5px] font-bold shadow-lift sm:-right-6"
              initial={reduce ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: EXPO_OUT, delay: 1.15 }}
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-teal-soft text-teal-dark">
                <Users size={15} aria-hidden="true" />
              </span>
              Ages 6 months – 5 years
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================ ABOUT ============================ */}
      <section className="section relative pb-0" id="about">
        <div className="wrap grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal x={-40} className="relative lg:pt-16">
            <div className="relative">
              <span
                className="absolute -left-5 -top-5 h-full w-full rounded-[36px] bg-teal/85 lg:-left-8 lg:-top-8"
                aria-hidden="true"
              />
              <Photo
                src={IMAGES.about}
                alt="A caregiver sitting beside a young child, reading a picture book together at a table"
                w={900}
                h={1100}
                mask="mask-arch"
                className="relative aspect-[4/5] w-full"
              />
            </div>
            <div
              className="absolute -bottom-8 right-4 grid h-28 w-28 -rotate-[8deg] place-items-center rounded-full bg-sun text-center text-[12px] font-extrabold uppercase leading-tight tracking-wider text-navy shadow-lift lg:right-0"
              aria-hidden="true"
            >
              Est. 2024 ·
              <br />
              Prenzlauer
              <br />
              Berg
            </div>
          </Reveal>

          <div>
            <SectionHead step="STEP 01" kicker="Who we are" title="Familiar faces, every single day" />
            <Reveal delay={0.06} className="mt-5">
              <p className="lede">
                Baby Steps is a 12-place creche in a converted corner house on Kastanienallee. One
                group of infants, one of toddlers, one of pre-schoolers — and the same caregivers with
                them from Monday to Friday.
              </p>
            </Reveal>
            <Reveal delay={0.12} className="mt-4">
              <p className="lede">
                We opened it because we wanted somewhere we would happily leave our own children:
                quiet when it needs to be loud, unhurried, and run by people who notice when a child
                is off their food before the parent does.
              </p>
            </Reveal>

            <StaggerGroup className="mt-9 space-y-6" stagger={0.1}>
              {VALUES.map((v) => (
                <StaggerItem key={v.n}>
                  <div className="flex gap-5 rounded-[24px] border border-line bg-white p-6 transition-shadow duration-300 hover:shadow-lift">
                    <span className="font-heading text-[34px] font-extrabold leading-none text-pink/25">
                      {v.n}
                    </span>
                    <div>
                      <h3 className="h3 text-[21px]">{v.t}</h3>
                      <p className="mt-2 text-[15.5px] leading-relaxed text-navy-soft">{v.p}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>

        {/* full-width stats */}
        <div className="wrap mt-16 lg:mt-24">
          <div className="grid overflow-hidden rounded-[30px] border border-line bg-white shadow-lift sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal
                key={s.l}
                delay={i * 0.08}
                x={i % 2 === 0 ? -30 : 30}
                className={`px-7 py-8 ${i ? 'border-t border-line sm:border-t-0 sm:border-l' : ''} ${
                  i > 1 ? 'lg:border-t-0' : ''
                }`}
              >
                <div className="font-heading text-[44px] font-extrabold leading-none text-pink">
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-[14.5px] font-semibold text-navy-soft">{s.l}</div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16 lg:mt-24">
          <div
            className="marquee overflow-hidden border-y border-line bg-cream-deep py-5"
            aria-hidden="true"
          >
            <div className="marquee-track">
              {Array.from({ length: 4 }).map((_, k) => (
                <span key={k} className="flex items-center">
                  {['Play', 'Learn', 'Grow', 'Laugh'].map((w) => (
                    <span key={w} className="flex items-center gap-5 px-5">
                      <i className="h-2.5 w-2.5 rounded-full bg-pink" />
                      <span className="font-heading text-[26px] font-extrabold uppercase tracking-tight text-navy/75">
                        {w}
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================== TRUST BAR ========================== */}
      <section className="bg-navy py-12" aria-label="What families get">
        <div className="wrap grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t, i) => (
            <Reveal key={t.t} delay={i * 0.07} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-sun">
                <t.icon size={19} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-heading text-[19px] font-bold text-cream">{t.t}</h3>
                <p className="mt-1 text-[14.5px] leading-relaxed text-cream/65">{t.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* =========================== PROGRAMS =========================== */}
      <section className="section" id="programs">
        <div className="wrap">
          <SectionHead
            step="STEP 02"
            kicker="Our programs"
            title="Three rooms, three rhythms"
            lede="Children move up when they are ready, not when the calendar says so. Each room has its own rhythm, its own nap window, and its own two caregivers."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {PROGRAMS.map((p, i) => {
              const lead = i === 0
              return (
                <Reveal
                  key={p.name}
                  delay={i * 0.08}
                  className={lead ? 'lg:row-span-2' : ''}
                >
                  <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-white transition-shadow duration-300 hover:shadow-lift">
                    <Photo
                      src={IMAGES[p.slot]}
                      alt={
                        lead
                          ? 'A baby laughing while lying beside a red balloon'
                          : i === 1
                            ? 'A child’s hand stacking illustrated picture blocks into a tower'
                            : 'Two young girls reading a picture book together outdoors'
                      }
                      w={i === 0 ? 1000 : 800}
                      h={i === 0 ? 580 : 500}
                      className={`${lead ? 'aspect-[16/9]' : 'aspect-[16/10]'} w-full`}
                    />
                    <div className={`flex flex-1 flex-col p-7 ${lead ? 'lg:p-9' : ''}`}>
                      <span
                        className={`w-fit rounded-full px-3.5 py-1.5 text-[12.5px] font-bold uppercase tracking-wider ${CARD_TONE[p.tone]} ${
                          p.tone === 'pink'
                            ? 'text-pink-dark'
                            : p.tone === 'teal'
                              ? 'text-teal-dark'
                              : 'text-[#8a5f00]'
                        }`}
                      >
                        {p.age}
                      </span>
                      <h3 className={`mt-4 ${lead ? 'h2 text-[34px] lg:text-[40px]' : 'h3'}`}>
                        {p.name}
                      </h3>
                      <p className="mt-3 text-[15.5px] leading-relaxed text-navy-soft">{p.p}</p>
                      <ul className="mt-5 space-y-2.5">
                        {p.list.map((li) => (
                          <li key={li} className="flex gap-3 text-[15px] text-navy">
                            <span
                              className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-soft text-[11px] font-bold text-teal-dark"
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                            {li}
                          </li>
                        ))}
                      </ul>
                      <Link
                        to="/day-here"
                        className="mt-auto inline-flex items-center gap-2 pt-6 text-[15px] font-bold text-pink transition-transform duration-300 hover:translate-x-1"
                      >
                        See the daily rhythm <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <Wave from="#FFF9F1" to="#FFF0E0" />

      {/* =========================== PULL QUOTE =========================== */}
      <section className="section relative z-10 bg-cream-deep">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <PullQuote cite="Nadine Krause — lead educator, Baby Steps">
              Children don’t need to be rushed. They need the same face, the same garden, and enough
              time to finish what they started.
            </PullQuote>
          </div>
          <Reveal
            y={60}
            className="relative z-20 -mb-24 lg:-mb-44"
          >
            <Photo
              src={IMAGES.quote}
              alt="A group of preschoolers wearing paper crowns, sitting together during circle time"
              w={700}
              h={930}
              mask="mask-blob-2"
              className="aspect-[3/4] w-full shadow-lift"
            />
          </Reveal>
        </div>
      </section>

      <Wave from="#FFF0E0" to="#FFFFFF" />

      {/* ============================= A DAY ============================= */}
      <section className="section relative bg-white" id="day">
        <div className="wrap">
          <SectionHead
            step="STEP 03"
            kicker="A day here"
            title="A day your child can predict"
            lede="Rhythm beats variety. When children know what happens next, they stop testing the day and start enjoying it."
          />

          <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <ol className="relative border-l-2 border-dashed border-line pl-8">
                {DAY.map((d, i) => (
                  <Reveal key={d.t} delay={i * 0.06} className="relative pb-9 last:pb-0">
                    <span
                      className="absolute -left-[41px] top-1 grid h-7 w-7 place-items-center rounded-full bg-teal text-white"
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 24 30" width="11" height="14" fill="currentColor">
                        <path d="M12 2C8 2 6 6 6 10c0 3 1.2 4.5 1.2 7 0 4-2.8 5-2.8 8.5 0 1.5 1.2 2.5 3 2.5 3 0 4.6-2 4.6-2s1.6 2 4.6 2c1.8 0 3-1 3-2.5 0-3.5-2.8-4.5-2.8-8.5 0-2.5 1.2-4 1.2-7 0-4-2-8-6-8z" />
                      </svg>
                    </span>
                    <div className="rounded-[22px] border border-line bg-cream/60 p-6 transition-colors duration-300 hover:bg-cream-deep">
                      <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-pink">
                        {d.time}
                      </div>
                      <h3 className="mt-2 font-heading text-[22px] font-bold">{d.t}</h3>
                      <p className="mt-2 text-[15.5px] leading-relaxed text-navy-soft">{d.p}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
              <p className="mt-6 text-[14.5px] text-navy-soft">
                Sample day for the toddler room. Infant and pre-school rooms shift by about an hour
                either way.
              </p>
            </div>

            <div className="grid content-start gap-5 lg:sticky lg:top-28">
              <Reveal delay={0.05}>
                <Photo
                  src={IMAGES.day1}
                  alt="A child painting a bright picture with strokes of orange and blue"
                  w={800}
                  h={600}
                  mask="mask-soft"
                  className="aspect-[4/3] w-full"
                />
              </Reveal>
              <Reveal delay={0.14} x={30}>
                <Photo
                  src={IMAGES.day2}
                  alt="A bowl of fresh fruit, berries and banana slices prepared for snack time"
                  w={800}
                  h={500}
                  mask="mask-soft"
                  className="aspect-[8/5] w-full"
                />
              </Reveal>
              <Reveal delay={0.2}>
                <span className="pill-note">Art at 11:15 · snack at 15:00</span>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <Wave from="#FFFFFF" to="#FFF9F1" />

      {/* =========================== FACILITY =========================== */}
      <section className="section" id="facility">
        <div className="wrap">
          <SectionHead
            step="STEP 04"
            kicker="Around the house"
            title="Every room built at child height"
            lede="Low hooks, wide doorways, windows you can see through, and a garden you can get to without crossing a road."
            align="center"
          />

          <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {ROOMS.map((r) => (
              <StaggerItem key={r.slot} className={r.span}>
                <figure className="group relative overflow-hidden rounded-[26px] border border-line bg-white">
                  <Photo
                    src={IMAGES[r.slot]}
                    alt={`${r.label} at Baby Steps — ${r.sub}`}
                    w={800}
                    h={640}
                    className={`${r.ratio} w-full`}
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                  <figcaption className="flex items-baseline justify-between gap-3 bg-white px-5 py-4">
                    <span className="font-heading text-[19px] font-bold">{r.label}</span>
                    <span className="text-right text-[13px] font-semibold text-navy-soft">
                      {r.sub}
                    </span>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal className="mt-8 flex flex-wrap justify-center gap-3">
            {CHIPS.map((c) => (
              <span key={c} className="pill-note">
                {c}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      <Wave from="#FFF9F1" to="#242138" />

      {/* ============================ VOICES ============================ */}
      <section className="section bg-navy" id="voices">
        <div className="wrap">
          <SectionHead
            step="STEP 05"
            kicker="Parents"
            title="What drop-off sounds like here"
            lede="Three families who let us quote them."
            align="center"
            tone="cream"
          />

          <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.1}>
            {VOICES.map((v) => (
              <StaggerItem key={v.who}>
                <figure className="flex h-full flex-col rounded-[26px] border border-white/10 bg-white/[0.05] p-7">
                  <div className="flex gap-1 text-sun" aria-label="5 out of 5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" aria-hidden="true" />
                    ))}
                  </div>
                  <blockquote className="mt-5 text-[16px] leading-relaxed text-cream/85">
                    “{v.q}”
                  </blockquote>
                  <figcaption className="mt-auto pt-6">
                    <span className="block font-heading text-[17px] font-bold text-cream">
                      {v.who}
                    </span>
                    <span className="text-[13.5px] text-cream/55">{v.role}</span>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal className="mt-10 flex flex-col items-center justify-between gap-5 rounded-[26px] bg-white/[0.06] px-7 py-6 md:flex-row">
            <p className="max-w-xl text-[15.5px] text-cream/75">
              Want to hear it from them in person? We put you in touch with a current family before
              you decide.
            </p>
            <PillCTA to="/contact" variant="sun">
              Arrange a visit
            </PillCTA>
          </Reveal>
        </div>
      </section>

      <Wave from="#242138" to="#FFF9F1" />

      {/* ============================== FAQ ============================== */}
      <section className="section" id="faq">
        <div className="wrap">
          <SectionHead
            kicker="Good to know"
            title="Questions we get asked first"
            align="center"
          />
          <FaqTeaser />
          <Reveal className="mt-8 text-center text-[15.5px] text-navy-soft">
            Something we have not covered?{' '}
            <Link to="/faq" className="font-bold text-pink underline-offset-4 hover:underline">
              Ask us directly
            </Link>{' '}
            — a person replies, usually the same day.
          </Reveal>
        </div>
      </section>

      <Wave from="#FFF9F1" to="#242138" />

      {/* ============================ CONTACT ============================ */}
      <section className="section bg-navy" id="contact">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHead
              step="STEP 06"
              kicker="Visit us"
              title="Come and see an ordinary Tuesday"
              lede="Tours at 10:00 on Tuesdays and Thursdays. Bring your child — the rooms tell you more than any page can."
              tone="cream"
            />

            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              {[
                { icon: MapPin, t: 'Address', v: 'Kastanienallee 24\n10435 Berlin, Prenzlauer Berg' },
                { icon: Phone, t: 'Phone', v: '+49 30 1234 5678', href: 'tel:+493012345678' },
                { icon: Mail, t: 'Email', v: 'hello@babysteps.de', href: 'mailto:hello@babysteps.de' },
                { icon: Clock, t: 'Hours', v: 'Mon – Fri 07:30 – 17:00\nTours 10:00 Tue & Thu' },
              ].map((c, i) => (
                <Reveal key={c.t} delay={i * 0.06} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-sun">
                    <c.icon size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-heading text-[17px] font-bold text-cream">{c.t}</h3>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="mt-1 inline-block text-[15px] text-cream/70 transition-all duration-300 hover:translate-x-1 hover:text-sun"
                      >
                        {c.v}
                      </a>
                    ) : (
                      <p className="mt-1 whitespace-pre-line text-[15px] text-cream/70">{c.v}</p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-8 overflow-hidden rounded-[26px] border border-white/10">
              <iframe
                title="Map showing Baby Steps at Kastanienallee 24, Berlin"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Kastanienallee%2024%2C%2010435%20Berlin&output=embed"
                className="h-[260px] w-full"
              />
            </Reveal>
          </div>

          <Reveal x={40} className="rounded-[30px] bg-white/[0.05] p-7 backdrop-blur-sm lg:p-9">
            <h3 className="font-heading text-[27px] font-extrabold text-cream">
              Send us a quick message
            </h3>
            <p className="mt-2 text-[15px] text-cream/60">
              Tell us your child’s age and when you would like to start. We reply within one working
              day.
            </p>
            <div className="mt-6">
              <ContactForm tone="dark" compact submitLabel="Request a callback" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

/* ------------------------------------------------------ FAQ accordion ----- */
function FaqTeaser() {
  const [open, setOpen] = useState(0)

  return (
    <StaggerGroup className="mx-auto mt-11 max-w-3xl divide-y divide-line overflow-hidden rounded-[26px] border border-line bg-white" stagger={0.05}>
      {FAQ_TEASER.map((f, i) => {
        const isOpen = open === i
        return (
          <StaggerItem key={f.q}>
            <div>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left transition-colors duration-300 hover:bg-cream/70"
              >
                <span className="font-heading text-[19px] font-bold">{f.q}</span>
                <motion.span
                  aria-hidden="true"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-pink-soft text-pink"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.35, ease: EXPO_OUT }}
                >
                  <span className="text-[20px] font-bold leading-none">+</span>
                </motion.span>
              </button>
              <Collapsible show={isOpen}>
                <p className="px-6 pb-6 text-[15.5px] leading-relaxed text-navy-soft">{f.a}</p>
              </Collapsible>
            </div>
          </StaggerItem>
        )
      })}
    </StaggerGroup>
  )
}
