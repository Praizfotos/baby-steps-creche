import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Logo, NAV } from '@/components/Header'

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/praizfotos/' },
  { label: 'Facebook', href: 'https://web.facebook.com/praiz.asala.1' },
]

export default function Footer() {
  return (
    <footer className="bg-navy text-cream">
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr]">
        <div>
          <Logo dark />
          <p className="mt-5 max-w-sm text-[15.5px] leading-relaxed text-cream/70">
            A small creche in Prenzlauer Berg for children from 6 months to 5 years. Real days,
            real care, real updates.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-11 items-center rounded-full border border-white/15 px-5 text-[14.5px] font-semibold text-cream/80 transition hover:border-pink hover:bg-pink hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer">
          <h3 className="mb-4 font-heading text-lg font-bold text-cream">Pages</h3>
          <ul className="space-y-2.5">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="text-[15px] text-cream/70 transition hover:text-sun"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 font-heading text-lg font-bold text-cream">Visit &amp; call</h3>
          <ul className="space-y-3 text-[15px] text-cream/70">
            <li className="flex gap-3">
              <MapPin size={17} className="mt-1 shrink-0 text-sun" aria-hidden="true" />
              <span>
                Kastanienallee 24
                <br />
                10435 Berlin (Prenzlauer Berg)
              </span>
            </li>
            <li className="flex gap-3">
              <Phone size={17} className="mt-1 shrink-0 text-sun" aria-hidden="true" />
              <a href="tel:+493012345678" className="transition hover:text-sun">
                +49 30 1234 5678
              </a>
            </li>
            <li className="flex gap-3">
              <Mail size={17} className="mt-1 shrink-0 text-sun" aria-hidden="true" />
              <a href="mailto:hello@babysteps.de" className="transition hover:text-sun">
                hello@babysteps.de
              </a>
            </li>
            <li className="flex gap-3">
              <Clock size={17} className="mt-1 shrink-0 text-sun" aria-hidden="true" />
              <span>Mon–Fri, 7:30–17:00</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col gap-2 py-5 text-[13.5px] text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Baby Steps Creche &amp; Daycare, Berlin.</p>
          <p>Designed &amp; built by Praise Francis</p>
        </div>
      </div>
    </footer>
  )
}
