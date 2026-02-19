import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://wildwave-safaris-api.onrender.com/api';
        const response = await fetch(`${apiUrl}/public/blogs`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched blogs:', data.length);
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
            <>
              {/* Featured Post */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all h-96 mb-12"
              >
                <img src={posts[0].image_url} alt={posts[0].title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-safari-charcoal/90 via-safari-charcoal/40 to-transparent" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-safari-charcoal/70 text-safari-cream text-sm px-3 py-1 rounded-full backdrop-blur-sm">{posts[0].category}</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-safari-cream mb-3">{posts[0].title}</h2>
                  <p className="text-safari-sand/90 mb-4">{posts[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-safari-sand/70">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(posts[0].created_at)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{posts[0].read_time}</span>
                  </div>
                </div>
              </motion.div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.slice(1).map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i}
                    className="group relative rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all h-80"
                  >
                    <img src={post.image_url} alt={post.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-safari-charcoal/90 via-safari-charcoal/40 to-transparent" />
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-safari-charcoal/70 text-safari-cream text-xs px-2 py-1 rounded-full backdrop-blur-sm">{post.category}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <h3 className="text-lg font-display font-bold text-safari-cream mb-2">{post.title}</h3>
                      <p className="text-safari-sand/90 text-sm mb-3">{post.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-safari-sand/70">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.created_at)}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.read_time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
