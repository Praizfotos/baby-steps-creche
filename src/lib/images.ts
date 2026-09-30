/* ==========================================================================
   images.ts — single source of truth for every photo on the site.
   Swap a URL here and every page updates. All images are Unsplash CDN
   (images.unsplash.com) with explicit w/h, q=80, auto=format, fit=crop.
   ========================================================================== */

const U = 'https://images.unsplash.com/photo-'
const q = (id: string, w: number, h: number) =>
  `${U}${id}?w=${w}&h=${h}&q=80&auto=format&fit=crop`

/** Existing slots — already used by the Home page. */
export const IMAGES = {
  hero: q('1503454537195-1dcabb73ffb9', 900, 1100),
  about: q('1544776193-352d25ca82cd', 900, 1100),
  prog1: q('1526634332515-d56c5fd16991', 1000, 580),
  prog2: q('1484820540004-14229fe36ca4', 800, 500),
  prog3: q('1476234251651-f353703a034d', 800, 500),
  quote: q('1587616211892-f743fcca64f9', 700, 930),
  day1: q('1560421683-6856ea585c78', 800, 600),
  day2: q('1490474418585-ba9bad8fd0ea', 800, 500),
  fac1: q('1516627145497-ae6968895b74', 800, 640),
  fac2: q('1472162072942-cd5147eb3902', 700, 700),
  fac3: q('1502086223501-7ea6ecd79368', 700, 930),
  fac4: q('1544126592-807ade215a0b', 800, 600),
  fac5: q('1596464716127-f2a82984de30', 900, 560),
  fac6: q('1568480289356-5a75d0fd47fc', 700, 700),

  /* --- new slots added for the inner pages ------------------------------- */
  /** About hero — a caregiver with two little ones. */
  caregiver: q('1476703993599-0035a21b17a9', 900, 1100),
  /** Team portraits (blob masks on About). */
  team1: q('1580489944761-15a19d654956', 700, 700),
  team2: q('1507003211169-0a1dd7228f2d', 700, 700),
  team3: q('1494790108377-be9c29b29330', 700, 700),
  team4: q('1438761681033-6461ffad8d80', 700, 700),
  /** Toddler Trailblazers section photo — stacking blocks. */
  blocks: q('1541692641319-981cc79ee10a', 900, 700),
  /** A Day Here — outdoor play in every weather. */
  rain: q('1503919545889-aef636e10ad4', 800, 1000),
  /** FAQ / typographic accent. */
  learn: q('1546410531-bb4caa6b424d', 700, 500),
} as const

export type ImageKey = keyof typeof IMAGES
export const imageKeys = Object.keys(IMAGES) as ImageKey[]
