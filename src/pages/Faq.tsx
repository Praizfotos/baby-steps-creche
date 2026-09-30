import { useEffect, useMemo, useState, type KeyboardEvent, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Baby, Clock, Mail, MapPin, Phone, Search, Wallet, X } from 'lucide-react'
import { usePageMeta, SectionHead, Wave, Tag, Footprints, Collapsible } from '@/components/ui'
import { Photo } from '@/components/Photo'
import { IMAGES } from '@/lib/images'
import { Reveal, PillCTA, Enter, EXPO_OUT } from '@/lib/motion'

/* ---------------------------------------------------------------- data ---- */
const TABS = ['All', 'General', 'Enrollment', 'Daily Care', 'Fees', 'Health & Safety'] as const
type Tab = (typeof TABS)[number]
type Category = Exclude<Tab, 'All'>

type Entry = { id: string; cat: Category; q: string; a: string }

const FAQS: Entry[] = [
  {
    id: 'ages',
    cat: 'General',
    q: 'What ages do you take?',
    a: '6 months to 5 years, across three rooms: Little Sprouts (6–18 months), Toddler Trailblazers (18 months–3 years) and Pre-K Pathfinders (3–5 years). Children move up when they are ready — usually over two or three weeks, not on one fixed date.',
  },
  {
    id: 'hours',
    cat: 'General',
    q: 'What are your opening hours?',
    a: 'Monday to Friday, 07:30 to 17:00. Core hours are 09:00–15:00, when all three rooms run the same programme; drop-off and pick-up are flexible around that, and late pick-up from 16:30 is included.',
  },
  {
    id: 'groups',
    cat: 'General',
    q: 'How big are the groups?',
    a: 'Twelve children at most, one caregiver to four. Your child gets a named key person on day one — the same face at drop-off, the same face at pick-up, and someone who already knows how your child likes to be held.',
  },
  {
    id: 'languages',
    cat: 'General',
    q: 'Which languages will my child hear?',
    a: 'German and English, every day. Caregivers speak German with the group and weave English into songs, stories and morning circle, so children pick it up the way they pick up everything else — by using it.',
  },
  {
    id: 'visit',
    cat: 'Enrollment',
    q: 'How do we schedule a visit?',
    a: 'Tours run Tuesdays and Thursdays at 10:00, while the rooms are in full swing — you see an ordinary day rather than a tidy one. We keep tours to three families at a time and you can bring your child. Send us a message or call +49 30 1234 5678 and we will find a date.',
  },
  {
    id: 'enroll',
    cat: 'Enrollment',
    q: 'How does enrolling work?',
    a: 'Four steps: a tour, a short registration form, two trial days with your child, then the contract. We confirm the place in writing and send you your child’s settling-in plan before the first real day.',
  },
  {
    id: 'settling',
    cat: 'Enrollment',
    q: 'How does the settling-in period work?',
    a: 'The Eingewöhnung takes two to three weeks, at your child’s pace. On day one you stay for the whole morning and we shorten your visits together from there. Your key caregiver calls you the moment your child settles — not at the end of the day.',
  },
  {
    id: 'meals',
    cat: 'Daily Care',
    q: 'Do you provide meals and snacks?',
    a: 'Yes. Organic breakfast from 07:30, a warm lunch cooked here this morning, and two snacks — one mid-morning, one at 15:00. Menus go out every Sunday. Vegetarian is our default and we cook around allergies. Meals are billed separately at €68 per month.',
  },
  {
    id: 'bag',
    cat: 'Daily Care',
    q: 'What should my child bring?',
    a: 'Two changes of clothes, nappies and wipes, a fitted sheet for the cot, outdoor clothes for the weather and one familiar comfort item. We label everything together on the first day. Rain suits and boots live by the door, so a puddle suit beats staying home.',
  },
  {
    id: 'naps',
    cat: 'Daily Care',
    q: 'How do naps and sleep routines work?',
    a: 'Infants follow the rhythm you already have at home for at least the first three months — tell us the times, the cues and how your child likes to fall asleep. Toddlers rest after lunch: cots for those who still sleep, books and puzzles for those who do not. Blackout blinds, an air purifier, and a caregiver in the room.',
  },
  {
    id: 'updates',
    cat: 'Daily Care',
    q: 'What will I know about the day?',
    a: 'A photo and a short note from your child’s caregiver by 15:00 — what was eaten, how the nap went, what made them laugh. Nappy changes and any medicine are logged there too. Anything urgent, we call you first.',
  },
  {
    id: 'fees',
    cat: 'Fees',
    q: 'What do fees cost, and is there a waiting list?',
    a: 'We accept the Berlin Kita-Gutschein. Once the Bezirksamt has issued it, bring the voucher to your tour and we handle the paperwork. Meals are billed separately at €68 per month. Each room holds twelve children, so there is a waiting list — join it with a short form and we write to you as soon as a place opens for your child’s age.',
  },
  {
    id: 'sick',
    cat: 'Health & Safety',
    q: 'What happens when my child is sick?',
    a: 'Fever, vomiting, or a doctor’s note for something contagious: keep your child at home and call us so we can log it. They come back 24 hours after the fever breaks without medication. If your child falls ill here, we call you first — never a text, never at the end of the day.',
  },
  {
    id: 'allergies',
    cat: 'Health & Safety',
    q: 'How do you handle allergies?',
    a: 'Tell us on the registration form and we meet you before the first trial day to write an action plan together. The kitchen cooks around allergies rather than around convenience: no nuts on site, separate boards, ingredients listed on every menu. Caregivers carry the antihistamine or adrenaline pen you authorise, and the whole team is first-aid trained.',
  },
]

