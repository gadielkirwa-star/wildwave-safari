import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Home, MapPin, Briefcase, Info, BookOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "Destinations", path: "/destinations", icon: MapPin },
  { name: "Safari Packages", path: "/packages", icon: Briefcase },
  { name: "About", path: "/about", icon: Info },
  { name: "Blog", path: "/blog", icon: BookOpen },
  { name: "Contact", path: "/contact", icon: Mail },
];

const LOGO_URL = "https://www.dropbox.com/scl/fi/hx1jqsxef1zz940ibzktk/wb.jpeg?rlkey=teccg3icp4p289k6q3g5w65w2&st=euyvj5ja&raw=1";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={LOGO_URL}
              alt="WildWave Logo"
              className="w-10 h-10 md:w-12 md:h-12 object-cover object-left rounded-full shadow-md border-2 border-white/80 transition-transform duration-300 hover:scale-110 hover:shadow-lg bg-white"
            />
            <span className={`text-2xl md:text-3xl font-display font-bold tracking-tight transition-colors ${scrolled || !isHomePage ? "text-foreground" : "text-primary-foreground"}`}>
              Wild<span className="text-primary">Wave</span> Safaris
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                  location.pathname === link.path
                    ? "text-primary"
                    : scrolled || !isHomePage
                    ? "text-foreground"
                    : "text-primary-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/booking">
              <Button variant="default" size="sm" className="gap-2">
                <Phone className="w-4 h-4" />
                Book Safari
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className={`lg:hidden p-2 rounded-lg transition-all ${
              isOpen
                ? "bg-safari-gold text-white"
                : scrolled || !isHomePage
                ? "text-foreground hover:bg-black/10"
                : "text-white hover:bg-white/20"
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu — Full-screen solid overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm lg:hidden flex flex-col"
              style={{ backgroundColor: "#1A1208" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src={LOGO_URL}
                    alt="WildWave Logo"
                    className="w-9 h-9 object-cover object-left rounded-full border-2 border-[#D4A84B]/60 bg-white"
                  />
                  <div>
                    <p className="text-white font-display font-bold text-base leading-tight">
                      Wild<span className="text-[#D4A84B]">Wave</span> Safaris
                    </p>
                    <p className="text-white/40 text-xs font-mono tracking-widest uppercase">East Africa</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#D4A84B] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {navLinks.map((link, i) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group ${
                          isActive
                            ? "bg-[#D4A84B]/20 border border-[#D4A84B]/40"
                            : "hover:bg-white/8 border border-transparent hover:border-white/10"
                        }`}
                        style={!isActive ? {} : {}}
                      >
                        {/* Active indicator bar */}
                        <span className={`w-1 h-7 rounded-full shrink-0 transition-all ${isActive ? "bg-[#D4A84B]" : "bg-transparent group-hover:bg-white/20"}`} />
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all ${isActive ? "bg-[#D4A84B]" : "bg-white/10 group-hover:bg-white/15"}`}>
                          <Icon className={`w-5 h-5 ${isActive ? "text-[#1A1208]" : "text-white/70"}`} />
                        </div>
                        <span className={`text-base font-semibold tracking-wide transition-colors ${isActive ? "text-[#D4A84B]" : "text-white/90 group-hover:text-white"}`}>
                          {link.name}
                        </span>
                        {isActive && (
                          <span className="ml-auto text-[#D4A84B]">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* CTA Footer */}
              <div className="px-6 py-6 border-t border-white/10 space-y-3">
                <Link to="/booking" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-4 rounded-xl font-bold text-[#1A1208] text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                    style={{ backgroundColor: "#D4A84B" }}>
                    <Phone className="w-4 h-4" />
                    Book Your Safari
                  </button>
                </Link>
                <a
                  href="https://wa.me/254700000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl font-bold text-white text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/20 hover:bg-white/10"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.524 5.847L.057 23.881l6.196-1.424A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.866 9.866 0 01-5.031-1.378l-.36-.214-3.733.857.899-3.629-.235-.374A9.855 9.855 0 012.106 12C2.106 6.57 6.57 2.106 12 2.106S21.894 6.57 21.894 12 17.43 21.894 12 21.894z"/></svg>
                  WhatsApp Us
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;


