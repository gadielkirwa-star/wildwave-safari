import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, MapPin, DollarSign, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/lib/api";
import { useSEO } from "@/hooks/use-seo";

const Booking = () => {
  useSEO({
    title: "Safari Booking | WildWave Safaris",
    description: "Finalize your safari booking details with WildWave Safaris.",
    path: "/booking",
    noindex: true,
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const [packages, setPackages] = useState<any[]>([]);
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone: "",
    safari_type: "",
    number_of_people: "",
    start_date: "",
    total_price: "",
    special_requests: ""
  });

  useEffect(() => {
    const token = localStorage.getItem('customerToken');
    const customerData = localStorage.getItem('customerData');
    
    if (!token || !customerData) {
      navigate('/auth', { replace: true });
      return;
    }
    
    const parsedCustomer = JSON.parse(customerData);
    setCustomer(parsedCustomer);
    setFormData(prev => ({
      ...prev,
      customer_name: parsedCustomer.name,
      email: parsedCustomer.email,
      phone: parsedCustomer.phone || ""
    }));
    
    fetchPackages();
    setLoading(false);
  }, [navigate]);

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/packages`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/public/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          email: formData.email,
          phone: formData.phone,
          safari_type: formData.safari_type,
          number_of_people: parseInt(formData.number_of_people),
          start_date: formData.start_date,
          total_price: parseFloat(formData.total_price) || 0,
          special_requests: formData.special_requests
        })
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error || `HTTP ${response.status}`);
      }

      toast({ title: "Booking Submitted!", description: "We'll contact you shortly to confirm your safari." });
      setFormData({
        customer_name: "", email: "", phone: "", safari_type: "", number_of_people: "",
        start_date: "", total_price: "", special_requests: ""
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit booking. Please try again.", variant: "destructive" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24">
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-3">Book Your Safari</p>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
            Reserve Your <span className="italic text-primary">Adventure</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Complete the form below to book your dream safari. Our team will confirm availability and finalize your itinerary.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="bg-card rounded-xl p-8 border border-border space-y-6"
          >
            <h2 className="text-2xl font-display font-semibold mb-6">Booking Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Full Name *</label>
                <Input
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Email *</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Phone Number *</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+254 712 345 678"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Number of People *
                </label>
                <Input
                  name="number_of_people"
                  type="number"
                  min="1"
                  value={formData.number_of_people}
                  onChange={handleChange}
                  required
                  placeholder="2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Safari Package *
                </label>
                <select
                  name="safari_type"
                  value={formData.safari_type}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select a package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.name}>
                      {pkg.name} - {pkg.duration}
                    </option>
                  ))}
                  <option value="Custom Safari">Custom Safari</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Preferred Start Date *
                </label>
                <Input
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Budget (USD) - Optional
              </label>
              <Input
                name="total_price"
                type="number"
                min="0"
                step="0.01"
                value={formData.total_price}
                onChange={handleChange}
                placeholder="3000"
              />
              <p className="text-xs text-muted-foreground mt-1">Leave blank for a custom quote</p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Special Requests or Preferences</label>
              <Textarea
                name="special_requests"
                value={formData.special_requests}
                onChange={handleChange}
                placeholder="Dietary requirements, accommodation preferences, activities of interest..."
                rows={4}
              />
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ We'll review your booking request immediately</li>
                <li>✓ Our team will contact you to confirm availability</li>
                <li>✓ We'll send you a detailed itinerary and payment options</li>
                <li>✓ Once confirmed, you'll receive your booking confirmation</li>
              </ul>
            </div>

            <Button type="submit" size="lg" className="w-full gap-2">
              <Send className="w-4 h-4" />
              Submit Booking Request
            </Button>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default Booking;