const POPULAR = ['Eingewöhnung', 'Kita-Gutschein', 'allergies', 'nap', 'hours']

const GLANCE = [
  { icon: Clock, t: 'Hours', v: 'Mon – Fri 07:30 – 17:00', s: 'Core hours 09:00 – 15:00' },
  { icon: Baby, t: 'Ages', v: '6 months – 5 years', s: 'Three rooms, twelve children each' },
  { icon: MapPin, t: 'Where', v: 'Kastanienallee 24', s: '10435 Berlin · Prenzlauer Berg' },
  { icon: Wallet, t: 'Money', v: 'Kita-Gutschein accepted', s: '€68 per month for meals' },
]

const COUNTS = Object.fromEntries(
  TABS.map((t) => [t, t === 'All' ? FAQS.length : FAQS.filter((f) => f.cat === t).length]),
) as Record<Tab, number>

/* ------------------------------------------------------------- helpers ---- */
const tabId = (t: Tab) =>
  `faq-tab-${t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`

function Highlight({ text, term }: { text: string; term: string }) {
  const needle = term.trim().toLowerCase()
  if (!needle) return <>{text}</>
  const hay = text.toLowerCase()
  const parts: ReactNode[] = []
  let from = 0
  let at = hay.indexOf(needle, from)
  let n = 0
  while (at !== -1) {
    if (at > from) parts.push(text.slice(from, at))
    parts.push(
      <mark key={n++} className="rounded-[4px] bg-sun/75 px-0.5 text-navy">
        {text.slice(at, at + needle.length)}
      </mark>,
    )
    from = at + needle.length
    at = hay.indexOf(needle, from)
  }
  parts.push(text.slice(from))
  return <>{parts}</>
}

