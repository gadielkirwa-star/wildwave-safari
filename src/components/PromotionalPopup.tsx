import { useState, useEffect } from 'react'
import { X, Tag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function PromotionalPopup() {
  const [promotions, setPromotions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://wildwave-safaris-api.onrender.com/api';
        const response = await fetch(`${apiUrl}/public/promotions`)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch promotions`)
        }
        const data = await response.json()
        console.log('Promotions data:', data)
        if (data && data.length > 0) {
          setPromotions(data)
          setIsOpen(true)
        }
      } catch (error) {
        console.error('Failed to fetch promotions:', error)
      }
    }
    fetchPromotions()
  }, [])

  useEffect(() => {
    if (promotions.length > 1 && isOpen) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % promotions.length)
      }, 20000)
      return () => clearInterval(interval)
    }
  }, [promotions, isOpen])

  useEffect(() => {
    if (promotions.length > 0 && isOpen) {
      const timeout = setTimeout(() => {
        setIsOpen(false)
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % promotions.length)
          setIsOpen(true)
        }, 100)
      }, 20000)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, promotions, isOpen])

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!promotions.length || !isOpen) return null

  const promotion = promotions[currentIndex]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:inset-auto z-50 md:w-full md:max-w-md flex items-center justify-center"
          >
            <div className="bg-white dark:bg-safari-charcoal rounded-2xl shadow-2xl overflow-hidden border-4 border-safari-gold w-full max-h-[90vh] overflow-y-auto">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="relative bg-gradient-to-br from-safari-gold to-safari-terracotta p-8 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-6 h-6" />
                    <span className="text-sm font-bold uppercase tracking-wider">Special Offer</span>
                  </div>
                  {promotions.length > 1 && (
                    <div className="flex gap-1">
                      {promotions.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentIndex ? 'bg-white' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {promotion.discount_text && (
                  <div className="text-4xl font-display font-bold mb-2">{promotion.discount_text}</div>
                )}
                <h2 className="text-2xl font-display font-bold">{promotion.title}</h2>
              </div>

              <div className="p-8">
                <p className="text-gray-700 dark:text-safari-sand mb-6 leading-relaxed">
                  {promotion.description}
                </p>
                <Link
                  to={promotion.button_link}
                  onClick={(e) => {
                    const token = localStorage.getItem('customerToken');
                    if (!token) {
                      e.preventDefault();
                      window.location.href = '/auth';
                    }
                    handleClose();
                  }}
                  className="block w-full text-center px-6 py-3 bg-safari-gold hover:bg-safari-terracotta text-white font-bold rounded-xl transition-colors"
                >
                  {promotion.button_text}
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
