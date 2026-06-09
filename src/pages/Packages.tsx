import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, ChevronDown, Check, X, MapPin, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/use-seo";
import { fetchPackages } from "@/lib/cmsApi";
import type { ApiPackage } from "@/lib/cmsApi";

type ItineraryDay = {
  day: string;
  title: string;
  activities: string[];
};

type DetailedPackage = {
  id: string;
  name: string;
  duration: string;
  focus: string;
  overview?: string;
  image: string;
  itinerary: ItineraryDay[];
  highlights?: string[];
  accommodations: { budget: string; midRange: string; luxury: string };
  inclusions?: string[];
  exclusions?: string[];
  addOns?: string[];
};

const PACKAGES: DetailedPackage[] = [
  {
    id: "coastal",
    name: "Coastal Kenya Package (Mombasa – Diani – Watamu)",
    duration: "6 Days / 5 Nights",
    focus: "Beaches, marine life, culture, relaxation + light adventure",
    overview: "A coastal escape combining white sand beaches, Swahili culture, coral reefs, and marine parks. This is not a heavy safari—it's a recovery + experience trip.",
    image: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1600&q=80",
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival – Mombasa",
        activities: ["Pickup from airport/train station", "Check-in at beach resort (Nyali or Diani)", "Evening: Old Town walk + Fort Jesus sunset view"]
      },
      {
        day: "Day 2",
        title: "Mombasa Culture Day",
        activities: ["Fort Jesus Museum tour", "Old Town spice markets", "Mama Ngina waterfront", "Sunset dhow cruise"]
      },
      {
        day: "Day 3",
        title: "Transfer to Diani Beach",
        activities: ["Drive via Likoni ferry", "Beach resort check-in", "Afternoon: relaxation + swimming"]
      },
      {
        day: "Day 4",
        title: "Diani Adventure Day",
        activities: ["Snorkeling / scuba diving", "Optional: Skydiving (Diani is East Africa’s top drop zone)", "Camel ride along the beach"]
      },
      {
        day: "Day 5",
        title: "Watamu / Marine Experience",
        activities: ["Visit Watamu Marine National Park", "Glass-bottom boat ride", "Dolphin spotting (seasonal)"]
      },
      {
        day: "Day 6",
        title: "Departure",
        activities: ["Leisure morning", "Transfer to airport"]
      }
    ],
    accommodations: {
      budget: "Hostels + 2–3 star hotels",
      midRange: "Beach resorts (recommended)",
      luxury: "Private villas & 5-star resorts"
    },
    inclusions: ["Transfers (optional package)", "Marine park fees (partial)", "Guided tours"],
    exclusions: ["Flights", "Alcohol, personal expenses", "Premium water sports"]
  },
  {
    id: "mara",
    name: "Masai Mara Safari Package",
    duration: "4 Days / 3 Nights",
    focus: "Big Five safari + Great Migration experience (seasonal)",
    image: "https://i.pinimg.com/736x/7c/36/c7/7c36c75a936387454868a452885be536.jpg",
    itinerary: [
      {
        day: "Day 1",
        title: "Nairobi – Maasai Mara",
        activities: ["Departure from Nairobi (morning)", "Stop at Great Rift Valley viewpoint", "Arrival + evening game drive"]
      },
      {
        day: "Day 2",
        title: "Full Game Drive",
        activities: ["Morning game drive (Big Cats focus)", "Picnic lunch inside the reserve", "Afternoon drive near Mara River (migration crossings if season)"]
      },
      {
        day: "Day 3",
        title: "Cultural Experience + Game Drive",
        activities: ["Visit Maasai village", "Learn Maasai culture, dances, and traditions", "Afternoon game drive"]
      },
      {
        day: "Day 4",
        title: "Return to Nairobi",
        activities: ["Early breakfast", "Short game drive exit route", "Return to Nairobi"]
      }
    ],
    highlights: ["Lions, elephants, leopards, buffalo, rhino (Big Five)", "Wildebeest migration (July–October)", "Hot air balloon safari (optional premium add-on)"],
    accommodations: {
      budget: "Tented camps",
      midRange: "Safari lodges",
      luxury: "Private conservancies"
    },
    addOns: ["Balloon safari (~$380–$500)", "Night photography drive (selected camps only)", "Professional wildlife photography guide"]
  },
  {
    id: "nakuru",
    name: "Lake Nakuru Safari Package",
    duration: "2 Days / 1 Night",
    focus: "Rhinos, flamingos, scenic Rift Valley ecosystem",
    image: "https://i.pinimg.com/736x/f7/4a/b1/f74ab14e065ee7d5e92abff620df7fd0.jpg",
    itinerary: [
      {
        day: "Day 1",
        title: "Nairobi – Lake Nakuru",
        activities: ["Morning departure", "Scenic stop at Rift Valley viewpoint", "Afternoon game drive focusing on White & black rhinos, Rothschild giraffes, Flamingos, Leopards & buffalo", "Evening: Check-in at lodge inside/near park"]
      },
      {
        day: "Day 2",
        title: "Morning Game Drive – Return",
        activities: ["Sunrise game drive (best wildlife activity time)", "Birdwatching (over 400 species recorded)", "Exit park and return to Nairobi"]
      }
    ],
    highlights: ["Rhino sanctuary core zone", "Lake scenery + bird migration patterns", "Compact but highly productive safari"],
    accommodations: {
      budget: "Guest lodges outside park",
      midRange: "Lake-view lodges",
      luxury: "Cliff-side lodges inside ecosystem"
    }
  },
  {
    id: "funnel",
    name: "The Ultimate Tourism Funnel: Beach to Bush",
    duration: "12 Days / 11 Nights",
    focus: "Beach recovery, Big Five wildlife, Conservation ecosystem, and Swahili culture",
    overview: "This creates a full tourism funnel: beach → wildlife → conservation ecosystem → culture. The ultimate journey merging the Coastal relaxation, the wild Maasai Mara, and the beautiful Lake Nakuru.",
    image: "https://i.pinimg.com/1200x/f3/51/6e/f3516e0e1da6e7d82e4cb6e07f9585d6.jpg",
    itinerary: [
      {
        day: "Phase 1",
        title: "Coastal Recovery (Days 1-6)",
        activities: ["Arrive in Mombasa, explore Fort Jesus & Old Town", "Relax on the pristine white sands of Diani Beach", "Marine excursions in Watamu"]
      },
      {
        day: "Phase 2",
        title: "The Great Migration (Days 7-10)",
        activities: ["Fly or drive to the legendary Maasai Mara", "Extensive Big Five game drives & Mara River crossings", "Maasai cultural immersion"]
      },
      {
        day: "Phase 3",
        title: "Conservation Ecosystem (Days 11-12)",
        activities: ["Travel to Lake Nakuru National Park", "Focus on Rhino conservation and Flamingo flocks", "Return to Nairobi for departure"]
      }
    ],
    accommodations: {
      budget: "Handpicked Hostels & Tented Camps",
      midRange: "Premium Beach Resorts & Safari Lodges",
      luxury: "Private Villas, Conservancies & Cliff-side Lodges"
    },
    inclusions: ["All domestic transfers between coast and parks", "All park entry and marine fees", "Guided tours and game drives"],
    exclusions: ["International flights", "Premium add-ons (Balloon safaris, Skydiving)"]
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const AccordionItem = ({ day, isOpen, onClick }: { day: ItineraryDay, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className="border border-[#E5DFD3] rounded-lg mb-3 overflow-hidden bg-white">
      <button 
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left bg-white hover:bg-[#F7F3EE] transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="font-['Space_Mono',monospace] text-[#C1440E] font-bold text-sm uppercase tracking-wider">{day.day}</span>
          <span className="font-['Playfair_Display',serif] font-bold text-[#1A1208] text-lg">{day.title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-[#6B5744] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 border-t border-[#E5DFD3]/50">
              <ul className="space-y-3 mt-4">
                {day.activities.map((act, i) => (
                  <li key={i} className="flex items-start gap-3 text-[#4A3D30]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4A84B] mt-2 shrink-0" />
                    <span className="leading-relaxed">{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Packages = () => {
  useSEO({
    title: "Safari Packages | WildWave Safaris",
    description: "Browse powerful, independent safari itineraries spanning Coastal Kenya, Maasai Mara, and Lake Nakuru.",
    path: "/packages",
  });

  const [displayPackages, setDisplayPackages] = useState<DetailedPackage[]>(PACKAGES);
  const [openAccordionIds, setOpenAccordionIds] = useState<Record<string, number>>({
    coastal: 0, mara: 0, nakuru: 0, funnel: 0
  });

  useEffect(() => {
    fetchPackages()
      .then((data: ApiPackage[]) => {
        if (!data || data.length === 0) return; // keep hardcoded fallback
        const mapped: DetailedPackage[] = data.map((pkg) => {
          // Parse itinerary JSON if available, else try text
          let itinerary: ItineraryDay[] = [];
          if (pkg.itinerary_json && Array.isArray(pkg.itinerary_json)) {
            itinerary = pkg.itinerary_json.map((d) => ({
              day: `Day ${d.day}`,
              title: d.title,
              activities: d.description ? [d.description] : [],
            }));
          } else if (pkg.itinerary) {
            // Fallback: split text itinerary by newline
            itinerary = pkg.itinerary.split(/\n+/).filter(Boolean).map((line, i) => ({
              day: `Day ${i + 1}`,
              title: line,
              activities: [],
            }));
          }

          const inclusions = pkg.inclusions || (pkg.includes ? pkg.includes.split(/[,\n]+/).map(s => s.trim()).filter(Boolean) : []);
          const exclusions = pkg.excludes ? pkg.excludes.split(/[,\n]+/).map(s => s.trim()).filter(Boolean) : [];
          const highlights = pkg.highlights || [];

          return {
            id: String(pkg.id),
            name: pkg.name,
            duration: pkg.duration || "Custom",
            focus: pkg.type || pkg.tag || "Tailored Safari Experience",
            overview: pkg.description || undefined,
            image: pkg.image_url || "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600&q=80",
            itinerary: itinerary.length > 0 ? itinerary : [{ day: "Day 1", title: "Your Adventure Begins", activities: ["Contact us for the full detailed itinerary"] }],
            highlights: highlights.length > 0 ? highlights : undefined,
            accommodations: {
              budget: (pkg.accommodations?.[0]) || "Tented camps & guesthouses",
              midRange: (pkg.accommodations?.[1]) || "Safari lodges",
              luxury: (pkg.accommodations?.[2]) || "Private conservancies",
            },
            inclusions: inclusions.length > 0 ? inclusions : undefined,
            exclusions: exclusions.length > 0 ? exclusions : undefined,
            addOns: pkg.addons && pkg.addons.length > 0 ? pkg.addons : undefined,
          };
        });
        setDisplayPackages(mapped);
      })
      .catch(() => {/* keep hardcoded fallback */});
  }, []);

  const toggleAccordion = (pkgId: string, index: number) => {
    setOpenAccordionIds(prev => ({
      ...prev,
      [pkgId]: prev[pkgId] === index ? -1 : index
    }));
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] pt-24 font-['DM_Sans',sans-serif]">
      {/* Header */}
      <section className="py-20 bg-[#1A1208] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600')] bg-cover bg-center" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <p className="text-[#D4A84B] font-['Space_Mono',monospace] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">Curated Itineraries</p>
          <h1 className="text-5xl md:text-7xl font-['Playfair_Display',serif] font-bold mb-6">
            Our <span className="italic text-[#D4A84B]">Packages</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg md:text-xl font-light">
            Powerful, independent journeys designed to immerse you in the wild heart and coastal beauty of East Africa.
          </p>
        </div>
      </section>

      {/* Packages List */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 space-y-24 md:space-y-32">
          {displayPackages.map((pkg, index) => (
            <motion.div 
              key={pkg.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className={`flex flex-col lg:flex-row gap-10 md:gap-16 items-start ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Image Side */}
              <div className="w-full lg:w-5/12 sticky top-32">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] md:aspect-square lg:aspect-[4/5] group">
                  <img 
                    src={pkg.image} 
                    alt={pkg.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-3 text-[#D4A84B] mb-3 font-['Space_Mono',monospace] text-xs font-bold tracking-widest uppercase">
                      <Calendar className="w-4 h-4" /> {pkg.duration}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-['Playfair_Display',serif] font-bold text-white leading-tight">
                      {pkg.name}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-7/12 flex flex-col justify-center">
                <div className="flex items-start gap-3 mb-6">
                  <Compass className="w-6 h-6 text-[#C1440E] shrink-0 mt-1" />
                  <p className="text-xl text-[#2C1A0E] font-['Playfair_Display',serif] italic font-semibold">{pkg.focus}</p>
                </div>
                
                {pkg.overview && (
                  <p className="text-[#4A3D30] text-lg mb-8 leading-relaxed">
                    {pkg.overview}
                  </p>
                )}

                {/* Day-by-Day Accordion */}
                <div className="mb-10">
                  <h3 className="text-2xl font-['Playfair_Display',serif] font-bold text-[#1A1208] mb-6">Itinerary Breakdown</h3>
                  <div>
                    {pkg.itinerary.map((day, i) => (
                      <AccordionItem 
                        key={i} 
                        day={day} 
                        isOpen={openAccordionIds[pkg.id] === i} 
                        onClick={() => toggleAccordion(pkg.id, i)} 
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  {/* Accommodations */}
                  <div className="bg-white p-6 rounded-xl border border-[#E5DFD3] shadow-sm">
                    <h4 className="text-sm font-['Space_Mono',monospace] font-bold uppercase tracking-widest text-[#6B5744] mb-4">Accommodations</h4>
                    <ul className="space-y-3">
                      <li className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider text-[#C1440E] font-bold">Budget</span>
                        <span className="text-[#1A1208] text-sm">{pkg.accommodations.budget}</span>
                      </li>
                      <li className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider text-[#C1440E] font-bold">Mid-Range</span>
                        <span className="text-[#1A1208] text-sm">{pkg.accommodations.midRange}</span>
                      </li>
                      <li className="flex flex-col">
                        <span className="text-xs uppercase tracking-wider text-[#C1440E] font-bold">Luxury</span>
                        <span className="text-[#1A1208] text-sm">{pkg.accommodations.luxury}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Highlights / Inclusions */}
                  <div className="bg-white p-6 rounded-xl border border-[#E5DFD3] shadow-sm">
                    {pkg.highlights ? (
                      <>
                        <h4 className="text-sm font-['Space_Mono',monospace] font-bold uppercase tracking-widest text-[#6B5744] mb-4">Highlights</h4>
                        <ul className="space-y-2">
                          {pkg.highlights.map((h, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[#1A1208]">
                              <Check className="w-4 h-4 text-[#3B6B4A] shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : pkg.inclusions ? (
                      <>
                        <h4 className="text-sm font-['Space_Mono',monospace] font-bold uppercase tracking-widest text-[#6B5744] mb-4">Included</h4>
                        <ul className="space-y-2">
                          {pkg.inclusions.map((inc, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[#1A1208]">
                              <Check className="w-4 h-4 text-[#3B6B4A] shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                    
                    {(pkg.addOns || pkg.exclusions) && (
                      <div className="mt-6 pt-4 border-t border-[#E5DFD3]">
                        <h4 className="text-xs font-['Space_Mono',monospace] font-bold uppercase tracking-widest text-[#6B5744] mb-3">
                          {pkg.addOns ? "Premium Add-Ons" : "Exclusions"}
                        </h4>
                        <ul className="space-y-2 text-sm text-[#6B5744]">
                          {(pkg.addOns || pkg.exclusions)?.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              {pkg.exclusions ? <X className="w-3.5 h-3.5 text-[#C1440E] shrink-0 mt-0.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-[#D4A84B] mt-1.5 shrink-0" />}
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <Link to="/contact">
                  <Button className="w-full md:w-auto bg-[#1A1208] text-white hover:bg-[#C1440E] px-8 py-6 rounded text-sm uppercase tracking-widest font-['Space_Mono',monospace] transition-colors gap-3">
                    Inquire About This Package <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Packages;
