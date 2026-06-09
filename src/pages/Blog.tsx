import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/use-seo";
import { API_BASE_URL } from "@/lib/api";
import { toImageSrc, withImageFallback } from "@/lib/images";

type BlogPost = {
  id: number;
  title: string;
  category?: string | null;
  excerpt?: string | null;
  image_url?: string | null;
  read_time?: string | null;
  created_at: string;
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

const Blog = () => {
  useSEO({
    title: "Stories from the Wild | WildWave Safaris Journal",
    description: "Dispatches from the most extraordinary corners of East Africa — written by those who lived them.",
    path: "/blog",
    keywords: ["safari blog", "east africa travel journal", "kenya safari", "tanzania safari", "gorilla trekking"],
  });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/public/blogs`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-[#F7F3EE] flex items-center justify-center font-['DM_Sans',sans-serif]">
        <p className="text-[#C1440E] animate-pulse uppercase tracking-widest font-['Space_Mono',monospace]">Loading Stories...</p>
      </div>
    );
  }

  // Generate unique categories for the filter tabs
  const categories = ["ALL", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  const filteredPosts = activeCategory === "ALL" 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] pt-24 font-['DM_Sans',sans-serif]">
      {/* Header Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="font-['Space_Mono',monospace] text-[12px] tracking-[0.15em] text-[#C1440E] uppercase mb-4">
            Our Journal
          </p>
          <h1 className="text-5xl md:text-7xl font-['Playfair_Display',serif] font-bold text-[#2C1A0E] mb-6 leading-tight">
            Stories from the <span className="italic text-[#D4A84B]">Wild</span>
          </h1>
          <p className="text-[#6B5744] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Expert guides, inspiring stories, and travel advice from the heart of East Africa.
          </p>
          
          {/* Dynamic Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mt-12 font-['Space_Mono',monospace] text-xs tracking-widest text-[#6B5744]">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat as string)}
                className={`px-4 py-2 transition-colors border-b-2 ${
                  activeCategory === cat 
                    ? 'text-[#C1440E] border-[#C1440E]' 
                    : 'border-transparent hover:text-[#2C1A0E] hover:border-[#2C1A0E]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Blog Grid Section */}
      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-[1400px]">
          {filteredPosts.length === 0 ? (
            <p className="text-center text-[#6B5744] py-12">No stories found in this category.</p>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {filteredPosts.map((post) => (
                <motion.article 
                  key={post.id}
                  variants={fadeUpItem}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="break-inside-avoid bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300 group cursor-pointer border border-[#E5DFD3]"
                >
                  <div className="w-full relative overflow-hidden aspect-[4/3]">
                    <img 
                      src={toImageSrc(post.image_url)} 
                      alt={post.title} 
                      onError={withImageFallback}
                      loading="lazy" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#D4A84B] text-[#1A1208] font-['Space_Mono',monospace] text-[10px] tracking-widest px-3 py-1.5 rounded uppercase font-semibold shadow-md">
                        {post.category || 'Travel'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-['Playfair_Display',serif] font-bold text-[#1A1208] mb-4 leading-snug group-hover:text-[#D4A84B] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[#6B5744] text-sm leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs font-semibold border-t border-[#E5DFD3] pt-4 mt-auto">
                      <div className="flex items-center gap-4 text-[#6B5744]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {formatDate(post.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {post.read_time || '5 min read'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Strip */}
      <section className="bg-[#2C1A0E] text-[#F7F3EE] py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl md:text-5xl font-['Playfair_Display',serif] font-bold mb-4">
            Never Miss a Story from the Wild
          </h3>
          <p className="text-[#D4A84B] text-lg mb-10 font-['DM_Sans',sans-serif]">
            New dispatches every two weeks. No spam.
          </p>
          <form className="flex flex-col sm:flex-row max-w-xl mx-auto gap-3" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-grow bg-[#1A1208] border border-[#6B5744] text-white px-6 py-4 rounded-md focus:outline-none focus:border-[#D4A84B] font-['DM_Sans',sans-serif] placeholder:text-[#6B5744]"
              required
            />
            <button 
              type="submit"
              className="bg-[#D4A84B] text-[#1A1208] px-8 py-4 rounded-md font-bold hover:bg-[#C1440E] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Blog;
