import { usePageMeta } from '@/components/ui'
import { PillCTA } from '@/lib/motion'

export default function NotFound() {
  usePageMeta('Page not found — Baby Steps Creche & Daycare', 'This page does not exist.')
  return (
    <section className="wrap flex min-h-[55vh] flex-col items-start justify-center py-24">
      <p className="eyebrow">404</p>
      <h1 className="h2 mt-4">This step went missing.</h1>
      <p className="lede mt-4 max-w-lg">
        The page you are looking for was moved or never existed. Head back to the start.
      </p>
      <div className="mt-8">
        <PillCTA to="/" variant="pink">
          Back to home
        </PillCTA>
      </div>
    </section>
  )
}
