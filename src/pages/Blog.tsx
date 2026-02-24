import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
import { toImageSrc, withImageFallback } from "@/lib/images";
import { useSEO } from "@/hooks/use-seo";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const Blog = () => {
  useSEO({
    title: "Safari Blog & Travel Guides | WildWave Safaris",
    description:
      "Read WildWave Safaris travel guides, safari tips, and destination stories to plan a better East Africa adventure.",
    path: "/blog",
    keywords: ["safari blog", "east africa travel guide", "safari tips"],
  });

  const [posts, setPosts] = useState<any[]>([]);
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
    return <div className="min-h-screen pt-24 flex items-center justify-center">Loading...</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  return (
    <div className="min-h-screen pt-24">
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Blog & Guides</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
            Stories from the <span className="italic text-primary">Trail</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Travel guides, packing tips, and tales from the wild to inspire your next adventure.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">No blog posts available yet.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all"
                >
                  <div className="w-full h-80 overflow-hidden">
                    <img
                      src={toImageSrc(post.image_url)}
                      alt={post.title}
                      onError={withImageFallback}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block bg-muted text-foreground text-xs px-3 py-1 rounded-full mb-3">
                      {post.category}
                    </span>
                    <h3 className="text-2xl font-display font-bold mb-3">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(post.created_at)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.read_time}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
