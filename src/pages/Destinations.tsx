import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Filter, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "@/lib/api";
import { toImageSrc, withImageFallback } from "@/lib/images";
import { useSEO } from "@/hooks/use-seo";

type DestinationResponse = {
  id: number;
  name: string;
  country?: string | null;
  category?: string | null;
  tags?: string | null;
  image_url?: string | null;
  description?: string | null;
  best_months?: string | null;
};

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

const HARDCODED_DESTINATIONS: DestinationCard[] = [
  // KENYA
  {
    id: 1,
    name: "Maasai Mara National Reserve",
    country: "Kenya",
    region: "Kenya",
    category: ["Luxury", "Photo Safaris", "Family Safaris"],
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
    desc: "Iconic for the Great Wildebeest Migration and Big Five safaris across vast, open plains.",
    bestMonths: "July–October"
  },
  {
    id: 2,
    name: "Amboseli National Park",
    country: "Kenya",
    region: "Kenya",
    category: ["Photo Safaris", "Family Safaris"],
    image: "https://i.pinimg.com/736x/83/92/b9/8392b9d2e1ea92477d406a0575ad9f07.jpg",
    desc: "Famous for massive elephant herds wandering with the dramatic backdrop of Mount Kilimanjaro.",
    bestMonths: "June–October"
  },
  {
    id: 3,
    name: "Tsavo National Parks",
    country: "Kenya",
    region: "Kenya",
    category: ["Budget", "Family Safaris"],
    image: "https://i.pinimg.com/736x/63/cb/b1/63cbb1797844c13a7a7328bc85e78319.jpg",
    desc: "Kenya's largest park, known for its distinct red elephants, ancient lava flows, and diverse landscapes.",
    bestMonths: "June–October"
  },
  {
    id: 4,
    name: "Samburu National Reserve",
    country: "Kenya",
    region: "Kenya",
    category: ["Luxury", "Photo Safaris"],
    image: "https://i.pinimg.com/736x/7e/79/de/7e79deb6810782c118dae6d768c81744.jpg",
    desc: "An arid, rugged sanctuary home to rare species like Grevy's zebra and the reticulated giraffe.",
    bestMonths: "June–September"
  },
  {
    id: 5,
    name: "Lake Nakuru National Park",
    country: "Kenya",
    region: "Kenya",
    category: ["Photo Safaris", "Budget"],
    image: "https://i.pinimg.com/736x/f7/4a/b1/f74ab14e065ee7d5e92abff620df7fd0.jpg",
    desc: "A breathtaking flamingo paradise and highly successful rhinoceros sanctuary in the Great Rift Valley.",
    bestMonths: "Year-round"
  },
  {
    id: 6,
    name: "Aberdare National Park",
    country: "Kenya",
    region: "Kenya",
    category: ["Luxury", "Family Safaris"],
    image: "https://i.pinimg.com/736x/be/39/6c/be396c7c01e9de5a9035311833c362b8.jpg",
    desc: "Lush, mountainous forests featuring cascading waterfalls and unique tree-hotel lodges for wildlife viewing.",
    bestMonths: "June–September"
  },

  // TANZANIA
  {
    id: 7,
    name: "Serengeti National Park",
    country: "Tanzania",
    region: "Tanzania",
    category: ["Luxury", "Photo Safaris"],
    image: "https://i.pinimg.com/736x/09/82/4b/09824b60ea14e9e5d5309b065b994bad.jpg",
    desc: "World-famous for the Great Migration and seemingly endless, wildlife-rich savannahs.",
    bestMonths: "June–October"
  },
  {
    id: 8,
    name: "Ngorongoro Crater",
    country: "Tanzania",
    region: "Tanzania",
    category: ["Luxury", "Family Safaris"],
    image: "https://i.pinimg.com/736x/1a/11/b2/1a11b26d1e6bad68aa1e29b6fe58004e.jpg",
    desc: "A UNESCO-listed volcanic caldera boasting the highest density of wildlife in all of Africa.",
    bestMonths: "Year-round"
  },
  {
    id: 9,
    name: "Kilimanjaro National Park",
    country: "Tanzania",
    region: "Tanzania",
    category: ["Budget", "Family Safaris"],
    image: "https://i.pinimg.com/736x/16/47/e6/1647e614f383056cdc4a411706a4adc9.jpg",
    desc: "Home to Africa's highest peak (5,895m), offering spectacular trekking and eco-tourism adventures.",
    bestMonths: "June–October"
  },
  {
    id: 10,
    name: "Tarangire National Park",
    country: "Tanzania",
    region: "Tanzania",
    category: ["Photo Safaris", "Budget"],
    image: "https://i.pinimg.com/736x/f9/b1/70/f9b1709e702b254ce5861e034f24dd82.jpg",
    desc: "Famed for its surreal landscape dotted with ancient baobab trees and massive elephant herds.",
    bestMonths: "July–October"
  },
  {
    id: 11,
    name: "Selous Game Reserve",
    country: "Tanzania",
    region: "Tanzania",
    category: ["Luxury", "Photo Safaris"],
    image: "https://i.pinimg.com/736x/30/e6/f8/30e6f8b08b6a587287a34b88e0d19e90.jpg",
    desc: "One of Africa's largest protected areas, offering untamed wilderness and incredible boat safaris.",
    bestMonths: "June–October"
  },
  {
    id: 12,
    name: "Zanzibar Archipelago",
    country: "Tanzania",
    region: "Tanzania",
    category: ["Luxury", "Family Safaris"],
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80",
    desc: "A tropical haven of pristine white beaches, aromatic spice tours, and the historic charm of Stone Town.",
    bestMonths: "June–October"
  },

  // UGANDA
  {
    id: 13,
    name: "Bwindi Impenetrable Forest",
    country: "Uganda",
    region: "Uganda",
    category: ["Luxury", "Photo Safaris"],
    image: "https://i.pinimg.com/736x/d9/fb/0a/d9fb0a03afdc6276c1a2e4af736fc9e9.jpg",
    desc: "A mystical, dense rainforest offering the ultimate gorilla trekking experience (half the world's mountain gorillas).",
    bestMonths: "June–August"
  },
  {
    id: 14,
    name: "Queen Elizabeth National Park",
    country: "Uganda",
    region: "Uganda",
    category: ["Family Safaris", "Budget"],
    image: "https://i.pinimg.com/736x/dc/1f/0d/dc1f0d156668bb85ac7c670d77e0b1fd.jpg",
    desc: "Famed for chimpanzee tracking, rare tree-climbing lions, and wildlife boat cruises along the Kazinga Channel.",
    bestMonths: "June–September"
  },
  {
    id: 15,
    name: "Murchison Falls National Park",
    country: "Uganda",
    region: "Uganda",
    category: ["Photo Safaris", "Budget"],
    image: "https://i.pinimg.com/736x/e5/bf/af/e5bfaf21dff54ba754e8fd495da0b6e4.jpg",
    desc: "Home to the world's most powerful waterfalls and spectacular Nile River boat safaris.",
    bestMonths: "December–February"
  },

  // RWANDA
  {
    id: 16,
    name: "Volcanoes National Park",
    country: "Rwanda",
    region: "Rwanda",
    category: ["Luxury", "Photo Safaris"],
    image: "https://i.pinimg.com/736x/d6/3b/6f/d63b6f9b1d41085544c59588f6970fbc.jpg",
    desc: "Famous for Dian Fossey's work, offering unparalleled mountain gorilla trekking and rare golden monkeys.",
    bestMonths: "June–September"
  }
];

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
  const [allDestinations, setAllDestinations] = useState<DestinationCard[]>(HARDCODED_DESTINATIONS);
  const [loading, setLoading] = useState(false);

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
