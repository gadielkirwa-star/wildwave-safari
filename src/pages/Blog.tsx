import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { Calendar, Clock, Facebook, Twitter, Link as LinkIcon } from "lucide-react";

const DIANI_IMAGES = [
  "https://i.pinimg.com/736x/1c/0c/6d/1c0c6d937843c47da0cc438056c679c8.jpg",
  "https://i.pinimg.com/736x/8e/87/f3/8e87f361b6a14578a5d04f833217b2df.jpg",
  "https://i.pinimg.com/736x/b5/28/f1/b528f1cc086713ad3830180bf82487aa.jpg"
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const slideInImage = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

const textReveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut", delay: 0.4 } 
  }
};

const Blog = () => {
  useSEO({
    title: "Diani Beach – Kenya’s Coastal Paradise | WildWave Safaris",
    description: "Discover why Diani Beach is one of the most popular beach destinations in East Africa.",
    path: "/blog/diani-beach",
  });

  return (
    <div className="min-h-screen bg-[#F7F3EE] pt-32 pb-24 font-['DM_Sans',sans-serif] selection:bg-[#D4A84B] selection:text-[#1A1208]">
      <div className="container mx-auto max-w-6xl px-4">
        
        {/* Header / Title Section */}
        <motion.div 
          initial="hidden" animate="visible" variants={textReveal}
          className="text-center mb-12"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 font-['Space_Mono',monospace] text-xs tracking-widest text-[#6B5744] mb-6 uppercase">
            <span className="text-[#C1440E] font-bold">Destinations</span>
            <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> June 2026</span>
            <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> 4 Min Read</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display',serif] font-bold text-[#1A1208] leading-tight mb-6">
            Diani Beach – <br />
            <span className="italic text-[#D4A84B]">Kenya’s Coastal Paradise</span>
          </h1>
          <hr className="w-24 h-0.5 bg-[#D4A84B] border-none mx-auto" />
        </motion.div>

        {/* The 3-Per-Row Image Gallery */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 overflow-hidden py-4"
        >
          {DIANI_IMAGES.map((src, idx) => (
            <motion.div 
              key={idx}
              variants={slideInImage}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-lg cursor-pointer"
            >
              <img 
                src={src} 
                alt={`Diani Beach scenery ${idx + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* The Info / Content Section */}
        <motion.div 
          initial="hidden" animate="visible" variants={textReveal}
          className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-2xl shadow-sm border border-[#E5DFD3]"
        >
          <article className="prose prose-lg md:prose-xl mx-auto prose-p:text-[#4A3D30] prose-p:leading-relaxed prose-p:mb-8">
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
          </article>

          {/* Footer / Social Share */}
          <div className="mt-16 pt-8 border-t border-[#E5DFD3] flex flex-col md:flex-row items-center justify-between gap-6">
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
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default Blog;
