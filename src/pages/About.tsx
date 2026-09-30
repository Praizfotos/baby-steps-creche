import { Fragment } from 'react'
import { Clock, Heart, Mail, MapPin, Phone } from 'lucide-react'
import {
  usePageMeta,
  SectionHead,
  Wave,
  Counter,
  PullQuote,
  Tag,
  Footprints,
} from '@/components/ui'
import { Photo } from '@/components/Photo'
import { IMAGES } from '@/lib/images'
import { Reveal, StaggerGroup, StaggerItem, PillCTA, Enter } from '@/lib/motion'

/* ---------------------------------------------------------------- data ---- */

const STORY_FACTS = [
  { tone: 'pink' as const, label: 'Est. 2024' },
  { tone: 'teal' as const, label: '12 children per group' },
  { tone: 'sun' as const, label: 'Ages 6 months – 5 years' },
  { tone: 'white' as const, label: '4:1 ratio' },
]

const VALUES = [
  {
    t: 'Safety',
    p: 'Every visitor signs in at the door. Windows open ten centimetres. You get the keypad code on day one, and it never changes.',
    tone: 'bg-teal-soft',
    icon: [
      'M12 3.2 19 6v5.6c0 4.3-2.9 7.5-7 9.2-4.1-1.7-7-4.9-7-9.2V6l7-2.8Z',
      'm8.9 12 2.3 2.3 4.2-4.4',
    ],
  },
  {
    t: 'Love',
    p: 'We hold, we sing, we sit at eye level. A child who feels safe is the child who tries the hard thing.',
    tone: 'bg-pink-soft',
    icon: [
      'M12 20.6 4.7 13.3a4.7 4.7 0 0 1 6.6-6.7l.7.7.7-.7a4.7 4.7 0 1 1 6.6 6.7L12 20.6Z',
    ],
  },
  {
    t: 'Curiosity',
    p: 'When the room falls in love with snails, snails become the project — for as long as the interest lasts.',
    tone: 'bg-sun/25',
    icon: [
      'M10.4 4.2a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 1 0 0-12.4Z',
      'M14.8 14.8 19.4 19.4',
      'M17.4 3.6v2.8M16 5h2.8',
    ],
  },
  {
    t: 'Community',
    p: 'The baker knows our order, Volkspark is four minutes away, and the families of each room eat together once a term.',
    tone: 'bg-white',
    icon: [
      'M9 9.2a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 1 0 0 6.2Z',
      'M3.4 19.6c0-3.1 2.5-5.6 5.6-5.6s5.6 2.5 5.6 5.6',
      'M16.8 9.9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 1 0 0 5Z',
      'M16.2 14.4c2.8 0 5 2.2 5 5',
    ],
  },
]

const VALUE_OFFSET = ['lg:mt-0', 'lg:mt-14', 'lg:mt-5', 'lg:mt-20']

const APPROACH = [
  {
    n: '01',
    t: 'Play',
    accent: 'text-pink',
    p: 'Free play opens the morning. Your child chooses the corner, the toy and the pace — an adult joins in rather than takes over.',
  },
  {
    n: '02',
    t: 'Learn',
    accent: 'text-teal',
    p: 'Circle time, songs and one long activity after lunch. German and English run side by side, so words arrive with actions.',
  },
  {
    n: '03',
    t: 'Grow',
    accent: 'text-[#c98b00]',
    p: 'Projects that run a week and sometimes a month: a shop, a garden, a letter to the bakery. Pre-schoolers finish what they start.',
  },
]

const TEAM = [
  {
    slot: 'team1' as const,
    name: 'Nadine Krause',
    role: 'Lead educator & co-founder',
    years: '11 years',
    line: 'She knows which child needs a joke and which needs two quiet minutes before circle time.',
  },
  {
    slot: 'team2' as const,
    name: 'Jonas Petrik',
    role: 'Outdoor & movement',
    years: '6 years',
    line: 'The garden is open in every weather, and he is the reason nobody minds the rain.',
  },
  {
    slot: 'team3' as const,
    name: 'Selma Aydın',
    role: 'Infant room',
    years: '8 years',
    line: 'On the floor from 7:30, following each baby’s own rhythm instead of the clock.',
  },
  {
    slot: 'team4' as const,
    name: 'Lena Hartmann',
    role: 'Pre-school teacher',
    years: '14 years',
    line: 'A question about snails turns into a three-week project the whole room follows.',
  },
]

const STATS = [
  { to: 4, prefix: '1:', suffix: '', l: 'Children per caregiver' },
  { to: 7, prefix: '', suffix: ':30', l: 'Doors open, Monday to Friday' },
  { to: 3, prefix: '', suffix: '', l: 'Age groups under one roof' },
  { to: 100, prefix: '', suffix: '%', l: 'Families get a photo and note daily' },
]

