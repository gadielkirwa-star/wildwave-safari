import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<any>({});
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", destination: "", travelers: "", message: "",
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://wildwave-safaris-api.onrender.com/api';
      const response = await fetch(`${apiUrl}/public/contact-settings`);
      const data = await response.json();
      setContactInfo(data);
    } catch (error) {
      console.error('Failed to fetch contact info:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://wildwave-safaris-api.onrender.com/api';
      await fetch(`${apiUrl}/public/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `Safari Inquiry - ${formData.destination || 'General'}`,
          message: `Destination: ${formData.destination}\nTravelers: ${formData.travelers}\n\n${formData.message}`
        })
      });
      toast({ title: "Inquiry Sent!", description: "We'll get back to you within 24 hours." });
      setFormData({ name: "", email: "", phone: "", destination: "", travelers: "", message: "" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to send inquiry. Please try again.", variant: "destructive" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen pt-24">
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Get in Touch</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
            Plan Your <span className="italic text-primary">Safari</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Ready to explore East Africa? Fill out the form below or reach us directly. We respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Booking Form */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                onSubmit={handleSubmit}
                className="bg-card rounded-xl p-8 border border-border space-y-6"
              >
                <h3 className="font-display text-2xl font-semibold mb-2">Booking Inquiry</h3>
                <p className="text-muted-foreground text-sm mb-6">Tell us about your dream safari and we'll create a custom itinerary.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                    <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Email *</label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                    <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Number of Travelers</label>
                    <Input name="travelers" value={formData.travelers} onChange={handleChange} placeholder="e.g. 2 adults, 1 child" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Preferred Destination</label>
                  <select
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select a destination</option>
                    <option>Masai Mara, Kenya</option>
                    <option>Serengeti, Tanzania</option>
                    <option>Ngorongoro Crater, Tanzania</option>
                    <option>Bwindi Forest, Uganda</option>
                    <option>Zanzibar, Tanzania</option>
                    <option>Volcanoes NP, Rwanda</option>
                    <option>Custom / Multiple</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Tell Us About Your Dream Safari</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Dates, interests, budget range, special requests..."
                    rows={5}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  Send Inquiry
                </Button>
              </motion.form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8 order-2 lg:order-1">
              <div>
                <h3 className="font-display text-xl font-semibold mb-6">Reach Us Directly</h3>
                <div className="space-y-6">
                  {[
                    { icon: Phone, label: "Call Us", value: contactInfo.phone || "+254 713 241 666", href: `tel:${contactInfo.phone || '+254713241666'}` },
                    { icon: Mail, label: "Email Us", value: contactInfo.email || "wildwavesafaris@gmail.com", href: `mailto:${contactInfo.email || 'wildwavesafaris@gmail.com'}` },
                    { icon: MessageCircle, label: "WhatsApp", value: contactInfo.whatsapp || "+254 713 241 666", href: `https://wa.me/${(contactInfo.whatsapp || '+254713241666').replace(/[^0-9]/g, '')}` },
                    { icon: MapPin, label: "Visit Us", value: contactInfo.address || "Thika Road, Spur Mall, Nairobi", href: "#" },
                  ].map((item) => (
                    <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="font-medium text-foreground">{item.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <h4 className="font-display font-semibold mb-2">Office Hours</h4>
                {contactInfo.office_hours ? (
                  <div className="text-sm text-muted-foreground whitespace-pre-line">{contactInfo.office_hours}</div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">Mon - Fri: 8:00 AM - 6:00 PM (EAT)</p>
                    <p className="text-sm text-muted-foreground">Sat: 9:00 AM - 3:00 PM (EAT)</p>
                    <p className="text-sm text-muted-foreground">Sun: Closed</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
