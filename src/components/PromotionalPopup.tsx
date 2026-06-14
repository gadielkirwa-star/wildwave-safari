import { useState, useEffect, useRef } from 'react'
import { X, Sparkles, ArrowRight, Zap } from 'lucide-react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Link } from 'react-router-dom'
import { API_BASE_URL } from '@/lib/api'
import { toImageSrc, withImageFallback } from '@/lib/images'

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

// Safari brand palette particles (golds, sands, terracotta, warm creams)
const PARTICLE_COLORS = [
  '#D4A84B', // savanna gold
  '#C1440E', // dusk orange/terracotta
  '#F7F3EE', // ash white/cream
  '#E6C587', // soft gold
  '#A3743B', // warm earth brown
  '#FFD384', // bright gold
]

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 3,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 2,
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
              background: 'radial-gradient(ellipse at 30% 40%, rgba(212,168,75,0.1) 0%, rgba(26,18,8,0.92) 80%)',
              backdropFilter: 'blur(8px)',
            }}
            onClick={handleClose}
          />

          {/* Card wrapper */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 30 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.05 }}
              className="relative w-full md:w-[760px]"
              style={{ maxHeight: '90dvh' }}
              onClick={e => e.stopPropagation()}
            >
              {/* ── Animated Brand Glow Border ── */}
              <motion.div
                className="absolute -inset-[3px] rounded-[28px] z-0"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                style={{
                  background: 'linear-gradient(270deg, #D4A84B, #C1440E, #2C1A0E, #D4A84B, #C1440E)',
                  backgroundSize: '400% 400%',
                  opacity: 0.85,
                }}
              />

              {/* Main card */}
              <div
                className="relative z-10 flex flex-col rounded-[26px] overflow-hidden"
                style={{
                  background: 'linear-gradient(150deg, #1A1208 0%, #2C1A0E 50%, #110B05 100%)',
                  maxHeight: '90dvh',
                }}
              >
                {/* ── Floating brand particles ── */}
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
                      animate={{ y: [0, -20, 0], opacity: [0.15, 0.9, 0.15], scale: [1, 1.3, 1] }}
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

                    {/* Gradient overlay on image */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to bottom, rgba(26,18,8,0.1) 0%, rgba(26,18,8,0.65) 100%), ' +
                          'linear-gradient(to right, transparent 55%, #2C1A0E 100%)',
                      }}
                    />

                    {/* Top Brand Ribbon */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1.5"
                      style={{
                        background: 'linear-gradient(90deg, #D4A84B, #C1440E, #2C1A0E, #D4A84B)',
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
                            background: 'conic-gradient(from 0deg, #D4A84B, #C1440E, #D4A84B)',
                            clipPath:
                              'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                            filter: 'drop-shadow(0 4px 16px rgba(212,168,75,0.6))',
                          }}
                        >
                          <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                            <motion.div
                              animate={shimmerControls}
                              className="absolute inset-y-0 w-6 skew-x-12"
                              style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                              }}
                            />
                          </div>
                          <span className="relative text-[9px] md:text-[11px] font-black text-[#1A1208] uppercase leading-tight text-center px-1 drop-shadow-sm">
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
                        background: 'rgba(212,168,75,0.15)',
                        border: '1px solid rgba(212,168,75,0.3)',
                        color: '#D4A84B',
                      }}
                      aria-label="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>

                    {/* Brand offer badge */}
                    <motion.div
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-[11px] font-bold uppercase tracking-widest self-start overflow-hidden relative"
                      style={{
                        background: 'linear-gradient(135deg, #D4A84B, #C1440E)',
                        color: '#F7F3EE',
                        boxShadow: '0 4px 18px rgba(212,168,75,0.35)',
                      }}
                    >
                      <motion.div
                        animate={shimmerControls}
                        className="absolute inset-y-0 w-8 skew-x-12"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }}
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
                        background: 'linear-gradient(135deg, #F7F3EE 0%, #D4A84B 60%, #E6C587 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontFamily: 'var(--font-display), Georgia, serif',
                      }}
                    >
                      {promotion.title}
                    </motion.h2>

                    {/* Brand divider */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.32, duration: 0.55 }}
                      className="h-[2px] mb-3 rounded-full origin-left"
                      style={{
                        background: 'linear-gradient(to right, #D4A84B, #C1440E, transparent)',
                      }}
                    />

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.38 }}
                      className="text-sm leading-relaxed mb-3 line-clamp-3 md:line-clamp-none text-gray-300"
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
                          background: 'linear-gradient(135deg, rgba(212,168,75,0.1), rgba(193,68,14,0.05))',
                          border: '1px solid rgba(212,168,75,0.2)',
                        }}
                      >
                        <Zap className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#D4A84B' }} />
                        <p className="text-xs font-semibold leading-snug" style={{ color: '#D4A84B' }}>
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
                          const { href, external } = { href: '/booking', external: false }
                          const ctaClass = 'group relative flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-sm overflow-hidden text-white'
                          const ctaStyle = {
                            background: 'linear-gradient(135deg, #D4A84B 0%, #C1440E 100%)',
                            boxShadow: '0 6px 30px rgba(212,168,75,0.4), 0 2px 8px rgba(193,68,14,0.2)',
                          }
                          const inner = (
                            <>
                              <span
                                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }}
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
                        style={{ color: 'rgba(247,243,238,0.4)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(247,243,238,0.7)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(247,243,238,0.4)')}
                      >
                        No thanks, maybe later
                      </button>
                    </motion.div>
                  </div>
                </div>

                {/* ── Animated brand bottom bar ── */}
                <div className="h-[4px] relative overflow-hidden flex-shrink-0">
                  <motion.div
                    animate={{ backgroundPosition: ['0% 50%', '200% 50%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, #D4A84B, #C1440E, #2C1A0E, #D4A84B)',
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