const CONTACT = [
  { icon: MapPin, t: 'Address', v: 'Kastanienallee 24, 10435 Berlin' },
  { icon: Phone, t: 'Phone', v: '+49 30 1234 5678', href: 'tel:+493012345678' },
  { icon: Mail, t: 'Email', v: 'hello@babysteps.de', href: 'mailto:hello@babysteps.de' },
  { icon: Clock, t: 'Hours', v: 'Mon – Fri 07:30 – 17:00' },
]

/* -------------------------------------------------------------- helpers ---- */

function ValueIcon({ d }: { d: string[] }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      {d.map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  )
}

function Print({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="30"
      height="30"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="10" cy="9" rx="4" ry="5.4" transform="rotate(-16 10 9)" />
      <ellipse cx="20.5" cy="13" rx="3.4" ry="4.6" transform="rotate(-16 20.5 13)" />
      <path d="M6.6 20.5c0-3.3 2.4-5.9 5.6-5.9s5.6 2.4 5.6 5.6c0 3.5-2.3 6.3-5.5 6.3s-5.7-2.6-5.7-6z" />
    </svg>
  )
}

/* ---------------------------------------------------------------- page ---- */
export default function About() {
  usePageMeta(
    'Our Story & Team — Baby Steps Creche, Prenzlauer Berg',
    'How Baby Steps began in 2024, the four values we run on and the caregivers behind them. A 12-place creche on Kastanienallee, Berlin, for children 6 months to 5 years.',
  )

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-white">
        <div className="wrap grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14 lg:pb-24 lg:pt-14">
          {/* copy — right column on desktop, first on mobile */}
          <div className="relative z-10 lg:order-2">
            <Enter delay={0.04}>
              <p className="eyebrow">STEP 01 · Our Story</p>
            </Enter>

            <Enter delay={0.14}>
              <h1 className="display mt-5">
                A small place with a{' '}
                <span className="whitespace-nowrap text-pink">big heart</span>
              </h1>
            </Enter>

            <Enter delay={0.26}>
              <p className="lede mt-6 max-w-xl">
                We run one house on Kastanienallee for children 6 months to 5 years. Twelve per
                group, four caregivers who never rotate, and time to sit on the floor until your
                child decides to trust you.
              </p>
            </Enter>

            <Enter delay={0.38}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <PillCTA to="/contact" variant="pink">
                  Book a tour
                </PillCTA>
                <PillCTA href="tel:+493012345678" variant="outline">
                  Call +49 30 1234 5678
                </PillCTA>
              </div>
            </Enter>

            <Enter delay={0.5}>
              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-6 text-[14.5px] font-semibold text-navy-soft">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} className="text-teal" aria-hidden="true" />
                  Kastanienallee 24, 10435 Berlin
                </span>
                <span className="hidden h-4 w-px bg-line sm:block" aria-hidden="true" />
                <span className="inline-flex items-center gap-2">
                  <Clock size={16} className="text-teal" aria-hidden="true" />
                  Mon – Fri 07:30 – 17:00
                </span>
              </div>
            </Enter>
          </div>

          {/* art — photo left on desktop */}
          <div className="relative lg:order-1">
            <Enter delay={0.1} className="relative mx-auto w-full max-w-[500px]">
              <span
                className="absolute -left-4 -top-4 h-full w-full rounded-[46px] bg-teal-soft lg:-left-8 lg:-top-8"
                aria-hidden="true"
              />
              <span
                className="absolute -bottom-6 -right-3 h-24 w-24 rounded-full bg-sun/45 lg:h-32 lg:w-32"
                aria-hidden="true"
              />
              <Photo
                src={IMAGES.caregiver}
                alt="A caregiver crouching outdoors with two small children, one sitting on her knee"
                w={900}
                h={1100}
                mask="mask-arch"
                eager
                className="relative aspect-[4/5] w-full"
              />

              <Enter
                delay={0.85}
                className="absolute -right-2 top-10 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13.5px] font-bold shadow-lift sm:-right-6"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-pink-soft text-pink">
                  <Heart size={15} aria-hidden="true" />
                </span>
                One key person all week
              </Enter>

              <Enter
                delay={1}
                className="absolute -left-2 bottom-14 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13.5px] font-bold shadow-lift sm:-left-6"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-teal-soft text-teal-dark">
                  <Clock size={15} aria-hidden="true" />
                </span>
                Open 07:30 – 17:00
              </Enter>
            </Enter>
          </div>
        </div>
      </section>

      {/* ============================ STORY ============================ */}
      <section className="section relative bg-cream">
        <div className="wrap grid gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">
          {/* text */}
          <div className="lg:pt-4">
            <SectionHead
              step="STEP 02"
              kicker="How it started"
              title="It began with six cots and one rule"
            />
            <Reveal delay={0.06} className="mt-6">
              <p className="lede">
                Baby Steps opened in 2024 with six cots, a hand-painted kitchen and a rule we still
                keep: the same caregiver greets your child at the door every morning. Nadine and
                Selma had spent a decade in larger Kitas where they knew every child by name but had
                twenty minutes a day for each one. They took the corner flat on Kastanienallee,
                painted it themselves, and started with six families from the street. Two years
                later the house holds three groups of twelve — and nobody here has to hurry a child.
              </p>
            </Reveal>

            <Reveal delay={0.14} className="mt-7 flex flex-wrap gap-3">
              {STORY_FACTS.map((f) => (
                <Tag key={f.label} tone={f.tone}>
                  {f.label}
                </Tag>
              ))}
            </Reveal>

            <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-4">
              <PillCTA to="/programs" variant="teal">
                See the three rooms
              </PillCTA>
              <span className="text-[14.5px] text-navy-soft">Tours Tue &amp; Thu, 10:00</span>
            </Reveal>
          </div>

          {/* image + overlapping pull quote */}
          <div className="relative">
            <Reveal x={40} delay={0.05} className="relative">
              <span
                className="absolute -bottom-5 -right-4 h-full w-full rounded-[36px] bg-sun/35 lg:-bottom-7 lg:-right-7"
                aria-hidden="true"
              />
              <Photo
                src={IMAGES.about}
                alt="A caregiver and a young child reading a picture book side by side"
                w={900}
                h={1100}
                mask="mask-soft"
                className="relative aspect-[4/5] w-full"
              />
            </Reveal>

            <PullQuote
              cite="Nadine Krause — co-founder & lead educator"
              className="z-20 mt-8 lg:absolute lg:-left-14 lg:bottom-12 lg:mt-0 lg:w-[84%]"
            >
              A creche should be the place where nobody has to hurry — not at breakfast, not at the
              door, not at getting dressed.
            </PullQuote>
          </div>
        </div>
      </section>

      {/* ============================ VALUES ============================ */}
      <section className="section relative bg-white">
        <div className="wrap">
          <SectionHead
            step="STEP 03"
            kicker="What we hold to"
            title="Four things we will not trade away"
            lede="We hire on them, we schedule on them, and we say no to anything that breaks them."
            align="center"
          />

          <div className="relative mt-14 pl-7 lg:pl-0">
            <span
              className="absolute bottom-2 left-1 top-2 border-l-2 border-dashed border-line lg:hidden"
              aria-hidden="true"
            />
            <svg
              className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
              viewBox="0 0 1200 480"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M30 70 C 210 10, 330 190, 505 168 C 680 146, 700 56, 885 92 C 1045 123, 1105 220, 1192 196"
                fill="none"
                stroke="#EBDFCF"
                strokeWidth="3"
                strokeDasharray="9 13"
                strokeLinecap="round"
              />
            </svg>

            <StaggerGroup className="relative grid gap-6 lg:grid-cols-4 lg:gap-5" stagger={0.1}>
              {VALUES.map((v, i) => (
                <StaggerItem key={v.t} className={VALUE_OFFSET[i]}>
                  <article
                    className={`h-full rounded-[26px] border border-line ${v.tone} p-6 transition-shadow duration-300 hover:shadow-lift`}
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-navy shadow-soft">
                      <ValueIcon d={v.icon} />
                    </span>
                    <h3 className="mt-5 font-heading text-[22px] font-bold">{v.t}</h3>
                    <p className="mt-2.5 text-[15px] leading-relaxed text-navy-soft">{v.p}</p>
                  </article>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </section>

      {/* ========================== OUR APPROACH ========================== */}
      <section className="section relative bg-cream">
        <Footprints className="right-5 top-10 hidden lg:block" count={4} color="#0FA79A" />
        <div className="wrap">
          <SectionHead
            step="STEP 04"
            kicker="Our approach"
            title="Play, learn, grow — in that order"
            lede="The same three beats every day, in every room. Children stop testing the day when they know what comes next."
            align="center"
          />

          <ol className="mt-12 flex flex-col gap-6 md:flex-row md:items-stretch md:gap-4 lg:gap-5">
            {APPROACH.map((s, i) => (
              <Fragment key={s.t}>
                <li className="flex-1">
                  <Reveal delay={i * 0.14} className="h-full">
                    <article className="flex h-full flex-col rounded-[26px] border border-line bg-white p-7 transition-shadow duration-300 hover:shadow-lift">
                      <span
                        className={`font-heading text-[40px] font-extrabold leading-none ${s.accent}`}
                        aria-hidden="true"
                      >
                        {s.n}
                      </span>
                      <h3 className="mt-4 font-heading text-[26px] font-bold">{s.t}</h3>
                      <p className="mt-3 text-[15.5px] leading-relaxed text-navy-soft">{s.p}</p>
                    </article>
                  </Reveal>
                </li>
                {i < APPROACH.length - 1 && (
                  <li
                    aria-hidden="true"
                    className="hidden shrink-0 items-center justify-center md:flex"
                  >
                    <Print className="text-pink/45" />
                  </li>
                )}
              </Fragment>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================== TEAM ============================== */}
      <section className="section relative bg-white pb-32 lg:pb-44">
        <div className="wrap">
          <SectionHead
            step="STEP 05"
            kicker="The team"
            title="Four faces your child will know by name"
            lede="Everyone works the same hours, in the same room, with the same children. No agency cover, no floating staff."
            align="center"
          />

          <StaggerGroup
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            stagger={0.09}
          >
            {TEAM.map((m) => (
              <StaggerItem key={m.name}>
                <article className="group h-full rounded-[26px] border border-line bg-cream/70 p-4 transition-all duration-300 hover:-translate-y-2 hover:-rotate-1 hover:bg-white hover:shadow-lift">
                  <Photo
                    src={IMAGES[m.slot]}
                    alt={`Portrait of ${m.name}, ${m.role} at Baby Steps`}
                    w={700}
                    h={700}
                    mask="mask-blob"
                    className="aspect-square w-full"
                    imgClassName="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="px-2 pb-2 pt-5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-heading text-[20px] font-bold">{m.name}</h3>
                      <Tag tone="teal" className="shrink-0">
                        {m.years}
                      </Tag>
                    </div>
                    <p className="mt-1 text-[13px] font-bold uppercase tracking-[0.14em] text-pink">
                      {m.role}
                    </p>
                    <p className="mt-3 text-[15px] leading-relaxed text-navy-soft">{m.line}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ============================== STATS ============================== */}
      {/* the card crosses the boundary into the team section above */}
      <section className="relative bg-cream-deep pb-20 lg:pb-28">
        <div className="wrap">
          <div className="relative z-10 -mt-16 overflow-hidden rounded-[32px] border border-line bg-white shadow-lift lg:-mt-28">
            <div className="px-7 pt-8 lg:px-10 lg:pt-10">
              <p className="eyebrow">STEP 06 · By the numbers</p>
              <h2 className="h2 mt-4">The numbers we keep small</h2>
            </div>

            <div className="mt-8 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
              {STATS.map((s, i) => (
                <Reveal
                  key={s.l}
                  delay={i * 0.08}
                  x={i % 2 === 0 ? -40 : 40}
                  className={`px-7 py-8 ${i ? 'border-t border-line sm:border-t-0 sm:border-l' : ''} ${
                    i > 1 ? 'lg:border-t-0' : ''
                  }`}
                >
                  <div className="font-heading text-[clamp(36px,4vw,46px)] font-extrabold leading-none text-pink">
                    <Counter to={s.to} prefix={s.prefix} suffix={s.suffix} />
                  </div>
                  <div className="mt-2.5 text-[14.5px] font-semibold text-navy-soft">{s.l}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================= CTA BAND ============================= */}
      <Wave from="#FFF0E0" to="#E8266F" />

      <section className="bg-pink">
        <div className="wrap grid gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-24">
          <div>
            <p className="eyebrow text-white">STEP 07 · Visit us</p>
            <h2 className="h2 mt-4 text-white">Come meet the team</h2>
            <p className="lede mt-5 max-w-xl text-white">
              Tours run Tuesday and Thursday at 10:00, when the rooms are full and you see an
              ordinary day. Bring your child — they tell you more than we can.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <PillCTA to="/contact" variant="navy">
                Book a tour
              </PillCTA>
              <a
                href="tel:+493012345678"
                className="text-[15.5px] font-bold text-white underline-offset-4 transition hover:underline"
              >
                or call +49 30 1234 5678
              </a>
            </div>
          </div>

          <Reveal x={40} className="rounded-[30px] bg-white p-7 shadow-lift lg:p-9">
            <h3 className="font-heading text-[26px] font-extrabold text-navy">Find us</h3>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {CONTACT.map((c) => (
                <li key={c.t} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-pink-soft text-pink">
                    <c.icon size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <span className="block font-heading text-[16px] font-bold text-navy">
                      {c.t}
                    </span>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="text-[15px] text-navy-soft transition-transform duration-300 hover:translate-x-1 hover:text-pink"
                      >
                        {c.v}
                      </a>
                    ) : (
                      <span className="block text-[15px] text-navy-soft">{c.v}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Wave from="#E8266F" to="#242138" />
    </>
  )
}
