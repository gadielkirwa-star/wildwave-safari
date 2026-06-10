import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/use-seo";
import { useParams, Link } from "react-router-dom";
import { 
  Calendar, Clock, X, ChevronLeft, ChevronRight, 
  MapPin, Sun, Activity, Timer, Mountain, Users,
  MessageCircle, Phone, ArrowRight
} from "lucide-react";

// Mock Data for the Blog Details Prototype
// In a real app, we would fetch this based on the ID
const getBlogData = (id: string | undefined) => {
  // Return the Great Migration details if ID is 1, else default Diani Beach
  if (id === "1") {
    return {
      title: "The Great Wildebeest Migration: Nature's Greatest Wildlife Spectacle",
      category: "Wildlife",
      date: "July 12, 2026",
      readTime: "8 Min Read",
      images: [
        "https://i.pinimg.com/736x/dd/c5/a4/ddc5a4a182a6a00a24374c0186b6b58a.jpg",
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=85",
        "https://images.unsplash.com/photo-1589304001925-5e608fcd7e0a?w=800&q=85",
        "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800&q=85"
      ],
      content: `
        <p class="lead">Every year, East Africa hosts one of the most breathtaking wildlife events on the planet—the Great Wildebeest Migration. More than 1.5 million wildebeest, accompanied by hundreds of thousands of zebras and gazelles, embark on an epic journey across the vast plains of Tanzania and Kenya in search of fresh grazing land and water.</p>
        <p>The migration begins in the southern Serengeti, where thousands of calves are born during the calving season. As the dry season approaches, the herds move north through the Serengeti and into Kenya's Masai Mara, covering hundreds of kilometers along the way.</p>
        <blockquote>"The Great Wildebeest Migration is more than a safari experience—it's a powerful reminder of the raw beauty, resilience, and wonder of the natural world."</blockquote>
        <p>One of the most dramatic moments occurs at the Mara River crossings. Here, the animals must brave strong currents and lurking crocodiles as they fight to reach greener pastures. These crossings provide some of the most thrilling wildlife encounters in Africa and attract photographers and safari enthusiasts from around the world.</p>
        <p>Beyond the river crossings, the migration supports an entire ecosystem. Lions, cheetahs, leopards, hyenas, and other predators follow the herds, creating a remarkable display of nature's balance and survival.</p>
        <p>The best time to witness the migration in the Masai Mara is typically from July to October, while different stages of the migration can be viewed throughout the year in the Serengeti.</p>
      `,
      facts: {
        location: "Serengeti & Masai Mara",
        bestTime: "Jul-Oct (Crossings)",
        activities: "Game Drives, Balloon Safari",
        duration: "5 - 10 Days",
        difficulty: "Moderate",
        familyFriendly: "Yes (Older Children)"
      },
      relatedTours: [
        {
          id: 1,
          title: "Ultimate Migration Safari",
          image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80",
          desc: "7 days following the herds across the Serengeti."
        },
        {
          id: 2,
          title: "Mara River Crossing Special",
          image: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600&q=80",
          desc: "Prime positioning for the dramatic river crossings."
        },
        {
          id: 3,
          title: "Migration & Beach Retreat",
          image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600&q=80",
          desc: "5 days migration safari followed by 4 days in Zanzibar."
        }
      ]
    };
  }

  // Default Fallback Data
  return {
    title: "Diani Beach – Kenya’s Coastal Paradise",
    category: "Destinations",
    date: "June 12, 2026",
    readTime: "4 Min Read",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85",
      "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=85",
      "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=85",
      "https://images.unsplash.com/photo-1535262412227-85541e910204?w=800&q=85"
    ],
    content: `
      <p class="lead">Diani Beach is one of the most popular beach destinations in East Africa, known for its white sandy beaches, clear turquoise waters, and relaxed tropical atmosphere.</p>
      <p>Visitors come here for both relaxation and adventure. You can enjoy swimming, sunbathing, snorkeling, kitesurfing, and dhow sunset cruises along the Indian Ocean. Nearby attractions like Shimba Hills and Wasini Island add wildlife and marine experiences to the trip.</p>
      <blockquote>"The powdery white sand of Diani feels like walking on powdered sugar. It is the ultimate finale to a dusty, thrilling safari."</blockquote>
      <p>The best time to visit is during the dry seasons, from December to March and July to October, when the weather is sunny and ideal for beach activities. During these months, the trade winds are also perfect for kite surfing, attracting enthusiasts from all over the world.</p>
    `,
    facts: {
      location: "South Coast, Kenya",
      bestTime: "Dec-Mar & Jul-Oct",
      activities: "Kitesurfing, Snorkeling",
      duration: "4 - 7 Days",
      difficulty: "Easy / Relaxing",
      familyFriendly: "Yes (All Ages)"
    },
    relatedTours: [
      {
        id: 1,
        title: "Safari & Sea Escape",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80",
        desc: "4 days Masai Mara followed by 4 days in Diani Beach."
      },
      {
        id: 2,
        title: "Coastal Marine Adventure",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
        desc: "Snorkel with dolphins in Kisite-Mpunguti Marine Park."
      },
      {
        id: 3,
        title: "Romantic Diani Honeymoon",
        image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600&q=80",
        desc: "Luxury beachfront villas and private dhow cruises."
      }
    ]
  };
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const BLOG_DATA = getBlogData(id);

  useSEO({
    title: `${BLOG_DATA.title} | WildWave Safaris`,
    description: "Read our latest luxury travel guide.",
    path: `/blog/${id}`,
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? BLOG_DATA.images.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === BLOG_DATA.images.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") setCurrentImageIndex((prev) => (prev === 0 ? BLOG_DATA.images.length - 1 : prev - 1));
      if (e.key === "ArrowRight") setCurrentImageIndex((prev) => (prev === BLOG_DATA.images.length - 1 ? 0 : prev + 1));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  return (
    <div className="min-h-screen bg-[#F7F3EE] font-['DM_Sans',sans-serif] selection:bg-[#D4A84B] selection:text-[#1A1208]">
      
      {/* 1. PAGE HEADER */}
      <section className="pt-40 pb-16 px-4 relative">
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="container mx-auto max-w-4xl text-center"
        >
          <div className="absolute top-32 left-4 md:left-8 xl:left-auto xl:-ml-32">
            <Link to="/blog" className="inline-flex items-center gap-2 text-[#6B5744] hover:text-[#C1440E] transition-colors font-['Space_Mono',monospace] text-xs uppercase tracking-widest font-semibold bg-white px-4 py-2 rounded-full shadow-sm border border-[#E5DFD3]">
              <ChevronLeft className="w-4 h-4" /> Back
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-['Space_Mono',monospace] text-[10px] md:text-xs tracking-widest text-[#6B5744] mb-8 uppercase font-semibold">
            <span className="text-[#C1440E] bg-[#C1440E]/10 px-3 py-1 rounded">{BLOG_DATA.category}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {BLOG_DATA.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {BLOG_DATA.readTime}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-['Playfair_Display',serif] font-bold text-[#1A1208] leading-[1.15] mb-8">
            {BLOG_DATA.title}
          </h1>
          
          <hr className="w-16 h-0.5 bg-[#D4A84B] border-none mx-auto" />
        </motion.div>
      </section>

      {/* 2. MASONRY IMAGE GALLERY */}
      <section className="px-4 pb-16">
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="container mx-auto max-w-7xl"
        >
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {BLOG_DATA.images.map((src, idx) => (
              <div 
                key={idx} 
                onClick={() => openLightbox(idx)}
                className="break-inside-avoid overflow-hidden rounded-xl cursor-zoom-in relative group bg-[#E5DFD3]"
              >
                <img 
                  src={src} 
                  alt={`Gallery image ${idx + 1}`} 
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 3. ARTICLE CONTENT */}
      <section className="px-4 pb-16">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="container mx-auto max-w-[800px]"
        >
          <div 
            className="prose prose-lg md:prose-xl max-w-none 
              prose-p:text-[#4A3D30] prose-p:leading-relaxed prose-p:mb-8 
              prose-blockquote:border-l-[#D4A84B] prose-blockquote:bg-white prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:text-[#2C1A0E] prose-blockquote:font-['Playfair_Display',serif] prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:my-12 prose-blockquote:shadow-sm
              [&_.lead]:text-2xl [&_.lead]:font-['Playfair_Display',serif] [&_.lead]:text-[#2C1A0E] [&_.lead]:leading-snug [&_.lead]:mb-10"
            dangerouslySetInnerHTML={{ __html: BLOG_DATA.content }}
          />
        </motion.div>
      </section>

      {/* 4. TRAVEL FACTS SECTION */}
      <section className="px-4 pb-20">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="container mx-auto max-w-[800px]"
        >
          <div className="bg-white border border-[#E5DFD3] rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A84B]/10 rounded-bl-full -z-0" />
            
            <h3 className="text-2xl font-['Playfair_Display',serif] font-bold text-[#1A1208] mb-8 relative z-10">
              Essential Travel Facts
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F7F3EE] flex items-center justify-center text-[#C1440E] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#6B5744] font-semibold mb-1">Location</p>
                  <p className="text-[#1A1208] font-medium">{BLOG_DATA.facts.location}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F7F3EE] flex items-center justify-center text-[#C1440E] shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#6B5744] font-semibold mb-1">Best Time</p>
                  <p className="text-[#1A1208] font-medium">{BLOG_DATA.facts.bestTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F7F3EE] flex items-center justify-center text-[#C1440E] shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#6B5744] font-semibold mb-1">Activities</p>
                  <p className="text-[#1A1208] font-medium">{BLOG_DATA.facts.activities}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F7F3EE] flex items-center justify-center text-[#C1440E] shrink-0">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#6B5744] font-semibold mb-1">Duration</p>
                  <p className="text-[#1A1208] font-medium">{BLOG_DATA.facts.duration}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F7F3EE] flex items-center justify-center text-[#C1440E] shrink-0">
                  <Mountain className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#6B5744] font-semibold mb-1">Difficulty</p>
                  <p className="text-[#1A1208] font-medium">{BLOG_DATA.facts.difficulty}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F7F3EE] flex items-center justify-center text-[#C1440E] shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#6B5744] font-semibold mb-1">Family Friendly</p>
                  <p className="text-[#1A1208] font-medium">{BLOG_DATA.facts.familyFriendly}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 5. RELATED TOURS */}
      <section className="px-4 pb-20 pt-10 border-t border-[#E5DFD3]">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl md:text-4xl font-['Playfair_Display',serif] font-bold text-[#1A1208]">
                Related Safaris
              </h3>
              <a href="/packages" className="hidden md:flex items-center gap-2 text-[#C1440E] font-semibold hover:gap-3 transition-all uppercase tracking-widest text-xs font-['Space_Mono',monospace]">
                View All <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {BLOG_DATA.relatedTours.map((tour) => (
                <div key={tour.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5DFD3] hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img src={tour.image} alt={tour.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-['Playfair_Display',serif] font-bold text-[#1A1208] mb-2 group-hover:text-[#D4A84B] transition-colors">{tour.title}</h4>
                    <p className="text-sm text-[#6B5744] mb-6 line-clamp-2">{tour.desc}</p>
                    <Link to="/packages" className="block w-full py-3 border border-[#1A1208] text-[#1A1208] font-bold rounded hover:bg-[#1A1208] hover:text-white transition-colors text-sm uppercase tracking-wider font-['Space_Mono',monospace] text-center">
                      View Tour
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. BOOKING CTA */}
      <section className="bg-[#1A1208] text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600')] bg-cover bg-center" />
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="container mx-auto max-w-4xl text-center relative z-10"
        >
          <p className="text-[#D4A84B] font-['Space_Mono',monospace] text-xs uppercase tracking-widest font-semibold mb-4">Plan Your Journey</p>
          <h2 className="text-4xl md:text-6xl font-['Playfair_Display',serif] font-bold mb-10 leading-tight">
            Ready to Explore This Destination?
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking" className="w-full sm:w-auto bg-[#D4A84B] text-[#1A1208] px-8 py-4 rounded font-bold hover:bg-white transition-colors text-sm uppercase tracking-widest font-['Space_Mono',monospace] text-center">
              Book Safari
            </Link>
            <a href="https://wa.me/254713241666" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-4 rounded font-bold hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest font-['Space_Mono',monospace]">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <Link to="/contact" className="w-full sm:w-auto border border-white/30 text-white px-8 py-4 rounded font-bold hover:bg-white hover:text-[#1A1208] transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest font-['Space_Mono',monospace]">
              <Phone className="w-4 h-4" /> Contact
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 7. FULLSCREEN LIGHTBOX OVERLAY */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
              <p className="text-white/70 font-['Space_Mono',monospace] text-sm tracking-widest">
                {currentImageIndex + 1} / {BLOG_DATA.images.length}
              </p>
              <button 
                onClick={closeLightbox}
                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Arrows */}
            <button 
              onClick={prevImage}
              className="absolute left-4 md:left-8 text-white/50 hover:text-white p-4 hover:bg-white/10 rounded-full transition-all z-10"
            >
              <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
            </button>

            {/* Main Image */}
            <motion.img 
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              src={BLOG_DATA.images[currentImageIndex]} 
              alt="Fullscreen gallery view"
              className="max-w-[90vw] max-h-[85vh] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
            />

            <button 
              onClick={nextImage}
              className="absolute right-4 md:right-8 text-white/50 hover:text-white p-4 hover:bg-white/10 rounded-full transition-all z-10"
            >
              <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default BlogDetails;
