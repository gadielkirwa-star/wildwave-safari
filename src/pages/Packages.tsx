import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
import { toImageSrc, withImageFallback } from "@/lib/images";
import { useSEO } from "@/hooks/use-seo";

const types = ["All", "Classic", "Gorilla Trekking", "Balloon Safaris", "Beach Add-Ons"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const Packages = () => {
  useSEO({
    title: "Safari Packages | WildWave Safaris",
    description:
      "Browse customizable safari packages from classic game drives to gorilla trekking and beach extensions across East Africa.",
    path: "/packages",
    keywords: ["safari packages", "gorilla trekking packages", "custom safari itinerary"],
  });

  const [activeType, setActiveType] = useState("All");
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/packages`);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text.slice(0, 50)}`);
      }
      const data = await response.json();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setPackages(data);
      } else {
        console.error('Unexpected response format:', data);
        setPackages([]);
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = activeType === "All" ? packages : packages.filter((p) => p.type === activeType);

  return (
    <div className="min-h-screen pt-24">
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Safari Packages</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
            Choose Your <span className="italic text-primary">Adventure</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Every package is fully customizable. Pick your starting point, and we'll tailor it to you.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-6 border-b border-border bg-background sticky top-16 z-30">
        <div className="container mx-auto px-4 flex flex-wrap gap-2 justify-center">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeType === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading packages...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground">No packages available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filtered.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={toImageSrc(pkg.image_url)}
                  alt={pkg.name}
                  onError={withImageFallback}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {pkg.tag}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                  <h3 className="text-xl font-display font-bold">{pkg.name}</h3>
                  <span className="text-xl font-display font-bold text-primary">${pkg.price}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{pkg.duration}</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded">{pkg.type}</span>
                </div>
                <p className="text-muted-foreground mb-6">{pkg.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="font-semibold text-foreground mb-2">Includes:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      {pkg.includes?.split('|').map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-2">Excludes:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      {pkg.excludes?.split('|').map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {pkg.itinerary && (
                  <div className="mb-6">
                    <p className="font-semibold text-foreground mb-2">Itinerary:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {pkg.itinerary.split('|').map((day, idx) => (
                        <li key={idx}>{day}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-auto">
                  <Link to="/contact">
                    <Button className="gap-2">Inquire Now <ArrowRight className="w-4 h-4" /></Button>
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

export default Packages;
