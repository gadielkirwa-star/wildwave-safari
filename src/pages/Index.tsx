import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Users, MapPin, Calendar, Compass, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

import heroImage from "@/assets/hero-safari.jpg";
import serengetiImg from "@/assets/serengeti.jpg";
import gorillaImg from "@/assets/gorilla-trekking.jpg";
import balloonImg from "@/assets/balloon-safari.jpg";
import zanzibarImg from "@/assets/zanzibar-beach.jpg";
import masaiMaraImg from "@/assets/masai-mara.jpg";
import ngorongoroImg from "@/assets/ngorongoro.jpg";

// Fallback images in case API returns no data
const fallbackDestinations = [
  { name: "Masai Mara", country: "Kenya", image: masaiMaraImg, desc: "Witness the Great Migration" },
  { name: "Serengeti", country: "Tanzania", image: serengetiImg, desc: "Endless plains of wildlife" },
  { name: "Ngorongoro", country: "Tanzania", image: ngorongoroImg, desc: "The world's largest caldera" },
  { name: "Bwindi Forest", country: "Uganda", image: gorillaImg, desc: "Mountain gorilla encounters" },
  { name: "Zanzibar", country: "Tanzania", image: zanzibarImg, desc: "Tropical paradise beaches" },
  { name: "Balloon Safari", country: "Kenya", image: balloonImg, desc: "Sunrise over the savanna" },
];

const fallbackPackages = [
  { name: "Classic Game Drive", duration: "7 Days", price: "From $2,800", tag: "Most Popular", image: masaiMaraImg, desc: "The quintessential East African safari through Kenya's iconic parks." },
  { name: "Gorilla Trekking", duration: "5 Days", price: "From $4,200", tag: "Exclusive", image: gorillaImg, desc: "Trek through misty forests to meet mountain gorillas face-to-face." },
  { name: "Balloon Safari", duration: "10 Days", price: "From $5,500", tag: "Premium", image: balloonImg, desc: "Float above the Serengeti at sunrise for a once-in-a-lifetime experience." },
  { name: "Beach & Bush", duration: "12 Days", price: "From $3,600", tag: "Best Value", image: zanzibarImg, desc: "Combine thrilling game drives with Zanzibar's pristine beaches." },
];

const testimonials = [
  { name: "Sarah & James", location: "London, UK", text: "WildWave Safaris gave us the trip of a lifetime. Seeing the wildebeest migration up close was absolutely magical. Our guide was incredibly knowledgeable.", rating: 5 },
  { name: "Dr. Amara Osei", location: "Accra, Ghana", text: "The gorilla trekking experience was beyond words. The team handled every detail perfectly — from permits to lodge bookings. Truly world-class service.", rating: 5 },
  { name: "Marco & Lucia", location: "Milan, Italy", text: "We've traveled extensively, but nothing compares to our Serengeti balloon safari. WildWave Safaris made it seamless and unforgettable.", rating: 5 },
];