function FaqItem({
  item,
  term,
  open,
  onToggle,
  last,
}: {
  item: Entry
  term: string
  open: boolean
  onToggle: () => void
  last: boolean
}) {
  return (
    <div className={last ? '' : 'border-b border-line'}>
      <h3 className="font-heading">
        <button
          type="button"
          id={`faq-q-${item.id}`}
          aria-expanded={open}
          aria-controls={`faq-a-${item.id}`}
          onClick={onToggle}
          className="group flex w-full items-start justify-between gap-4 px-5 py-5 text-left transition-colors duration-300 hover:bg-cream/70 sm:gap-5 sm:px-6"
        >
          <span className="min-w-0">
            <span className="block font-heading text-[17.5px] font-bold leading-snug text-navy sm:text-[19px]">
              <Highlight text={item.q} term={term} />
            </span>
            <span className="mt-2 inline-flex rounded-full bg-cream-deep px-3 py-1 text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-navy-soft">
              {item.cat}
            </span>
          </span>
          <motion.span
            aria-hidden="true"
            className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
              open
                ? 'bg-pink text-white'
                : 'bg-pink-soft text-pink group-hover:bg-pink group-hover:text-white'
            }`}
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.35, ease: EXPO_OUT }}
          >
            <span className="text-[20px] font-bold leading-none">+</span>
          </motion.span>
        </button>
      </h3>
      <Collapsible show={open}>
        <div id={`faq-a-${item.id}`} className="px-5 pb-6 sm:px-6">
          <p className="max-w-[62ch] text-[15.5px] leading-relaxed text-navy-soft">
            <Highlight text={item.a} term={term} />
          </p>
        </div>
      </Collapsible>
    </div>
  )
}

/* ---------------------------------------------------------------- page ---- */
export default function Faq() {
  usePageMeta(
    'FAQ — questions parents ask | Baby Steps Creche, Berlin',
    'Straight answers on hours, fees and the Berlin Kita-Gutschein, settling-in, meals, sickness and allergies at Baby Steps, a creche in Prenzlauer Berg for children 6 months to 5 years.',
  )

  const reduce = useReducedMotion()
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<Tab>('All')
  const [openId, setOpenId] = useState<string | null>(null)

  const needle = query.trim().toLowerCase()

  const visible = useMemo(
    () =>
      FAQS.filter(
        (f) =>
          (cat === 'All' || f.cat === cat) &&
          (!needle ||
            f.q.toLowerCase().includes(needle) ||
            f.a.toLowerCase().includes(needle)),
      ),
    [cat, needle],
  )

  const shownOpen = visible.some((f) => f.id === openId) ? openId : null

  const status = (() => {
    const n = visible.length
    const inCat = cat === 'All' ? '' : ` in ${cat}`
    if (needle) {
      return `${n} ${n === 1 ? 'answer matches' : 'answers match'} “${query.trim()}”${inCat}`
    }
    return `${n} ${n === 1 ? 'answer' : 'answers'}${inCat}`
  })()

  function onTabKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const i = TABS.indexOf(cat)
    let next: number | null = null
    if (e.key === 'ArrowRight') next = (i + 1) % TABS.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + TABS.length) % TABS.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = TABS.length - 1
    if (next === null) return
    e.preventDefault()
    const t = TABS[next]
    setCat(t)
    requestAnimationFrame(() => document.getElementById(tabId(t))?.focus())
  }

  /* FAQPage structured data — built from the same array, removed on unmount */
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-faq-page', '')
    script.textContent = JSON.stringify(schema)
    const prev = document.head.querySelector('script[data-faq-page]')
    if (prev) prev.replaceWith(script)
    else document.head.appendChild(script)
    return () => {
      script.remove()
    }
  }, [])

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden">
        <div className="wrap grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-24 lg:pt-14">
          <div className="relative z-10">
            <Enter delay={0.04}>
              <p className="eyebrow">STEP 05 · Good to Know</p>
            </Enter>

            <Enter delay={0.14} y={30}>
              <h1 className="display mt-5">Questions parents ask us</h1>
            </Enter>

            <Enter delay={0.26}>
              <p className="lede mt-6 max-w-xl">
                Fourteen straight answers on ages, money, meals, sick days and the first three
                weeks. Search a word, or read the lot.
              </p>
            </Enter>

            <Enter delay={0.38} className="mt-8 max-w-xl">
              <div className="relative">
                <label htmlFor="faq-search" className="sr-only">
                  Search the questions and answers
                </label>
                <Search
                  size={19}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-navy-soft"
                />
                <input
                  id="faq-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try “nap”, “fees”, “allergies”"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full rounded-full border-2 border-line bg-white py-4 pl-[52px] pr-14 text-[16.5px] font-semibold text-navy shadow-lift outline-none transition-colors duration-300 placeholder:font-normal placeholder:text-navy-soft/75 focus:border-teal"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="absolute right-4 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-cream-deep text-navy-soft transition-colors duration-300 hover:bg-pink hover:text-white"
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                )}
              </div>

              <p
                aria-live="polite"
                aria-atomic="true"
                className="mt-3.5 text-[14px] font-semibold text-navy-soft"
              >
                {status}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-[11.5px] font-extrabold uppercase tracking-[0.16em] text-navy-soft/80">
                  Popular
                </span>
                {POPULAR.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setQuery(p)}
                    className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-bold text-navy-soft transition-colors duration-300 hover:border-navy/30 hover:text-navy"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </Enter>
          </div>

          {/* art */}
          <Enter delay={0.3} className="relative">
            <span
              className="absolute -left-4 -top-6 h-24 w-24 rounded-full bg-sun/45 lg:-left-8 lg:h-32 lg:w-32"
              aria-hidden="true"
            />
            <span
              className="absolute -right-2 top-8 h-16 w-16 rounded-full border-[10px] border-teal/30 lg:right-0 lg:h-24 lg:w-24"
              aria-hidden="true"
            />
            <span
              className="absolute bottom-4 left-0 hidden h-20 w-20 rotate-12 rounded-[18px] bg-pink-soft lg:block"
              aria-hidden="true"
            />
            <span
              className="absolute left-1/2 top-1/2 -z-10 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream-deep"
              aria-hidden="true"
            />
            <Footprints
              className="-bottom-6 -left-4 hidden lg:block"
              count={4}
              color="#0FA79A"
            />
            <figure className="relative mx-auto max-w-[540px]">
              <Photo
                src={IMAGES.blocks}
                alt="A child’s hand stacking illustrated picture blocks into a tower"
                w={900}
                h={700}
                mask="mask-arch"
                className="aspect-[9/7] w-full shadow-lift"
              />
              <figcaption className="pill-note absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-soft sm:left-6 sm:translate-x-0">
                <MapPin size={14} aria-hidden="true" />
                Kastanienallee 24 · Berlin
              </figcaption>
            </figure>
          </Enter>
        </div>
      </section>

      <Wave from="#FFF9F1" to="#FFFFFF" />

      {/* ========================== LIST + SIDE CARD ========================== */}
      <section className="section bg-white" id="faq" aria-labelledby="faq-list-title">
        <div className="wrap">
          <SectionHead
            id="faq-list-title"
            kicker="The list"
            title="Every answer, in one list"
            lede="Search a word, or pick a category. Fourteen things parents ask us before day one."
          />

          <div className="-mx-4 mt-9 overflow-x-auto scrollbar-none px-4 sm:mx-0 sm:px-0">
            <div
              role="tablist"
              aria-label="Filter questions by category"
              onKeyDown={onTabKeyDown}
              className="flex w-max gap-1.5 rounded-full border border-line bg-cream p-1.5"
            >
              {TABS.map((t) => {
                const active = t === cat
                return (
                  <button
                    key={t}
                    id={tabId(t)}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="faq-panel"
                    tabIndex={active ? 0 : -1}
                    onClick={() => setCat(t)}
                    className="relative shrink-0 rounded-full px-4 py-2.5 transition-colors duration-300"
                  >
                    {active && (
                      <motion.span
                        aria-hidden="true"
                        layoutId="faq-tab-pill"
                        className="absolute inset-0 rounded-full bg-navy"
                        transition={
                          reduce ? { duration: 0 } : { type: 'spring', stiffness: 480, damping: 40 }
                        }
                      />
                    )}
                    <span
                      className={`relative z-10 flex items-center gap-1.5 text-[14.5px] font-bold ${
                        active ? 'text-cream' : 'text-navy-soft'
                      }`}
                    >
                      {t}
                      <span
                        className={`text-[11.5px] font-extrabold ${
                          active ? 'text-sun' : 'text-navy-soft/60'
                        }`}
                      >
                        {COUNTS[t]}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-9 grid items-start gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-10">
            <div id="faq-panel" role="tabpanel" aria-labelledby={tabId(cat)}>
              {visible.length === 0 ? (
                <div className="rounded-[28px] border-2 border-dashed border-line bg-cream/60 px-6 py-14 text-center">
                  <span
                    className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-pink-soft text-pink"
                    aria-hidden="true"
                  >
                    <Search size={22} />
                  </span>
                  <h3 className="h3 mt-5">No matches. Ask us directly</h3>
                  <p className="lede mx-auto mt-3 max-w-md text-[16px]">
                    Tell us what you need to know — a person replies, usually the same working day.
                  </p>
                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <PillCTA to="/contact" variant="pink">
                      Send your question
                    </PillCTA>
                    <PillCTA href="tel:+493012345678" variant="outline">
                      Call +49 30 1234 5678
                    </PillCTA>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-[28px] border border-line bg-white shadow-lift">
                  {visible.map((item, i) => (
                    <Reveal key={item.id} delay={Math.min(i, 6) * 0.05}>
                      <FaqItem
                        item={item}
                        term={query}
                        open={shownOpen === item.id}
                        onToggle={() => setOpenId(shownOpen === item.id ? null : item.id)}
                        last={i === visible.length - 1}
                      />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>

            <aside aria-labelledby="side-card-title" className="lg:sticky lg:top-28 lg:self-start">
              <Reveal x={30}>
                <div className="relative overflow-hidden rounded-[30px] border border-line bg-cream p-7 shadow-lift lg:p-8">
                  <span
                    aria-hidden="true"
                    className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-soft"
                  />
                  <div className="relative">
                    <Tag tone="teal">Mon – Fri 07:30 – 17:00</Tag>
                    <h2 id="side-card-title" className="h3 mt-5">
                      Still have questions?
                    </h2>
                    <p className="mt-3 text-[15.5px] leading-relaxed text-navy-soft">
                      Call during opening hours or write to us. We reply the same working day —
                      and if it is easier, come and see an ordinary Tuesday at 10:00.
                    </p>

                    <ul className="mt-6 space-y-3">
                      <li>
                        <a
                          href="tel:+493012345678"
                          className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 transition-colors duration-300 hover:border-pink/40"
                        >
                          <span
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pink-soft text-pink"
                            aria-hidden="true"
                          >
                            <Phone size={16} />
                          </span>
                          <span>
                            <span className="block text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-navy-soft">
                              Phone
                            </span>
                            <span className="block text-[15px] font-bold text-navy">
                              +49 30 1234 5678
                            </span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="mailto:hello@babysteps.de"
                          className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 transition-colors duration-300 hover:border-pink/40"
                        >
                          <span
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-soft text-teal-dark"
                            aria-hidden="true"
                          >
                            <Mail size={16} />
                          </span>
                          <span>
                            <span className="block text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-navy-soft">
                              Email
                            </span>
                            <span className="block text-[15px] font-bold text-navy">
                              hello@babysteps.de
                            </span>
                          </span>
                        </a>
                      </li>
                      <li>
                        <span className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
                          <span
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sun/35 text-[#8a5f00]"
                            aria-hidden="true"
                          >
                            <MapPin size={16} />
                          </span>
                          <span>
                            <span className="block text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-navy-soft">
                              Creche
                            </span>
                            <span className="block text-[15px] font-bold text-navy">
                              Kastanienallee 24, 10435 Berlin
                            </span>
                          </span>
                        </span>
                      </li>
                    </ul>

                    <PillCTA to="/contact" variant="pink" className="mt-6 w-full">
                      Ask us directly
                    </PillCTA>
                  </div>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      <Wave from="#FFFFFF" to="#242138" />

      {/* ============================ AT A GLANCE ============================ */}
      <section className="section bg-navy" aria-labelledby="glance-title">
        <div className="wrap">
          <SectionHead
            id="glance-title"
            kicker="At a glance"
            title="The short version"
            lede="Hours, ages, address and money — the four lines parents check first."
            align="center"
            tone="cream"
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GLANCE.map((g, i) => (
              <Reveal key={g.t} delay={i * 0.07}>
                <div className="h-full rounded-[24px] border border-white/10 bg-white/[0.05] p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-sun">
                    <g.icon size={19} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-heading text-[17px] font-bold uppercase tracking-[0.14em] text-cream/60">
                    {g.t}
                  </h3>
                  <p className="mt-2 font-heading text-[22px] font-extrabold leading-tight text-cream">
                    {g.v}
                  </p>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-cream/60">{g.s}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 flex flex-col items-start justify-between gap-5 rounded-[26px] border border-white/10 bg-white/[0.06] px-7 py-6 md:flex-row md:items-center">
            <p className="max-w-xl text-[15.5px] leading-relaxed text-cream/75">
              Still skimming? Send a message and a person replies the same working day — or book a
              tour for Tuesday or Thursday at 10:00 and ask us in the room.
            </p>
            <div className="flex flex-wrap gap-3">
              <PillCTA to="/contact" variant="sun">
                Ask us directly
              </PillCTA>
              <PillCTA href="tel:+493012345678" variant="pink">
                Call +49 30 1234 5678
              </PillCTA>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
