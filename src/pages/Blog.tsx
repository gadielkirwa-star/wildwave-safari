import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Great Migration: Witnessing Nature's Most Spectacular Show",
    teaser: "Every July, over 1.5 million wildebeest thunder across the Mara River in a crossing so dramatic it stops time. Here's what it truly feels like to be there.",
    readTime: "8 min read",
    tag: "Kenya · Wildlife",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1400&q=85",
    layout: "card-hero"
  },
  {
    id: 2,
    title: "Serengeti Without End: The Plains That Redefine Infinity",
    teaser: "There is no fence, no border, no edge you can see. Just golden grass, thundering hooves, and a sky that swallows you whole.",
    readTime: "6 min read",
    tag: "Tanzania · Safari",
    image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&q=85",
    layout: "card-tall"
  },
  {
    id: 3,
    title: "Zanzibar: Spice Islands, Stone Town & Waters That Glow Turquoise",
    teaser: "Ancient Arab trading routes, crumbling coral architecture, and beaches so white they hurt your eyes. Zanzibar is East Africa's most seductive secret.",
    readTime: "7 min read",
    tag: "Tanzania · Island",
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=900&q=85",
    layout: "card-normal"
  },
  {
    id: 4,
    title: "Above the Clouds: Summiting Africa's Rooftop at 5,895m",
    teaser: "You don't need to be an elite athlete. You need stubborn determination, a great guide, and the willingness to be humbled by something ancient.",
    readTime: "10 min read",
    tag: "Tanzania · Adventure",
    image: "https://images.unsplash.com/photo-1621414050347-e93f8e575f37?w=900&q=85",
    layout: "card-normal"
  },
  {
    id: 5,
    title: "Eye to Eye with Mountain Gorillas in Uganda's Ancient Forest",
    teaser: "You hear them before you see them — a slow rustle, a branch snap, and then a 400-pound silverback emerges three feet from your face. This moment changes people.",
    readTime: "9 min read",
    tag: "Uganda · Gorilla Trekking",
    image: "https://images.unsplash.com/photo-1594803294810-c860e5d29e07?w=900&q=85",
    layout: "card-wide"
  },
  {
    id: 6,
    title: "Africa's Inland Sea: Life, Fishermen & Forgotten Islands on Lake Victoria",
    teaser: "The world's largest tropical lake stretches across three countries. Cruise at dawn when the fishermen head out, and you'll see East Africa's heartbeat up close.",
    readTime: "5 min read",
    tag: "Kenya · Uganda · Tanzania",
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=900&q=85",
    layout: "card-normal"
  },
  {
    id: 7,
    title: "Diani Beach: Kenya's Crown Jewel of the Indian Ocean Coast",
    teaser: "Two hundred kilometres south of Mombasa, Diani's 17km of white sand and turquoise Indian Ocean water is as close to paradise as East Africa gets.",
    readTime: "5 min read",
    tag: "Kenya · Beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=85",
    layout: "card-normal"
  },
  {
    id: 8,
    title: "Elephants at the Foot of Kilimanjaro — Amboseli's Iconic Silhouette",
    teaser: "Giant tuskers moving slowly against the snow-capped backdrop of Kilimanjaro is the single most photographed scene in all of African safari. Go see why.",
    readTime: "6 min read",
    tag: "Kenya · Wildlife",
    image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=900&q=85",
    layout: "card-tall"
  },
  {
    id: 9,
    title: "The Pink Lake: One Million Flamingos Turn Lake Nakuru Fluorescent",
    teaser: "When the alkaline conditions are perfect, a million lesser flamingos descend on Lake Nakuru and turn the water shocking pink. Nothing prepares you for this sight.",
    readTime: "4 min read",
    tag: "Kenya · Birds",
    image: "https://images.unsplash.com/photo-1504601428907-6a2e5e37ce34?w=900&q=85",
    layout: "card-wide"
  },
  {
    id: 10,
    title: "Lamu: Kenya's 700-Year-Old Island Where Time Hasn't Arrived Yet",
    teaser: "No cars, no clocks, just narrow coral-stone alleys, hand-carved wooden doors, and a Swahili culture so intact it's a UNESCO World Heritage Site.",
    readTime: "7 min read",
    tag: "Kenya · Culture",
    image: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=900&q=85",
    layout: "card-last"
  }
];

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

  const featuredPost = BLOG_POSTS[0];
  const gridPosts = BLOG_POSTS.slice(1, -1);
  const lastPost = BLOG_POSTS[BLOG_POSTS.length - 1];

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
            <button className="px-4 py-2 hover:text-[#2C1A0E] transition-colors">ADVENTURE</button>
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-[1400px]">
          <motion.div 
            className="blog-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Featured Post (Hero) */}
            <motion.article 
              variants={fadeUpItem}
              className={`blog-card ${featuredPost.layout}`}
            >
              <img src={featuredPost.image} alt={featuredPost.title} loading="eager" />
              <div className="card-overlay" />
              
              <div className="absolute top-6 left-6">
                <span className="region-tag">{featuredPost.tag}</span>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <h2 className="text-3xl md:text-5xl font-['Playfair_Display',serif] font-bold mb-4 leading-tight max-w-4xl">
                  {featuredPost.title}
                </h2>
                <p className="text-white/80 text-lg mb-6 max-w-2xl leading-relaxed">
                  {featuredPost.teaser}
                </p>
                <div className="flex items-center gap-6 font-medium text-sm">
                  <span className="opacity-80">{featuredPost.readTime}</span>
                  <span className="text-[#D4A84B] hover:text-white transition-colors flex items-center gap-2">
                    Read the Full Story <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.article>

            {/* Asymmetric Grid (Posts 2-9) */}
            {gridPosts.map((post) => (
              <motion.article 
                key={post.id}
                variants={fadeUpItem}
                className={`blog-card ${post.layout}`}
              >
                <img src={post.image} alt={post.title} loading="lazy" />
                <div className="card-overlay" />
                
                <div className="absolute top-5 left-5">
                  <span className="region-tag">{post.tag}</span>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white z-10">
                  <h3 className={`font-['Playfair_Display',serif] font-bold mb-3 leading-snug ${
                    post.layout === 'card-wide' || post.layout === 'card-tall' ? 'text-2xl md:text-3xl max-w-xl' : 'text-xl md:text-2xl'
                  }`}>
                    {post.title}
                  </h3>
                  <p className="text-white/70 text-sm md:text-base mb-5 line-clamp-2 md:line-clamp-3">
                    {post.teaser}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="opacity-80 uppercase tracking-wide">{post.readTime}</span>
                    <span className="text-[#D4A84B] flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Story <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}

            {/* Horizontal Last Post */}
            <motion.article 
              variants={fadeUpItem}
              className={`blog-card ${lastPost.layout} md:flex-row !bg-white`}
            >
              <div className="w-full md:w-2/5 h-64 md:h-full relative overflow-hidden">
                <img src={lastPost.image} alt={lastPost.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-white z-10">
                <div className="mb-4">
                  <span className="region-tag !bg-[#F7F3EE] !text-[#6B5744]">{lastPost.tag}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-['Playfair_Display',serif] font-bold text-[#1A1208] mb-4 leading-tight">
                  {lastPost.title}
                </h3>
                <p className="text-[#6B5744] text-lg mb-8 leading-relaxed max-w-xl">
                  {lastPost.teaser}
                </p>
                <div className="flex items-center gap-6 text-sm font-semibold mt-auto">
                  <span className="text-[#6B5744] uppercase tracking-wide">{lastPost.readTime}</span>
                  <span className="text-[#C1440E] flex items-center gap-2 hover:gap-3 transition-all cursor-pointer">
                    Read the Full Story <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.article>
          </motion.div>
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
