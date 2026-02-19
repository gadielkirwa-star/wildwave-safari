import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Filter, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const regions = ["All", "Kenya", "Tanzania", "Uganda", "Rwanda"];
const categories = ["All", "Luxury", "Budget", "Photo Safaris", "Family Safaris"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Destinations = () => {
  const [activeRegion, setActiveRegion] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [allDestinations, setAllDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://wildwave-safaris-api.onrender.com/api';
      const response = await fetch(`${apiUrl}/public/destinations`);
      const data = await response.json();
      
      // Transform API data to match frontend format
      const transformed = data.map((dest: any) => ({
        id: dest.id,
        name: dest.name,
        country: dest.country || dest.category,
        region: dest.category,
        category: dest.tags ? dest.tags.split(',').map((t: string) => t.trim()) : ['Luxury'],
        image: dest.image_url,
        desc: dest.description,
        bestMonths: dest.best_months || 'Year-round'
      }));
      
      setAllDestinations(transformed);
    } catch (error) {
      console.error('Failed to fetch destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = allDestinations.filter((d) => {
    const regionMatch = activeRegion === "All" || d.region === activeRegion;
    const catMatch = activeCategory === "All" || d.category.includes(activeCategory);
    return regionMatch && catMatch;
  });

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Explore East Africa</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
            Our <span className="italic text-primary">Destinations</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            From vast savannas to misty mountains and turquoise coastlines — discover the diversity of East Africa.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border bg-background sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filter:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-foreground mr-2">Region:</span>
              {regions.map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRegion(r)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    activeRegion === r
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-primary/10"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-foreground mr-2">Type:</span>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    activeCategory === c
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent/10"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-muted-foreground py-12">Loading destinations...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No destinations match your filters. Try adjusting.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((dest, i) => (
                <motion.div
                  key={dest.id || dest.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="group relative rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all h-80"
                >
                  <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-safari-charcoal/90 via-safari-charcoal/40 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    {dest.category.map((cat) => (
                      <span key={cat} className="bg-safari-charcoal/70 text-safari-cream text-xs px-2 py-1 rounded-full backdrop-blur-sm">{cat}</span>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <div className="flex items-center gap-2 text-safari-gold text-sm mb-2">
                      <MapPin className="w-3 h-3" />
                      {dest.country}
                    </div>
                    <h3 className="text-xl font-display font-bold text-safari-cream mb-2">{dest.name}</h3>
                    <p className="text-safari-sand/90 text-sm mb-3">{dest.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-safari-sand/70">Best: {dest.bestMonths}</span>
                      <Link to="/contact" className="text-safari-gold text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                        Details <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Destinations;
