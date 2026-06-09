import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { Calendar, Clock, MessageCircle, Phone } from "lucide-react";

// Expanded Mock Data to show how long content behaves
const BLOGS = [
  {
    id: 1,
    title: "The Ultimate Guide to Witnessing the Great Migration in the Serengeti",
    category: "Wildlife",
    date: "July 12, 2026",
    readTime: "8 Min Read",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    excerpt: "Every year, over two million wildebeest, zebras, and gazelles embark on a perilous journey across the plains of East Africa. Witnessing this incredible spectacle is a life-changing experience, but timing is everything. Our expert guides break down exactly where and when you need to be to witness the dramatic river crossings, how to avoid the biggest crowds, and what luxury lodges offer the absolute best vantage points for this natural wonder. From the southern calving plains in February to the crocodile-infested Mara River in August, this is your definitive guide to the Great Migration."
  },
  {
    id: 2,
    title: "Diving the Depths: Kisite-Mpunguti Marine Park",
    category: "Coastal",
    date: "June 28, 2026",
    readTime: "5 Min Read",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    excerpt: "Dive into the Indian Ocean and snorkel with wild dolphins in the crystal clear waters of Kisite-Mpunguti Marine Park. Located just off the southern coast of Kenya, this pristine marine reserve offers some of the best snorkeling and diving in Africa, teeming with colorful coral gardens and rare marine life."
  },
  {
    id: 3,
    title: "Romantic Diani: The Perfect Honeymoon Escape",
    category: "Luxury",
    date: "May 15, 2026",
    readTime: "4 Min Read",
    image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800&q=80",
    excerpt: "Unwind in luxury beachfront villas and enjoy private dhow sunset cruises along Kenya's most beautiful coastline. Let the warm tropical breeze and the sound of the ocean wash away the stress of your wedding planning."
  },
  {
    id: 4,
    title: "Gorilla Trekking in Bwindi Impenetrable Forest",
    category: "Adventure",
    date: "April 02, 2026",
    readTime: "6 Min Read",
    image: "https://images.unsplash.com/photo-1564415051832-68045e7e0d3b?w=800&q=80",
    excerpt: "Deep in the misty mountains of Uganda lies one of the most incredible wildlife encounters on earth. Coming face-to-face with a silverback mountain gorilla is a humbling, emotional experience that you will never forget. Learn exactly what to pack, how to prepare physically, and what to expect during your trek."
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

      {/* MAGAZINE STYLE BLOG LISTING */}
      <section className="px-4 pb-24">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12"
          >
            {BLOGS.map((blog) => (
              <article 
                key={blog.id} 
                className="group relative bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-[#E5DFD3] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer block w-full"
              >
                {/* 
                  Using floats to allow text to wrap under the image gracefully.
                  On mobile (default), it acts as a normal block element.
                  On tablet (md:), it floats left.
                */}
                <div className="md:float-left md:w-[40%] xl:w-[45%] md:mr-6 mb-4 md:mb-2 overflow-hidden rounded-xl shrink-0">
                  <div className="aspect-[4/3] md:aspect-[3/4] lg:aspect-square xl:aspect-[4/3] relative">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="pt-1 md:pt-0">
                  <div className="flex flex-wrap items-center gap-3 font-['Space_Mono',monospace] text-[10px] tracking-widest text-[#6B5744] mb-4 uppercase font-semibold">
                    <span className="text-[#C1440E] bg-[#C1440E]/10 px-2 py-1 rounded">{blog.category}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {blog.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.readTime}</span>
                  </div>
                  
                  <h4 className="text-2xl lg:text-3xl font-['Playfair_Display',serif] font-bold text-[#1A1208] mb-4 group-hover:text-[#D4A84B] transition-colors leading-snug">
                    {blog.title}
                  </h4>
                  
                  <p className="text-[#6B5744] mb-6 leading-relaxed text-sm md:text-base">
                    {blog.excerpt}
                  </p>

                  <button className="inline-block border-b-2 border-[#D4A84B] pb-1 text-[#1A1208] font-bold hover:text-[#D4A84B] transition-colors text-xs uppercase tracking-widest font-['Space_Mono',monospace]">
                    Read Full Story
                  </button>
                </div>

                {/* Clear the float so the card wraps the entire content properly */}
                <div className="clear-both"></div>
              </article>
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
