import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Filter, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { withImageFallback } from "@/lib/images";
import { useSEO } from "@/hooks/use-seo";
import { fetchDestinations } from "@/lib/cmsApi";

type DestinationCard = {
  id: number;
  name: string;
  country: string;
  region: string;
  category: string[];
  image: string;
  desc: string;
  bestMonths: string;
};

const regions = ["All", "Kenya", "Tanzania", "Uganda", "Rwanda"];
const categories = ["All", "Luxury", "Budget", "Photo Safaris", "Family Safaris"];
const countryOrder = ["Kenya", "Tanzania", "Uganda", "Rwanda"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Destinations = () => {
  useSEO({
    title: "Safari Destinations in East Africa | WildWave Safaris",
    description:
      "Explore iconic safari destinations across Kenya, Tanzania, Uganda, and Rwanda with expert planning from WildWave Safaris.",
    path: "/destinations",
    keywords: ["Masai Mara", "Serengeti", "Ngorongoro", "Bwindi", "East Africa destinations"],
  });

  const [activeRegion, setActiveRegion] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [allDestinations, setAllDestinations] = useState<DestinationCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations()
      .then((data) => {
        const mapped: DestinationCard[] = data.map((d) => ({
          id: d.id,
          name: d.name,
          country: d.country || d.category || "East Africa",
          region: d.country || d.category || "East Africa",
          category: d.tags
            ? d.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
          image: d.image_url || "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
          desc: d.description || "",
          bestMonths: d.best_months || "Year-round",
        }));
        setAllDestinations(mapped);
      })
      .catch(() => {
        // Silently fail — page stays empty with the "no destinations" message
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = allDestinations
    .filter((d) => {
      const regionMatch = activeRegion === "All" || d.region === activeRegion;
      const catMatch = activeCategory === "All" || d.category.includes(activeCategory);
      return regionMatch && catMatch;
    })
    .sort((a, b) => {
      const aIdx = countryOrder.indexOf(a.country);
      const bIdx = countryOrder.indexOf(b.country);
      const aRank = aIdx === -1 ? Number.MAX_SAFE_INTEGER : aIdx;
      const bRank = bIdx === -1 ? Number.MAX_SAFE_INTEGER : bIdx;
      if (aRank !== bRank) return aRank - bRank;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <section className="relative py-24 md:py-32 flex items-center justify-center min-h-[40vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=1600&q=80" 
            alt="Fierce Wild Lion" 
            className="w-full h-full object-cover object-center"
          />
          {/* Elegant Dark Overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <p className="text-[#D4A84B] font-medium tracking-[0.2em] uppercase text-xs md:text-sm mb-4 font-['Space_Mono',monospace]">
              Explore East Africa
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-[1.1]">
              Our <span className="italic text-[#D4A84B]">Destinations</span>
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
              From vast savannas to misty mountains and turquoise coastlines — discover the diversity of East Africa.
            </p>
          </motion.div>
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
                  <img
                    src={dest.image}
                    alt={dest.name}
                    onError={withImageFallback}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
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
