import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { MessageCircle, Phone } from "lucide-react";

// Mock data using the approved card layout for the main blog list
const BLOGS = [
  {
    id: 1,
    title: "Safari & Sea Escape",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    desc: "Experience the magic of 4 days in the Masai Mara followed by 4 days relaxing on the pristine white sands of Diani Beach."
  },
  {
    id: 2,
    title: "Coastal Marine Adventure",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    desc: "Dive into the Indian Ocean and snorkel with wild dolphins in the crystal clear waters of Kisite-Mpunguti Marine Park."
  },
  {
    id: 3,
    title: "Romantic Diani Honeymoon",
    image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&q=80",
    desc: "Unwind in luxury beachfront villas and enjoy private dhow sunset cruises along Kenya's most beautiful coastline."
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const Blog = () => {
  useSEO({
    title: "Stories from the Wild | WildWave Safaris",
    description: "Read our latest luxury travel guides and safari stories.",
    path: "/blog",
  });

  return (
    <div className="min-h-screen bg-[#F7F3EE] font-['DM_Sans',sans-serif] selection:bg-[#D4A84B] selection:text-[#1A1208] pt-32 pb-0">
      
      {/* PAGE HEADER */}
      <section className="px-4 mb-16">
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="container mx-auto max-w-6xl text-center"
        >
          <p className="text-[#C1440E] font-['Space_Mono',monospace] text-xs uppercase tracking-widest font-semibold mb-4">Our Journal</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-['Playfair_Display',serif] font-bold text-[#1A1208] leading-[1.15] mb-8">
            Stories from the <span className="italic text-[#D4A84B]">Wild</span>
          </h1>
          <hr className="w-16 h-0.5 bg-[#D4A84B] border-none mx-auto" />
        </motion.div>
      </section>

      {/* APPROVED BLOG GRID LAYOUT (From Related Safaris) */}
      <section className="px-4 pb-24">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {BLOGS.map((blog) => (
              <div key={blog.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5DFD3] hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                <div className="aspect-[4/3] relative overflow-hidden shrink-0">
                  <img src={blog.image} alt={blog.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h4 className="text-2xl font-['Playfair_Display',serif] font-bold text-[#1A1208] mb-4 group-hover:text-[#D4A84B] transition-colors leading-tight">{blog.title}</h4>
                  <p className="text-[#6B5744] mb-8 line-clamp-3 leading-relaxed flex-grow">{blog.desc}</p>
                  <button className="w-full py-4 border border-[#1A1208] text-[#1A1208] font-bold rounded hover:bg-[#1A1208] hover:text-white transition-colors text-sm uppercase tracking-widest font-['Space_Mono',monospace] mt-auto">
                    Read Story
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="bg-[#1A1208] text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600')] bg-cover bg-center" />
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="container mx-auto max-w-4xl text-center relative z-10"
        >
          <p className="text-[#D4A84B] font-['Space_Mono',monospace] text-xs uppercase tracking-widest font-semibold mb-4">Plan Your Journey</p>
          <h2 className="text-4xl md:text-6xl font-['Playfair_Display',serif] font-bold mb-10 leading-tight">
            Ready to Explore East Africa?
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-[#D4A84B] text-[#1A1208] px-8 py-4 rounded font-bold hover:bg-white transition-colors text-sm uppercase tracking-widest font-['Space_Mono',monospace]">
              Book Safari
            </button>
            <button className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-4 rounded font-bold hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest font-['Space_Mono',monospace]">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </button>
            <button className="w-full sm:w-auto border border-white/30 text-white px-8 py-4 rounded font-bold hover:bg-white hover:text-[#1A1208] transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest font-['Space_Mono',monospace]">
              <Phone className="w-4 h-4" /> Contact
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Blog;
