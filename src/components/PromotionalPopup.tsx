import { useState, useEffect, useRef } from 'react'
import { X, Sparkles, ArrowRight, Zap } from 'lucide-react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '@/lib/api'
import { toImageSrc, withImageFallback } from '@/lib/images'

/**
 * Extracts a usable URL from a raw button_link value.
 * Handles cases where admins type free text like:
 *   "Message us on WhatsApp. https://wa.me/254713241666"
 * Steps:
 *  1. If the whole string IS a URL → use it directly
 *  2. Otherwise → scan for any embedded https?:// URL and extract it
 *  3. If nothing found → fall back to /booking
 */
const resolveLink = (raw?: string | null): { href: string; external: boolean } => {
  const text = raw?.trim() || ''

  if (!text) return { href: '/booking', external: false }

  // Already a clean URL?
  if (/^https?:\/\//i.test(text)) return { href: text, external: true }

  // Already a clean internal path?
  if (/^\/[a-zA-Z]/.test(text)) return { href: text, external: false }

  // Try to extract an embedded URL from free-text (e.g. "Call us. https://wa.me/...")
  const urlMatch = text.match(/https?:\/\/[^\s]+/i)
  if (urlMatch) return { href: urlMatch[0], external: true }

  // No recognisable link found — fall back safely
  return { href: '/booking', external: false }
}

type Promotion = {
  id: number
  title: string
  description?: string | null
  info_text?: string | null
  image_url?: string | null
  discount_text?: string | null
  button_text?: string | null
  button_link?: string | null
  active: boolean
}

const SEEN_KEY = 'ww_promo_seen'

// Colorful particle palette
const PARTICLE_COLORS = [
  '#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77', '#4D96FF',
  '#C77DFF', '#FF6BDE', '#00D4FF', '#FF4D6D', '#43E97B',
]

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 5 + 3,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 2.5,
  color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
}))

