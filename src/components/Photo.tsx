import { useState } from 'react'
import { IMAGES, type ImageKey } from '@/lib/images'

type PhotoProps = {
  src: string
  alt: string
  w: number
  h: number
  /** classes for the OUTER wrapper (size, mask, layout) */
  className?: string
  /** extra classes for the <img> itself */
  imgClassName?: string
  mask?: 'mask-arch' | 'mask-blob' | 'mask-blob-2' | 'mask-soft' | ''
  eager?: boolean
  position?: string
}

/** Lazy, sized photo with the cream shimmer skeleton that fades out on load. */
export function Photo({
  src,
  alt,
  w,
  h,
  className = '',
  imgClassName = '',
  mask = '',
  eager = false,
  position,
}: PhotoProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`ph ${mask} ${className}`}>
      <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        className={`${loaded ? 'loaded' : ''} ${imgClassName}`}
        style={position ? { objectPosition: position } : undefined}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  )
}

/** Same, but takes a key from images.ts so sizes stay consistent. */
export function KeyedPhoto({
  slot,
  alt,
  w,
  h,
  ...rest
}: { slot: ImageKey } & Omit<PhotoProps, 'src'>) {
  return <Photo src={IMAGES[slot]} alt={alt} w={w} h={h} {...rest} />
}
