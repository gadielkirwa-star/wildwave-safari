import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { toImageSrc, withImageFallback } from "@/lib/images";

type TeamMember = {
  id: number;
  name: string;
  role?: string | null;
  bio?: string | null;
  image_url?: string | null;
};

const TeamSection = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/public/team-members`);
        if (!response.ok) {
          throw new Error(`Failed to fetch team members (${response.status})`);
        }
        const data = await response.json();
        setMembers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load team members:", error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, []);

  if (loading || members.length === 0) {
    return null;
  }

  return (
    <section className="bg-safari-charcoal/95 text-safari-cream border-t border-safari-warm-brown">
      <div className="container mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <p className="text-primary font-medium tracking-[0.2em] uppercase text-xs mb-2">WildWave Safaris</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold">Meet Our Team</h2>
          <p className="text-safari-sand/80 mt-3 max-w-2xl mx-auto">
            The people behind every unforgettable safari experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <article
              key={member.id}
              className="bg-safari-warm-brown/35 border border-safari-warm-brown rounded-2xl p-6 hover:bg-safari-warm-brown/45 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={toImageSrc(member.image_url)}
                  alt={member.name}
                  onError={withImageFallback}
                  className="w-16 h-16 rounded-full object-cover border-2 border-safari-gold"
                />
                <div>
                  <h3 className="text-xl font-display font-semibold">{member.name}</h3>
                  <p className="text-sm text-safari-gold">{member.role || "Team Member"}</p>
                </div>
              </div>
              <p className="text-sm text-safari-sand/90 leading-relaxed">{member.bio || "Safari expert at WildWave Safaris."}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
