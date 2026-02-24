import { motion } from "framer-motion";
import { Heart, Globe, Leaf, Users } from "lucide-react";
import heroImage from "@/assets/hero-safari.jpg";
import gorillaImg from "@/assets/gorilla-trekking.jpg";
import { useSEO } from "@/hooks/use-seo";

const team = [
  { name: "Daniel Kipchoge", role: "Founder & Lead Guide", bio: "Born in the Mara, Daniel has 20+ years guiding safaris across East Africa." },
  { name: "Amara Nakamura", role: "Operations Director", bio: "Amara ensures every trip runs seamlessly, from logistics to luxury." },
  { name: "Joseph Mutebi", role: "Head of Conservation", bio: "Former park ranger leading our sustainability and community programs." },
  { name: "Grace Wanjiku", role: "Client Experience Manager", bio: "Grace personally crafts every itinerary to match your travel style." },
];

const values = [
  { icon: Heart, title: "Passion for Wildlife", desc: "We're driven by a deep love for East Africa's incredible wildlife and landscapes." },
  { icon: Globe, title: "Community First", desc: "We invest in local communities, ensuring tourism creates lasting positive impact." },
  { icon: Leaf, title: "Eco-Conscious Travel", desc: "Low-impact lodges, carbon offsets, and wildlife conservation funding in every trip." },
  { icon: Users, title: "Personalized Service", desc: "Small group sizes and bespoke itineraries for truly intimate experiences." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const About = () => {
  useSEO({
    title: "About WildWave Safaris | Our Story & Mission",
    description:
      "Learn how WildWave Safaris was built to deliver unforgettable East Africa adventures while supporting conservation and local communities.",
    path: "/about",
    keywords: ["about wildwave safaris", "safari company", "sustainable travel"],
  });

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Safari landscape" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-safari-charcoal/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <p className="text-safari-gold font-medium tracking-[0.2em] uppercase text-sm mb-3">Our Story</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-safari-cream mb-6">
            Born from <span className="italic text-safari-gold">the Wild</span>
          </h1>
          <p className="text-safari-sand/90 max-w-2xl mx-auto text-lg leading-relaxed">
            Founded in 2010 by wildlife enthusiasts who grew up on the savannas of East Africa, 
            WildWave Safaris was born from a desire to share the magic of the wild with the world — responsibly and authentically.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.p variants={fadeUp} custom={0} className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Our Mission</motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                Conservation Through <span className="italic text-primary">Connection</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground leading-relaxed mb-4">
                We believe that when people experience the raw beauty of Africa firsthand, they become its greatest advocates. 
                Every safari we lead is designed to create deep connections with nature while actively supporting the ecosystems and communities that make it all possible.
              </motion.p>
              <motion.p variants={fadeUp} custom={3} className="text-muted-foreground leading-relaxed">
                10% of every booking goes directly to conservation and community development projects across Kenya, Tanzania, Uganda, and Rwanda.
              </motion.p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-xl overflow-hidden"
            >
              <img src={gorillaImg} alt="Gorilla in the wild" className="w-full h-[400px] object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Our Values</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-card rounded-xl p-6 text-center border border-border"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Our Team</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Meet the <span className="italic text-primary">Experts</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg">{member.name}</h3>
                <p className="text-primary text-sm mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
