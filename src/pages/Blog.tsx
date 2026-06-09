import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/use-seo";
import { Calendar, Clock, Share2, Facebook, Twitter, Link as LinkIcon } from "lucide-react";

const DIANI_IMAGES = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=85",
  "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1600&q=85",
  "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1600&q=85"
];

const sliderVariants = {
  enter: { opacity: 0, scale: 1.05 },
  center: { 
    opacity: 1, 
    scale: 1,
    transition: {
      opacity: { duration: 1.5, ease: "easeInOut" },
      scale: { duration: 8, ease: "linear" } // Super sliding Ken Burns effect
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 1.5, ease: "easeInOut" }
  }
};

const textReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 } 
  }
};

const Blog = () => {
  useSEO({
    title: "Diani Beach – Kenya’s Coastal Paradise | WildWave Safaris",
    description: "Discover why Diani Beach is one of the most popular beach destinations in East Africa.",
    path: "/blog/diani-beach",
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-sliding logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DIANI_IMAGES.length);
    }, 6000); // Slide every 6 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F3EE] font-['DM_Sans',sans-serif] selection:bg-[#D4A84B] selection:text-[#1A1208]">
      
      {/* 1. The Super Sliding Image Carousel (Images First) */}
      <section className="relative w-full h-[75vh] md:h-[85vh] overflow-hidden bg-[#1A1208]">
        <AnimatePresence mode="sync">
          <motion.img
            key={currentIndex}
            src={DIANI_IMAGES[currentIndex]}
            alt="Diani Beach scenic view"
            variants={sliderVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transformOrigin: 'center center' }}
          />
        </AnimatePresence>
        
        {/* Subtle gradient overlay to make scrolling down seamless */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F3EE] via-transparent to-black/20" />
        
        {/* Slider Navigation Dots */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-3 z-10">
          {DIANI_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                idx === currentIndex ? 'w-8 bg-[#D4A84B]' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. The Classic, Beautifully Designed Information Section */}
      <section className="relative z-20 px-4 pb-32 -mt-20 md:-mt-32">
        <div className="container mx-auto max-w-4xl bg-white shadow-[0_20px_60px_-15px_rgba(44,26,14,0.1)] rounded-2xl md:rounded-[40px] p-8 md:p-16 lg:p-24 relative">
          
          {/* Metadata */}
          <motion.div 
            initial="hidden" animate="visible" variants={textReveal}
            className="flex flex-wrap items-center justify-center gap-6 font-['Space_Mono',monospace] text-xs tracking-widest text-[#6B5744] mb-10 uppercase"
          >
            <span className="text-[#C1440E] font-bold">Destinations</span>
            <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> June 2026</span>
            <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> 4 Min Read</span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial="hidden" animate="visible" variants={textReveal}
            className="text-4xl md:text-6xl lg:text-7xl font-['Playfair_Display',serif] font-bold text-[#1A1208] text-center leading-[1.1] mb-12"
          >
            Diani Beach – <br />
            <span className="italic text-[#D4A84B]">Kenya’s Coastal Paradise</span>
          </motion.h1>

          <hr className="w-24 h-0.5 bg-[#D4A84B] border-none mx-auto mb-16" />

          {/* Body Content */}
          <motion.article 
            initial="hidden" animate="visible" variants={textReveal}
            className="prose prose-lg md:prose-xl mx-auto prose-p:text-[#4A3D30] prose-p:leading-relaxed prose-p:mb-8"
          >
            <p className="text-xl md:text-2xl font-['Playfair_Display',serif] text-[#2C1A0E] italic text-center mb-12 leading-relaxed">
              Diani Beach is one of the most popular beach destinations in East Africa, known for its white sandy beaches, clear turquoise waters, and relaxed tropical atmosphere.
            </p>

            <p>
              Visitors come here for both relaxation and adventure. You can enjoy swimming, sunbathing, snorkeling, kitesurfing, and dhow sunset cruises along the Indian Ocean. Nearby attractions like Shimba Hills and Wasini Island add wildlife and marine experiences to the trip.
            </p>

            <p>
              The best time to visit is during the dry seasons, from December to March and July to October, when the weather is sunny and ideal for beach activities.
            </p>

            <p>
              Diani is perfect for honeymooners, families, and solo travelers looking for a mix of luxury, nature, and coastal culture.
            </p>
          </motion.article>

          {/* Footer / Social Share */}
          <motion.div 
            initial="hidden" animate="visible" variants={textReveal}
            className="mt-20 pt-10 border-t border-[#E5DFD3] flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80" 
                alt="Author" 
                className="w-12 h-12 rounded-full object-cover border-2 border-[#F7F3EE]"
              />
              <div>
                <p className="text-sm font-bold text-[#1A1208]">By Wild Waves Editorial</p>
                <p className="text-xs text-[#6B5744] font-['Space_Mono',monospace]">Safari Experts</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[#6B5744]">
              <span className="text-xs uppercase tracking-widest font-['Space_Mono',monospace] font-bold mr-2">Share</span>
              <button className="w-10 h-10 rounded-full border border-[#E5DFD3] flex items-center justify-center hover:bg-[#D4A84B] hover:text-white hover:border-[#D4A84B] transition-colors">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full border border-[#E5DFD3] flex items-center justify-center hover:bg-[#D4A84B] hover:text-white hover:border-[#D4A84B] transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full border border-[#E5DFD3] flex items-center justify-center hover:bg-[#D4A84B] hover:text-white hover:border-[#D4A84B] transition-colors">
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Blog;