export default function PromotionalPopup() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [currentIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const shimmerControls = useAnimation()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem(SEEN_KEY)) return

    const fetchPromotions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/public/promotions`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        if (data && data.length > 0) {
          setPromotions(data)
          timerRef.current = setTimeout(() => setIsOpen(true), 3000)
        }
      } catch (error) {
        console.error('Failed to fetch promotions:', error)
      }
    }
    fetchPromotions()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  // Shimmer loop on the badge
  useEffect(() => {
    if (!isOpen) return
    const loop = async () => {
      while (true) {
        await shimmerControls.start({
          x: ['-100%', '200%'],
          transition: { duration: 1.2, ease: 'easeInOut' as const },
        })
        await new Promise(r => setTimeout(r, 2500))
      }
    }
    loop()
  }, [isOpen, shimmerControls])

  const handleClose = () => {
    sessionStorage.setItem(SEEN_KEY, '1')
    setIsOpen(false)
  }

  if (!promotions.length || !isOpen) return null
  const promotion = promotions[currentIndex]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50"
            style={{
              background: 'radial-gradient(ellipse at 30% 40%, rgba(77,150,255,0.25) 0%, rgba(0,0,0,0.82) 60%)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={handleClose}
          />

          {/* Card wrapper */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 30 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.05 }}
              className="relative w-full md:w-[760px]"
              style={{ maxHeight: '90dvh' }}
              onClick={e => e.stopPropagation()}
            >
              {/* ── Animated rainbow glow ring ── */}
              <motion.div
                className="absolute -inset-[3px] rounded-[28px] z-0"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{
                  background: 'linear-gradient(270deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF, #C77DFF, #FF6BDE, #FF6B6B)',
                  backgroundSize: '400% 400%',
                  opacity: 0.9,
                }}
              />

              {/* Main card */}
              <div
                className="relative z-10 flex flex-col rounded-[26px] overflow-hidden"
                style={{
                  background: 'linear-gradient(150deg, #0f0c29 0%, #1a1040 40%, #24243e 100%)',
                  maxHeight: '90dvh',
                }}
              >
                {/* ── Colorful floating particles ── */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
                  {PARTICLES.map(p => (
                    <motion.div
                      key={p.id}
                      className="absolute rounded-full"
                      style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        background: p.color,
                        boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                      }}
                      animate={{ y: [0, -20, 0], opacity: [0.15, 1, 0.15], scale: [1, 1.4, 1] }}
                      transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  ))}
                </div>

                {/* ── Layout ── */}
                <div className="flex flex-col md:flex-row flex-1 min-h-0">

                  {/* Image panel */}
                  <div className="relative md:w-[48%] h-36 md:h-auto flex-shrink-0 overflow-hidden">
                    <motion.img
                      src={toImageSrc(promotion.image_url || '')}
                      alt={promotion.title}
                      onError={withImageFallback}
                      onLoad={() => setImgLoaded(true)}
                      initial={{ scale: 1.12 }}
                      animate={{ scale: imgLoaded ? 1.04 : 1.12 }}
                      transition={{ duration: 8, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />

                    {/* Colorful gradient overlay on image */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to bottom, rgba(15,12,41,0.1) 0%, rgba(15,12,41,0.65) 100%), ' +
                          'linear-gradient(to right, transparent 55%, #1a1040 100%)',
                      }}
                    />

                    {/* Colorful top ribbon */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1.5"
                      style={{
                        background: 'linear-gradient(90deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF, #C77DFF)',
                      }}
                    />

                    {/* Discount stamp */}
                    {promotion.discount_text && (
                      <motion.div
                        initial={{ scale: 0, rotate: -25 }}
                        animate={{ scale: 1, rotate: -12 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 14, delay: 0.5 }}
                        className="absolute top-4 left-3 z-20"
                      >
                        <div
                          className="relative w-16 h-16 md:w-24 md:h-24 flex flex-col items-center justify-center"
                          style={{
                            background: 'conic-gradient(from 0deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF, #C77DFF, #FF6B6B)',
                            clipPath:
                              'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                            filter: 'drop-shadow(0 4px 16px rgba(255,107,107,0.7))',
                          }}
                        >
                          <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                            <motion.div
                              animate={shimmerControls}
                              className="absolute inset-y-0 w-6 skew-x-12"
                              style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                              }}
                            />
                          </div>
                          <span className="relative text-[9px] md:text-[11px] font-black text-white uppercase leading-tight text-center px-1 drop-shadow-md">
                            {promotion.discount_text}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Content panel */}
                  <div className="flex flex-col flex-1 min-h-0 p-5 md:p-7 overflow-y-auto">

                    {/* Close button */}
                    <motion.button
                      onClick={handleClose}
                      whileHover={{ scale: 1.15, rotate: 90 }}
                      whileTap={{ scale: 0.88 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center rounded-full"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                      }}
                      aria-label="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>

                    {/* Special offer badge */}
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-[11px] font-bold uppercase tracking-widest self-start overflow-hidden relative"
                      style={{
                        background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
                        color: 'white',
                        boxShadow: '0 4px 18px rgba(255,107,107,0.45)',
                      }}
                    >
                      <motion.div
                        animate={shimmerControls}
                        className="absolute inset-y-0 w-8 skew-x-12"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }}
                      />
                      <Sparkles className="w-3 h-3 relative" />
                      <span className="relative">Special Offer</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="text-xl md:text-[1.75rem] font-black leading-tight mb-2"
                      style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #a5f3fc 50%, #c4b5fd 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontFamily: 'Georgia, serif',
                      }}
                    >
                      {promotion.title}
                    </motion.h2>

                    {/* Rainbow divider */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.32, duration: 0.55 }}
                      className="h-[2px] mb-3 rounded-full origin-left"
                      style={{
                        background: 'linear-gradient(to right, #FF6B6B, #FFD93D, #6BCB77, #4D96FF, #C77DFF)',
                      }}
                    />

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.38 }}
                      className="text-sm leading-relaxed mb-3 line-clamp-3 md:line-clamp-none"
                      style={{ color: 'rgba(220,215,255,0.8)' }}
                    >
                      {promotion.description}
                    </motion.p>

                    {/* Info text */}
                    {promotion.info_text && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.46 }}
                        className="flex items-start gap-2 p-2.5 rounded-xl mb-3"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,107,107,0.12), rgba(77,150,255,0.12))',
                          border: '1px solid rgba(255,255,255,0.12)',
                        }}
                      >
                        <Zap className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#FFD93D' }} />
                        <p className="text-xs font-semibold leading-snug" style={{ color: '#FFD93D' }}>
                          {promotion.info_text}
                        </p>
                      </motion.div>
                    )}

                    {/* Spacer */}
                    <div className="flex-1 md:hidden" />

                    {/* CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.52, type: 'spring', stiffness: 200 }}
                      className="mt-3 md:mt-auto"
                    >
                      {(() => {
                          const { href, external } = resolveLink(promotion.button_link)
                          const ctaClass = 'group relative flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-sm overflow-hidden text-white'
                          const ctaStyle = {
                            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 35%, #FFD93D 65%, #6BCB77 100%)',
                            boxShadow: '0 6px 30px rgba(255,107,107,0.5), 0 2px 8px rgba(107,203,119,0.3)',
                          }
                          const inner = (
                            <>
                              <span
                                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }}
                              />
                              <span className="relative drop-shadow-md">{promotion.button_text || 'Book Now'}</span>
                              <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                                className="relative"
                              >
                                <ArrowRight className="w-4 h-4 drop-shadow-md" />
                              </motion.span>
                            </>
                          )
                          return external ? (
                            <a href={href} target="_blank" rel="noopener noreferrer"
                               onClick={handleClose}
                               className={ctaClass} style={ctaStyle}>
                              {inner}
                            </a>
                          ) : (
                            <Link to={href} onClick={handleClose}
                                  className={ctaClass} style={ctaStyle}>
                              {inner}
                            </Link>
                          )
                        })()}

                      <button
                        onClick={handleClose}
                        className="block w-full text-center mt-2 text-xs transition-colors"
                        style={{ color: 'rgba(200,190,255,0.4)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(200,190,255,0.7)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(200,190,255,0.4)')}
                      >
                        No thanks, maybe later
                      </button>
                    </motion.div>
                  </div>
                </div>

                {/* ── Animated rainbow bottom bar ── */}
                <div className="h-[4px] relative overflow-hidden flex-shrink-0">
                  <motion.div
                    animate={{ backgroundPosition: ['0% 50%', '200% 50%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF, #C77DFF, #FF6BDE, #FF6B6B)',
                      backgroundSize: '200% 100%',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
