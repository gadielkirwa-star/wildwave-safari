import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Globe, Leaf, Users } from "lucide-react";
import heroImage from "@/assets/hero-safari.jpg";
import gorillaImg from "@/assets/gorilla-trekking.jpg";
import { useSEO } from "@/hooks/use-seo";
import { API_BASE_URL } from "@/lib/api";
import { toImageSrc, withImageFallback } from "@/lib/images";

const values = [
  { icon: Heart, title: "Passion for Wildlife", desc: "We're driven by a deep love for East Africa's incredible wildlife and landscapes." },
  { icon: Globe, title: "Community First", desc: "We invest in local communities, ensuring tourism creates lasting positive impact." },
  { icon: Leaf, title: "Eco-Conscious Travel", desc: "Low-impact lodges, carbon offsets, and wildlife conservation funding in every trip." },
  { icon: Users, title: "Personalized Service", desc: "Small group sizes and bespoke itineraries for truly intimate experiences." },
];

const WINNY_IMAGE_URL =
  "https://www.dropbox.com/scl/fi/akrr9k0y2emttcg8l4czv/cheptanui.jpeg?rlkey=9xyqhllb49d9qun02afqi0yy7&st=s0125bmd&dl=0";
const WINNY_DIRECTOR_BIO =
  "As Director at WildWave Safaris, Winny leads the company with a strong vision for exceptional safari experiences across East Africa. Drawing from years of field expertise in Maasai Mara, Amboseli, and Tsavo, she guides strategic planning, service quality, and guest experience standards to ensure every journey is seamless, meaningful, and memorable. Her leadership blends deep wildlife knowledge, operational excellence, and a commitment to conservation and community impact.";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image_url?: string | null;
};

const defaultTeamMembers: TeamMember[] = [
  {
    name: "Winny Bitok",
    role: "Director",
    bio: WINNY_DIRECTOR_BIO,
    image_url: WINNY_IMAGE_URL,
  },
  {
    name: "Andre Silva",
    role: "Logistics Coordinator",
    bio: "Andre oversees the day-to-day coordination of WildWave safari operations, ensuring every journey runs smoothly from arrival to departure. From vehicle scheduling and lodge confirmations to route planning and on-ground support, he manages the details that make each safari seamless. His organized approach and problem-solving mindset help deliver safe, efficient, and stress-free travel experiences for every guest.",
  },
  {
    name: "Eliud Rotich",
    role: "Travel Consultant",
    bio: "Eliud works closely with clients to design personalized safari experiences across Kenya and East Africa. From selecting the perfect lodges to planning seamless travel logistics, he ensures every itinerary matches the traveler's budget, preferences, and expectations. His attention to detail and commitment to client satisfaction make every WildWave journey smooth, memorable, and stress-free.",
  },
];

const About = () => {
  const [aboutSection, setAboutSection] = useState<"story" | "team">("story");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(defaultTeamMembers);

  useSEO({
    title: "About WildWave Safaris | Our Story & Mission",
    description:
      "Learn how WildWave Safaris was built to deliver unforgettable East Africa adventures while supporting conservation and local communities.",
    path: "/about",
    keywords: ["about wildwave safaris", "safari company", "sustainable travel"],
  });

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/public/team-members`);
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          return;
        }

        const normalized = data
          .filter((member) => member?.name)
          .map((member) => {
            const name = String(member.name);
            const isWinny = name.trim().toLowerCase() === "winny bitok";
            return {
              name,
              role: String(member.role || (isWinny ? "Director" : "Team Member")),
              bio: String(member.bio || (isWinny ? WINNY_DIRECTOR_BIO : "")),
              image_url: member.image_url || (isWinny ? WINNY_IMAGE_URL : null),
            };
          });

        if (normalized.length > 0) {
          setTeamMembers(normalized);
        }
      } catch (error) {
        console.error("Failed to load team members:", error);
      }
    };

    loadTeam();
  }, []);

  return (
    <div className="min-h-screen pt-24">
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-sm">
            <p className="text-sm font-medium text-foreground mb-3">About Us</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAboutSection("story")}
                className={`w-full rounded-md border px-4 py-2 text-center text-sm transition-colors ${
                  aboutSection === "story"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input bg-background text-foreground hover:bg-muted"
                }`}
              >
                Our Story
              </button>
              <button
                type="button"
                onClick={() => setAboutSection("team")}
                className={`w-full rounded-md border px-4 py-2 text-center text-sm transition-colors ${
                  aboutSection === "team"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input bg-background text-foreground hover:bg-muted"
                }`}
              >
                Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {aboutSection === "story" ? (
        <>
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
        </>
      ) : (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Our Team</p>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">Meet Our Team</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The people behind every unforgettable safari experience.
              </p>
            </div>

            <div className="space-y-10">
              {teamMembers.map((member, i) => (
                <motion.article
                  key={member.name}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="pb-10 border-b border-border last:border-b-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 items-start">
                    <div className="mx-0 text-left">
                      <img
                        src={toImageSrc(member.image_url)}
                        alt={member.name}
                        onError={withImageFallback}
                        className="w-full max-w-none md:w-56 h-96 md:h-64 object-cover rounded-md border border-border"
                      />
                      <h2 className="text-xl font-display font-semibold text-foreground mt-4">{member.name}</h2>
                      <p className="text-primary font-medium">{member.role}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground leading-relaxed text-lg">{member.bio}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default About;
