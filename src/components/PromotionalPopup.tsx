import { useState, useEffect, useRef } from 'react'
import { X, Sparkles, ArrowRight, Clock } from 'lucide-react'
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

// Fewer particles on mobile for performance
const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 2,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 2,
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

  // Shimmer loop on the gold badge
  useEffect(() => {
    if (!isOpen) return
    const loop = async () => {
      while (true) {
        await shimmerControls.start({
          x: ['-100%', '200%'],
          transition: { duration: 1.4, ease: 'easeInOut' as const },
        })
        await new Promise(r => setTimeout(r, 3000))
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
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.88) 100%)',
              backdropFilter: 'blur(6px)',
            }}
            onClick={handleClose}
          />

          {/* ─── Card wrapper — centred, max height = 90dvh ─── */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.05 }}
              className="relative w-full md:w-[760px]"
              style={{ maxHeight: '90dvh' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Outer glow ring */}
              <div
                className="absolute -inset-[2px] rounded-[26px] z-0"
                style={{
                  background: 'linear-gradient(135deg, #D4A843 0%, #8B4513 40%, #D4A843 70%, #C17B2E 100%)',
                  opacity: 0.8,
                }}
              />

              {/* Main card — flex column, never taller than the wrapper */}
              <div
                className="relative z-10 flex flex-col rounded-[24px] overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #1a0f00 0%, #2d1a00 50%, #1a0f00 100%)',
                  maxHeight: '90dvh',
                }}
              >
                {/* Floating particles (pointer-events-none) */}
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
                        background: 'radial-gradient(circle, #D4A843 0%, #C17B2E 100%)',
                        boxShadow: `0 0 ${p.size * 2}px #D4A843`,
                      }}
                      animate={{ y: [0, -16, 0], opacity: [0.2, 0.9, 0.2] }}
                      transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  ))}
                </div>

                {/* ── MOBILE layout: compact vertical ── / ── DESKTOP layout: side-by-side ── */}
                <div className="flex flex-col md:flex-row flex-1 min-h-0">

                  {/* ── Image section ── */}
                  <div className="relative md:w-[48%] h-36 md:h-auto flex-shrink-0 overflow-hidden">
                    <motion.img
                      src={toImageSrc(promotion.image_url || '')}
                      alt={promotion.title}
                      onError={withImageFallback}
                      onLoad={() => setImgLoaded(true)}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: imgLoaded ? 1.04 : 1.1 }}
                      transition={{ duration: 8, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to bottom, rgba(26,15,0,0.15) 0%, rgba(26,15,0,0.6) 100%), ' +
                          'linear-gradient(to right, transparent 60%, #1a0f00 100%)',
                      }}
                    />

                    {/* Discount stamp — smaller on mobile */}
                    {promotion.discount_text && (
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: -12 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.45 }}
                        className="absolute top-3 left-3 z-20"
                      >
                        <div
                          className="relative w-16 h-16 md:w-24 md:h-24 flex flex-col items-center justify-center"
                          style={{
                            background: 'conic-gradient(from 0deg, #D4A843, #F5CC6A, #C17B2E, #D4A843)',
                            clipPath:
                              'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                            filter: 'drop-shadow(0 4px 12px rgba(212,168,67,0.7))',
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
                          <span className="relative text-[9px] md:text-xs font-black text-[#1a0f00] uppercase leading-tight text-center px-1">
                            {promotion.discount_text}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* ── Content section — scrollable on mobile if needed ── */}
                  <div className="flex flex-col flex-1 min-h-0 p-5 md:p-8 overflow-y-auto">

                    {/* Close button */}
                    <motion.button
                      onClick={handleClose}
                      whileHover={{ scale: 1.12, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center rounded-full"
                      style={{
                        background: 'rgba(212,168,67,0.15)',
                        border: '1px solid rgba(212,168,67,0.4)',
                        color: '#D4A843',
                      }}
                      aria-label="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </motion.button>

                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3 text-[11px] font-bold uppercase tracking-widest self-start"
                      style={{
                        background: 'rgba(212,168,67,0.15)',
                        border: '1px solid rgba(212,168,67,0.4)',
                        color: '#D4A843',
                      }}
                    >
                      <Sparkles className="w-3 h-3" />
                      Special Offer
                    </motion.div>

                    {/* Title */}
                    <motion.h2
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.28 }}
                      className="text-xl md:text-3xl font-bold leading-tight mb-2"
                      style={{
                        color: '#F5CC6A',
                        fontFamily: 'Georgia, serif',
                        textShadow: '0 2px 12px rgba(212,168,67,0.3)',
                      }}
                    >
                      {promotion.title}
                    </motion.h2>

                    {/* Divider */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.35, duration: 0.5 }}
                      className="h-px mb-3 origin-left"
                      style={{ background: 'linear-gradient(to right, #D4A843, transparent)' }}
                    />

                    {/* Description — clamped on mobile */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm leading-relaxed mb-3 line-clamp-3 md:line-clamp-none"
                      style={{ color: 'rgba(245,220,180,0.82)' }}
                    >
                      {promotion.description}
                    </motion.p>

                    {/* Info text */}
                    {promotion.info_text && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.48 }}
                        className="flex items-start gap-2 p-2.5 rounded-xl mb-3"
                        style={{
                          background: 'rgba(212,168,67,0.08)',
                          border: '1px solid rgba(212,168,67,0.2)',
                        }}
                      >
                        <Clock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#D4A843' }} />
                        <p className="text-xs font-semibold leading-snug" style={{ color: '#D4A843' }}>
                          {promotion.info_text}
                        </p>
                      </motion.div>
                    )}

                    {/* Spacer */}
                    <div className="flex-1 md:hidden" />

                    {/* ── CTA — always pinned at the bottom ── */}
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55, type: 'spring', stiffness: 200 }}
                      className="mt-3 md:mt-auto"
                    >
                      <Link
                        to={promotion.button_link || '/contact'}
                        onClick={handleClose}
                        className="group relative flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-sm overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, #D4A843 0%, #C17B2E 100%)',
                          color: '#1a0f00',
                          boxShadow: '0 4px 20px rgba(212,168,67,0.45), 0 0 0 1px rgba(212,168,67,0.3)',
                        }}
                      >
                        <span
                          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-12"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                          }}
                        />
                        <span className="relative">{promotion.button_text || 'Book Now'}</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                          className="relative"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.span>
                      </Link>

                      <button
                        onClick={handleClose}
                        className="block w-full text-center mt-2 text-xs"
                        style={{ color: 'rgba(245,220,180,0.4)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,220,180,0.7)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,220,180,0.4)')}
                      >
                        No thanks, maybe later
                      </button>
                    </motion.div>
                  </div>
                </div>

                {/* Bottom shimmer bar */}
                <div className="h-[3px] relative overflow-hidden flex-shrink-0">
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                    className="absolute inset-y-0 w-1/2"
                    style={{
                      background: 'linear-gradient(90deg, transparent, #D4A843, #F5CC6A, #D4A843, transparent)',
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
