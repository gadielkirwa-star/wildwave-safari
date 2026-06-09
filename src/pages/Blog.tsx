import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

// Layout pattern to create the asymmetric Pinterest grid
const getLayoutClass = (index: number, total: number) => {
  if (index === 0) return "card-hero";
  if (index === total - 1 && total > 3) return "card-last md:flex-row !bg-white"; // Last post spans horizontal
  
  // Repeating pattern for the middle cards
  const pattern = [
    "card-tall",
    "card-normal",
    "card-normal",
    "card-wide",
    "card-normal",
    "card-normal",
    "card-tall",
    "card-wide"
  ];
  
  return pattern[(index - 1) % pattern.length];
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
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

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

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
            Dispatches from the most extraordinary corners of East Africa — written by those who lived them.
          </p>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mt-12 font-['Space_Mono',monospace] text-xs tracking-widest text-[#6B5744]">
            <button className="px-4 py-2 text-[#C1440E] border-b border-[#C1440E] transition-colors">ALL</button>
            <button className="px-4 py-2 hover:text-[#2C1A0E] transition-colors">KENYA</button>
            <button className="px-4 py-2 hover:text-[#2C1A0E] transition-colors">TANZANIA</button>
            <button className="px-4 py-2 hover:text-[#2C1A0E] transition-colors">UGANDA</button>
            <button className="px-4 py-2 hover:text-[#2C1A0E] transition-colors">ISLANDS</button>
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-[1400px]">
          {posts.length === 0 ? (
            <p className="text-center text-[#6B5744] py-12">No stories published yet. Check back soon.</p>
          ) : (
            <motion.div 
              className="blog-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Featured Post (Hero) */}
              {featuredPost && (
                <motion.article 
                  variants={fadeUpItem}
                  className={`blog-card ${getLayoutClass(0, posts.length)}`}
                >
                  <img 
                    src={toImageSrc(featuredPost.image_url)} 
                    alt={featuredPost.title} 
                    onError={withImageFallback}
                    loading="eager" 
                  />
                  <div className="card-overlay" />
                  
                  <div className="absolute top-6 left-6">
                    <span className="region-tag">{featuredPost.category || 'Safari'}</span>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                    <h2 className="text-3xl md:text-5xl font-['Playfair_Display',serif] font-bold mb-4 leading-tight max-w-4xl">
                      {featuredPost.title}
                    </h2>
                    <p className="text-white/80 text-lg mb-6 max-w-2xl leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-6 font-medium text-sm">
                      <span className="opacity-80">{featuredPost.read_time || '5 min read'}</span>
                      <span className="text-[#D4A84B] hover:text-white transition-colors flex items-center gap-2">
                        Read the Full Story <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </motion.article>
              )}

              {/* Asymmetric Grid */}
              {remainingPosts.map((post, idx) => {
                const actualIndex = idx + 1;
                const layoutClass = getLayoutClass(actualIndex, posts.length);
                const isHorizontal = layoutClass.includes("card-last");

                if (isHorizontal) {
                  return (
                    <motion.article 
                      key={post.id}
                      variants={fadeUpItem}
                      className={`blog-card ${layoutClass}`}
                    >
                      <div className="w-full md:w-2/5 h-64 md:h-full relative overflow-hidden">
                        <img 
                          src={toImageSrc(post.image_url)} 
                          alt={post.title} 
                          onError={withImageFallback}
                          loading="lazy" 
                          className="absolute inset-0 w-full h-full object-cover" 
                        />
                      </div>
                      <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-white z-10">
                        <div className="mb-4">
                          <span className="region-tag !bg-[#F7F3EE] !text-[#6B5744]">{post.category || 'Travel'}</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-['Playfair_Display',serif] font-bold text-[#1A1208] mb-4 leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-[#6B5744] text-lg mb-8 leading-relaxed max-w-xl line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-6 text-sm font-semibold mt-auto">
                          <span className="text-[#6B5744] uppercase tracking-wide">{post.read_time || '4 min read'}</span>
                          <span className="text-[#C1440E] flex items-center gap-2 hover:gap-3 transition-all cursor-pointer">
                            Read the Full Story <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  );
                }

                // Standard Grid Cards (Tall, Wide, Normal)
                return (
                  <motion.article 
                    key={post.id}
                    variants={fadeUpItem}
                    className={`blog-card ${layoutClass}`}
                  >
                    <img 
                      src={toImageSrc(post.image_url)} 
                      alt={post.title} 
                      onError={withImageFallback}
                      loading="lazy" 
                    />
                    <div className="card-overlay" />
                    
                    <div className="absolute top-5 left-5">
                      <span className="region-tag">{post.category || 'Guide'}</span>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10">
                      <h3 className={`font-['Playfair_Display',serif] font-bold mb-3 leading-snug ${
                        layoutClass === 'card-wide' || layoutClass === 'card-tall' ? 'text-2xl md:text-3xl max-w-xl' : 'text-xl md:text-2xl'
                      }`}>
                        {post.title}
                      </h3>
                      <p className="text-white/70 text-sm md:text-base mb-5 line-clamp-2 md:line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <span className="opacity-80 uppercase tracking-wide">{post.read_time || '6 min read'}</span>
                        <span className="text-[#D4A84B] flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read Story <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
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