const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "5,000+", label: "Happy Travelers" },
  { value: "50+", label: "Safari Routes" },
  { value: "4.9★", label: "Average Rating" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const heroImages = [
  heroImage,
  'https://i.pinimg.com/736x/d0/0f/35/d00f350b62c7de4f504fd8364b425e13.jpg',
  'https://i.pinimg.com/736x/9e/fc/8e/9efc8e8b2c42b805c4e84d4d1ea3bf7f.jpg',
  'https://i.pinimg.com/736x/4e/f9/14/4ef914daf2c5e4f103887c8bf6bb0220.jpg'
];

const Index = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [destinations, setDestinations] = useState<any[]>(fallbackDestinations);
  const [packages, setPackages] = useState<any[]>(fallbackPackages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchDestinationsAndPackages();
  }, []);

  const fetchDestinationsAndPackages = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://wildwave-safaris-api.onrender.com/api';
      // Fetch destinations from API
      const destResponse = await fetch(`${apiUrl}/public/destinations`);
      if (destResponse.ok) {
        const destData = await destResponse.json();
        if (Array.isArray(destData) && destData.length > 0) {
          // Transform API destinations to match display format
          const apiDestinations = destData.slice(0, 6).map((dest: any) => ({
            id: dest.id,
            name: dest.name,
            country: dest.country || dest.category,
            image: dest.image_url,
            desc: dest.description,
          }));
          setDestinations(apiDestinations);
        }
      }
    } catch (error) {
      console.error('Failed to fetch destinations:', error);
    }

    try {
      // Fetch packages from API
      const pkgResponse = await fetch(`${apiUrl}/public/packages`);
      if (pkgResponse.ok) {
        const pkgData = await pkgResponse.json();
        if (Array.isArray(pkgData) && pkgData.length > 0) {
          // Transform API packages to match display format
          const apiPackages = pkgData.slice(0, 4).map((pkg: any) => ({
            id: pkg.id,
            name: pkg.name,
            duration: pkg.duration,
            price: `From $${pkg.price}`,
            tag: pkg.tag,
            image: pkg.image_url,
            desc: pkg.description,
          }));
          setPackages(apiPackages);
        }
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {heroImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt="Safari scene"
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[1500ms] ease-in-out ${
                index === currentImage 
                  ? 'opacity-100 scale-100' 
                  : index === (currentImage - 1 + heroImages.length) % heroImages.length
                  ? 'opacity-0 scale-110'
                  : 'opacity-0 scale-95'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-safari-charcoal/60 via-safari-charcoal/30 to-safari-charcoal/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-safari-gold font-medium tracking-[0.3em] uppercase text-sm mb-6"
          >
            East Africa's Premier Safari Company
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-safari-cream leading-tight mb-6 max-w-4xl mx-auto"
          >
            Where the Wild
            <br />
            <span className="text-safari-gold italic">Comes Alive</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-safari-sand/90 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Handcrafted safari experiences across Kenya, Tanzania, Uganda & Rwanda.
            Expert guides. Sustainable travel. Memories that last forever.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-row gap-4 justify-center"
          >
            <Link to="/destinations">
              <Button size="lg" className="text-base px-8 py-6 gap-2">
                Explore Safaris <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="default" className="text-base px-8 py-6">
                Plan Your Trip
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-safari-cream/40 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-safari-cream/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-display font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Why Choose Us</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Safari, <span className="italic text-primary">Reimagined</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We don't just show you Africa — we immerse you in it. Every journey is crafted with care, expertise, and a deep respect for nature.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Compass, title: "Expert Local Guides", desc: "Born and raised in East Africa, our guides bring decades of wildlife knowledge and cultural insight." },
              { icon: Shield, title: "Sustainable Travel", desc: "We partner with conservation projects and community initiatives to ensure tourism benefits everyone." },
              { icon: Users, title: "Tailored Experiences", desc: "No cookie-cutter trips. Every safari is designed around your interests, pace, and budget." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-card rounded-xl p-8 text-center hover:shadow-lg transition-shadow border border-border"
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <motion.p variants={fadeUp} custom={0} className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Destinations</motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-display font-bold text-foreground">
                Iconic <span className="italic text-primary">Wild Places</span>
              </motion.h2>
            </div>
            <motion.div variants={fadeUp} custom={2}>
              <Link to="/destinations" className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all mt-4 md:mt-0">
                View All Destinations <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.id || dest.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <Link to="/destinations" className="group block relative rounded-xl overflow-hidden aspect-[4/3]">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-safari-charcoal/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 text-safari-gold text-sm mb-1">
                      <MapPin className="w-3 h-3" />
                      {dest.country}
                    </div>
                    <h3 className="text-xl font-display font-bold text-safari-cream">{dest.name}</h3>
                    <p className="text-safari-sand/80 text-sm mt-1">{dest.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safari Packages */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Safari Packages</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
              Curated <span className="italic text-primary">Adventures</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From classic game drives to exclusive gorilla treks, find the perfect safari for your dream African journey.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.id || pkg.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {pkg.tag}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-display font-bold">{pkg.name}</h3>
                    <span className="text-primary font-bold">{pkg.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{pkg.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {pkg.duration}
                    </span>
                    <Link to="/contact">
                      <Button size="sm" variant="outline" className="gap-1">
                        Inquire <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/packages">
              <Button size="lg" variant="outline" className="gap-2">
                View All Packages <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-safari-charcoal">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-safari-gold font-medium tracking-[0.2em] uppercase text-sm mb-3">Testimonials</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-display font-bold text-safari-cream mb-4">
              Stories from the <span className="italic text-safari-gold">Wild</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-safari-warm-brown/50 rounded-xl p-8 border border-safari-warm-brown"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-safari-gold text-safari-gold" />
                  ))}
                </div>
                <p className="text-safari-sand/90 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="font-display font-semibold text-safari-cream">{t.name}</p>
                  <p className="text-sm text-safari-sand/60">{t.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={balloonImg} alt="Balloon safari" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-safari-charcoal/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-display font-bold text-safari-cream mb-6">
              Ready for Your African <span className="italic text-safari-gold">Adventure?</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-safari-sand/90 text-lg max-w-xl mx-auto mb-8">
              Let us craft your perfect safari. Tell us your dream, and we'll make it happen.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="text-base px-8 py-6 gap-2">
                  Start Planning <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="https://wa.me/254713241666" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="text-base px-8 py-6 border-safari-cream text-safari-cream bg-transparent hover:bg-safari-cream hover:text-safari-charcoal">
                  WhatsApp Us
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
