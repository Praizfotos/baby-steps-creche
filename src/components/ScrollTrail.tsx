import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useReducedMotion } from 'motion/react'

/* ==========================================================================
   ScrollTrail — the signature footsteps path that draws as you scroll.
   Desktop only (gutter >= 34px), hidden under prefers-reduced-motion.
   Decorative, aria-hidden. Ported from legacy/script.js section 9.
   ========================================================================== */

const NS = 'http://www.w3.org/2000/svg'
const FOOT =
  'M12 2C8 2 6 6 6 10c0 3 1.2 4.5 1.2 7 0 4-2.8 5-2.8 8.5 0 1.5 1.2 2.5 3 2.5 3 0 4.6-2 4.6-2s1.6 2 4.6 2c1.8 0 3-1 3-2.5 0-3.5-2.8-4.5-2.8-8.5 0-2.5 1.2-4 1.2-7 0-4-2-8-6-8z'
const COLORS = ['#E8266F', '#0FA79A', '#FFC94A']

type Print = { el: SVGGElement; f: number; on: boolean }

export default function ScrollTrail() {
  const hostRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  const { pathname } = useLocation()

  useEffect(() => {
    if (reduce) return
    const host = hostRef.current
    const svg = svgRef.current
    if (!host || !svg) return

    let maskPath: SVGPathElement | null = null
    let prints: Print[] = []
    let built = false
    let total = 0
    let yStart = 0
    let yEnd = 1
    let raf = 0
    let rt = 0
    let lastH = 0

    const docTop = (e: Element) => e.getBoundingClientRect().top + window.scrollY

    const update = () => {
      if (!built || !maskPath) return
      const line = window.scrollY + window.innerHeight * 0.82
      let p = (line - yStart) / (yEnd - yStart)
      p = p < 0 ? 0 : p > 1 ? 1 : p

      maskPath.setAttribute('stroke-dashoffset', (total * (1 - p)).toFixed(1))

      for (const pr of prints) {
        const on = p >= pr.f - 0.01
        if (on !== pr.on) {
          pr.on = on
          pr.el.classList.toggle('on', on)
        }
      }
      host.classList.add('on')
    }

    const build = () => {
      svg.replaceChildren()
      prints = []
      built = false
      maskPath = null

      const w = window.innerWidth
      const gutter = (w - 1180) / 2
      if (gutter < 34) {
        host.classList.remove('on')
        return
      }

      const docH = document.documentElement.scrollHeight
      host.style.height = docH + 'px'
      svg.setAttribute('viewBox', `0 0 ${w} ${docH}`)

      const hero = document.querySelector<HTMLElement>('main > *:first-child')
      const end =
        document.querySelector<HTMLElement>('#contact') ??
        document.querySelector<HTMLElement>('footer')
      if (!hero || !end) return

      yStart = docTop(hero) + hero.offsetHeight * 0.58
      yEnd = docTop(end) + end.offsetHeight * 0.42
      if (yEnd - yStart < 400) {
        host.classList.remove('on')
        return
      }

      const contentLeft = gutter + 32
      let xMin = Math.max(10, gutter * 0.22)
      const xMax = contentLeft - 24
      if (xMax - xMin < 34) xMin = Math.max(8, xMax - 34)

      const steps = Math.max(8, Math.min(16, Math.round((yEnd - yStart) / 340)))
      const seg = (yEnd - yStart) / steps

      let d = `M ${xMin.toFixed(1)} ${yStart.toFixed(1)}`
      let prevX = xMin
      let prevY = yStart
      for (let i = 1; i <= steps; i++) {
        const y = yStart + seg * i
        const x = i % 2 === 1 ? xMax : xMin
        d +=
          ` C ${prevX.toFixed(1)} ${(prevY + seg * 0.5).toFixed(1)}` +
          `, ${x.toFixed(1)} ${(y - seg * 0.5).toFixed(1)}` +
          `, ${x.toFixed(1)} ${y.toFixed(1)}`
        prevX = x
        prevY = y
      }

      /* mask that reveals the trail progressively */
      const defs = document.createElementNS(NS, 'defs')
      const mask = document.createElementNS(NS, 'mask')
      mask.setAttribute('id', 'trailMask')
      mask.setAttribute('maskUnits', 'userSpaceOnUse')
      const mp = document.createElementNS(NS, 'path')
      mp.setAttribute('d', d)
      mp.setAttribute('fill', 'none')
      mp.setAttribute('stroke', '#fff')
      mp.setAttribute('stroke-width', '44')
      mp.setAttribute('stroke-linecap', 'round')
      mask.appendChild(mp)
      defs.appendChild(mask)
      svg.appendChild(defs)

      const g = document.createElementNS(NS, 'g')
      g.setAttribute('mask', 'url(#trailMask)')
      const trailPath = document.createElementNS(NS, 'path')
      trailPath.setAttribute('d', d)
      trailPath.setAttribute('class', 'trail')
      g.appendChild(trailPath)
      svg.appendChild(g)

      maskPath = mp
      total = trailPath.getTotalLength()
      mp.setAttribute('stroke-dasharray', `${total} ${total}`)
      mp.setAttribute('stroke-dashoffset', String(total))

      /* footprints along the path, alternating left / right */
      const count = Math.max(10, Math.min(52, Math.round(total / 118)))
      const fpLayer = document.createElementNS(NS, 'g')
      for (let k = 0; k < count; k++) {
        const f = (k + 1) / count
        const pt = trailPath.getPointAtLength(f * total)
        const pt2 = trailPath.getPointAtLength(Math.min(total, f * total + 2))
        const dx = pt2.x - pt.x
        const dy = pt2.y - pt.y
        const angle = (Math.atan2(dx, -dy) * 180) / Math.PI
        const side = k % 2 === 0 ? 1 : -1

        const grp = document.createElementNS(NS, 'g')
        grp.setAttribute('class', 'fp')
        grp.setAttribute(
          'transform',
          `translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)}) rotate(${angle.toFixed(1)})`,
        )
        const inner = document.createElementNS(NS, 'g')
        inner.setAttribute(
          'transform',
          `scale(${(0.62 * side).toFixed(3)},0.62) translate(-12,-15)`,
        )
        const p = document.createElementNS(NS, 'path')
        p.setAttribute('d', FOOT)
        p.setAttribute('fill', COLORS[k % COLORS.length])
        inner.appendChild(p)
        grp.appendChild(inner)
        fpLayer.appendChild(grp)
        prints.push({ el: grp, f, on: false })
      }
      svg.appendChild(fpLayer)

      built = true
      update()
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        update()
      })
    }
    const rebuild = () => {
      clearTimeout(rt)
      rt = window.setTimeout(build, 220)
    }
    const onBodyResize = () => {
      const h = document.documentElement.scrollHeight
      if (Math.abs(h - lastH) > 40) {
        lastH = h
        rebuild()
      }
    }

    build()
    lastH = document.documentElement.scrollHeight

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', rebuild)
    window.addEventListener('load', rebuild)
    const ro = 'ResizeObserver' in window ? new ResizeObserver(onBodyResize) : null
    ro?.observe(document.body)

    return () => {
      if (raf) cancelAnimationFrame(raf)
      clearTimeout(rt)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', rebuild)
      window.removeEventListener('load', rebuild)
      ro?.disconnect()
    }
  }, [reduce, pathname])

  if (reduce) return null

  return (
    <div ref={hostRef} className="scroll-trail" aria-hidden="true">
      <svg ref={svgRef} xmlns={NS} />
    </div>
  )
}
