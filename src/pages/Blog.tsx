import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { Calendar, Clock, MessageCircle, Phone } from "lucide-react";
import { fetchBlogs } from "@/lib/cmsApi";
import type { ApiBlog } from "@/lib/cmsApi";

type DisplayBlog = {
  id: number;
  theme: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch { return iso; }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const Blog = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [blogs, setBlogs] = useState<DisplayBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: "Stories from the Wild | WildWave Safaris",
    description: "Read our latest luxury travel guides and safari stories.",
    path: "/blog",
  });

  useEffect(() => {
    fetchBlogs()
      .then((data: ApiBlog[]) => {
        const mapped: DisplayBlog[] = data.map((b) => ({
          id: b.id,
          theme: b.category || "Wild Stories",
          title: b.title,
          category: b.category || "Safari",
          date: formatDate(b.created_at),
          readTime: b.read_time || "5 Min Read",
          image: b.image_url || "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
          excerpt: b.content || b.excerpt || "",
        }));
        setBlogs(mapped);
      })
      .catch(() => {/* silently ignore — empty state will show */})
      .finally(() => setLoading(false));
  }, []);

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
      <section className="px-4 xl:px-8 pb-32">
        <div className="container mx-auto max-w-[1600px]">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-8 bg-[#E5DFD3] rounded mb-4 w-3/4" />
                  <div className="h-64 bg-[#E5DFD3] rounded-2xl mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-[#E5DFD3] rounded w-full" />
                    <div className="h-4 bg-[#E5DFD3] rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <p className="text-center text-[#8C6B4A] py-24 text-xl">No blog posts yet. Check back soon!</p>
          ) : (
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16"
          >
            {blogs.map((blog) => (

              <article 
                key={blog.id} 
                className="group flex flex-col bg-transparent rounded-none border-none hover:-translate-y-1 transition-transform duration-500 cursor-pointer w-full h-full"
              >
                {/* FULL WIDTH TITLE SECTION ON TOP */}
                <div className="w-full mb-6 px-1">
                  <span className="block text-[#C1440E] italic text-lg xl:text-xl font-normal mb-2 tracking-wide font-['Playfair_Display',serif]">
                    {blog.theme}
                  </span>
                  <h4 className="text-3xl md:text-4xl xl:text-5xl font-['Playfair_Display',serif] font-bold text-[#1A1208] group-hover:text-[#D4A84B] transition-colors leading-[1.2]">
                    {blog.title}
                  </h4>
                </div>

                {/* CONTENT BLOCK WITH FLOATED IMAGE */}
                <div className="relative w-full text-left block after:content-[''] after:table after:clear-both">
                  {/* FLOATED DOMINANT IMAGE SECTION */}
                  <div className="float-left w-[100%] md:w-[50%] lg:w-[55%] xl:w-[60%] mr-6 md:mr-8 mb-6 mt-2 shrink-0">
                    {/* Premium Frame: warm off-white matte with gold accent bottom */}
                    <div className="bg-[#FDFBF7] p-3 md:p-4 rounded-2xl border border-[#E5DFD3] shadow-md group-hover:shadow-xl transition-all duration-500 border-b-4 border-b-[#D4A84B]">
                      {/* Image with fixed aspect ratio — no collapse */}
                      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        />
                        {/* Cinematic bottom gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Category pill floating above gradient */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-white/90 backdrop-blur-sm text-[#8C6B4A] font-['Space_Mono',monospace] text-[10px] tracking-widest px-3 py-1.5 rounded-full uppercase font-bold shadow-sm border border-white/50">
                            {blog.category}
                          </span>
                        </div>

                        {/* Bottom reading-time strip */}
                        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 z-10 flex items-center justify-between">
                          <span className="text-white/80 text-xs font-['Space_Mono',monospace] tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {blog.readTime}
                          </span>
                          <span className="text-white/80 text-xs font-['Space_Mono',monospace] tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> {blog.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EXCERPT TEXT FLOWING AROUND IMAGE */}
                  <div className="text-[#4A3D30] leading-relaxed text-base xl:text-lg font-light whitespace-pre-line text-justify md:text-left transition-all duration-500">
                    <div className={`transition-all duration-500 ${expandedId === blog.id ? '' : 'line-clamp-[10] md:line-clamp-[12] xl:line-clamp-[14]'}`}>
                      {blog.excerpt}
                    </div>
                  </div>

                  {/* INLINE ACTION BUTTON */}
                  <div className="mt-6 block clear-both">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setExpandedId(expandedId === blog.id ? null : blog.id);
                      }}
                      className="group/btn inline-flex items-center gap-2 text-[#1A1208] font-bold border-b-2 border-[#D4A84B] pb-1 hover:text-[#D4A84B] hover:border-[#1A1208] transition-all text-xs xl:text-sm uppercase tracking-widest font-['Space_Mono',monospace]"
                    >
                      {expandedId === blog.id ? 'Show Less' : 'Read Story'} 
                      <span className="transition-transform group-hover/btn:translate-x-1">
                        {expandedId === blog.id ? '↑' : '→'}
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
          )}
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
