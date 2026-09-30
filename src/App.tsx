import { Routes, Route } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ScrollToTop } from '@/components/ui'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Programs from '@/pages/Programs'
import DayHere from '@/pages/DayHere'
import Facility from '@/pages/Facility'
import Faq from '@/pages/Faq'
import Contact from '@/pages/Contact'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-cream"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/day-here" element={<DayHere />} />
          <Route path="/facility" element={<Facility />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
