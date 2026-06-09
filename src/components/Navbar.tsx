import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Destinations", path: "/destinations" },
  { name: "Safari Packages", path: "/packages" },
  { name: "About", path: "/about" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
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

  return (
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
          className={`lg:hidden p-2 transition-colors ${scrolled || !isHomePage ? "text-foreground" : "text-primary-foreground"}`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/98 backdrop-blur-lg border-b border-border"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-lg font-medium py-2 transition-colors ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/booking">
                <Button className="w-full mt-2 gap-2">
                  <Phone className="w-4 h-4" />
                  Book Safari
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
