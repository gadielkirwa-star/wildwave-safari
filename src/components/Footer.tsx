import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram, Facebook, Music2 } from "lucide-react";

const partners = [
  { name: "TripAdvisor", logo: "https://static.tacdn.com/img2/brand_refresh_2025/logos/wordmark.svg" },
  { name: "Safari Bookings", logo: "https://cfstatic.safaribookings.com/img/logos/logo-240x35.png" },
  { name: "TOSK", logo: "https://staging.toskenya.org/wp-content/uploads/2024/03/tosk_logo_v2.webp" },
  { name: "Serena Hotels", logo: "https://image-tc.galaxy.tf/wisvg-2kxzoagrzpaii22pmbq9rz11m/serena-hotel-logo.svg?width=128&height=80" },
  { name: "Sopa Lodges", logo: "https://www.sopalodges.com/images/logos/sopalodges-logo.png" },
  { name: "Mombasa Air Safari", logo: "https://storage.aerocrs.com/99/system/logo.png" },
];

const Footer = () => {
  const quickLinks = [
    { label: "Destinations", path: "/destinations" },
    { label: "Safari Packages", path: "/packages" },
    { label: "About Us", path: "/about" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ];

  const socialLinks = [
    { icon: Instagram, href: "#" },
    { icon: Facebook, href: "https://www.facebook.com/share/16kHvGDuwT/" },
    { icon: Music2, href: "https://www.tiktok.com/@wildwavesafaris?_t=ZM-8yaxQnBH5SY&_r=1" },
  ];

  return (
    <footer className="bg-safari-charcoal text-safari-sand">
      {/* Partners Section */}
      <div className="border-b border-safari-warm-brown/30 bg-[#1A1208] py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-safari-gold/80 font-display font-medium text-sm tracking-[0.2em] uppercase mb-12">Trusted By Leading Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center justify-center h-[90px] md:h-[100px] hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  title={partner.name}
                  className="max-w-full max-h-full object-contain filter grayscale brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-display font-bold text-safari-cream mb-4">
              Wild<span className="text-primary">Wave</span> Safaris
            </h3>
            <p className="text-sm leading-relaxed opacity-80 mb-6">
              Crafting unforgettable East African safari experiences since 2010. 
              From the Serengeti to the mountains of Rwanda, we bring you closer to the wild.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-safari-warm-brown hover:bg-primary transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-safari-cream mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="opacity-80 hover:opacity-100 hover:text-primary transition-all">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Destinations */}
          <div>
            <h4 className="font-display font-semibold text-safari-cream mb-4">Top Destinations</h4>
            <ul className="space-y-3 text-sm">
              {["Masai Mara", "Serengeti", "Ngorongoro Crater", "Bwindi Forest", "Zanzibar"].map((item) => (
                <li key={item}>
                  <Link to="/destinations" className="opacity-80 hover:opacity-100 hover:text-primary transition-all flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-safari-cream mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 opacity-80">
                <Phone className="w-4 h-4 text-primary" />
                +254 713 241 666
              </li>
              <li className="flex items-center gap-3 opacity-80">
                <Mail className="w-4 h-4 text-primary" />
                wildwavesafaris@gmail.com
              </li>
              <li className="flex items-start gap-3 opacity-80">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                Thika Road, Spur Mall, Nairobi
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-safari-warm-brown text-center text-sm opacity-60">
          <p>© {new Date().getFullYear()} WildWave Safaris. All rights reserved. | KATO Licensed Tour Operator</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
