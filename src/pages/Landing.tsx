import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Hotel,
  Star,
  MapPin,
  Phone,
  Mail,
  Wifi,
  UtensilsCrossed,
  Car,
  Waves,
  Shield,
  Clock,
  Users,
  ChevronRight,
} from "lucide-react";

const amenities = [
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: UtensilsCrossed, label: "Restaurant & Bar" },
  { icon: Car, label: "Parking" },
  { icon: Waves, label: "Swimming Pool" },
  { icon: Shield, label: "24/7 Security" },
  { icon: Clock, label: "Room Service" },
];

const rooms = [
  { name: "Standard Room", price: "₹2,499", desc: "Cozy room with all essential amenities", features: ["AC", "TV", "Wi-Fi"] },
  { name: "Deluxe Suite", price: "₹4,999", desc: "Spacious suite with premium furnishings", features: ["King Bed", "Balcony", "Mini Bar"] },
  { name: "Royal Suite", price: "₹8,999", desc: "Luxurious suite with panoramic city views", features: ["Living Area", "Jacuzzi", "Butler Service"] },
];

const testimonials = [
  { name: "Rajesh Kumar", text: "Excellent hospitality and world-class service. Truly a 5-star experience!", rating: 5 },
  { name: "Anita Sharma", text: "The rooms are spotless and the staff is incredibly friendly. Will visit again!", rating: 5 },
  { name: "David Wilson", text: "Best hotel in the city. The restaurant serves amazing food!", rating: 4 },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <Hotel className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-primary-foreground">Sri Krishna International</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">About</a>
              <a href="#rooms" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Rooms</a>
              <a href="#amenities" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Amenities</a>
              <a href="#testimonials" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Reviews</a>
              <a href="#contact" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Contact</a>
            </div>
            <Button
              onClick={() => navigate("/login")}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Staff Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 min-h-[90vh] flex items-center bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-navy-dark opacity-90" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
              ))}
              <span className="text-primary-foreground/60 text-sm ml-1">Premium Hotel</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight">
              Experience <span className="text-accent">Luxury</span> & Comfort
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/70 max-w-lg">
              Welcome to Sri Krishna International — where traditional hospitality meets modern luxury. Your perfect stay awaits.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8">
                Book Now
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8">
                Explore Rooms
              </Button>
            </div>
            <div className="mt-12 flex items-center gap-8">
              <div>
                <p className="text-3xl font-bold text-accent">120+</p>
                <p className="text-sm text-primary-foreground/50">Luxury Rooms</p>
              </div>
              <div className="h-10 w-px bg-primary-foreground/20" />
              <div>
                <p className="text-3xl font-bold text-accent">4.8</p>
                <p className="text-sm text-primary-foreground/50">Guest Rating</p>
              </div>
              <div className="h-10 w-px bg-primary-foreground/20" />
              <div>
                <p className="text-3xl font-bold text-accent">10+</p>
                <p className="text-sm text-primary-foreground/50">Years of Service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">About Our Hotel</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Sri Krishna International is a premium hotel offering world-class hospitality in the heart of the city.
              With over 120 elegantly designed rooms, fine dining restaurants, and state-of-the-art facilities,
              we ensure every guest enjoys an unforgettable stay.
            </p>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-center">Our Rooms</h2>
          <p className="text-center text-muted-foreground mt-3 mb-12">Choose from our carefully curated selection</p>
          <div className="grid md:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room.name} className="rounded-2xl bg-card border border-border p-6 shadow-card hover:shadow-elevated transition-shadow">
                <div className="h-48 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-5">
                  <Hotel className="h-12 w-12 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">{room.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{room.desc}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {room.features.map((f) => (
                    <span key={f} className="text-xs bg-secondary px-2.5 py-1 rounded-full text-muted-foreground">{f}</span>
                  ))}
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-accent">{room.price}</span>
                    <span className="text-muted-foreground text-sm"> /night</span>
                  </div>
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">Book</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-center">Amenities</h2>
          <p className="text-center text-muted-foreground mt-3 mb-12">Everything you need for a perfect stay</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {amenities.map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-3 rounded-xl bg-card border border-border p-6 shadow-card">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <a.icon className="h-6 w-6 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground text-center">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground text-center">Guest Reviews</h2>
          <p className="text-center text-primary-foreground/60 mt-3 mb-12">What our guests say about us</p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 p-6 backdrop-blur-sm">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-primary-foreground/80 text-sm leading-relaxed">"{t.text}"</p>
                <p className="mt-4 font-medium text-primary-foreground">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-center">Contact Us</h2>
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-sm font-medium text-foreground">123 Main Road, City Center</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-foreground">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">info@srikrishna.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-8 border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Hotel className="h-5 w-5 text-accent" />
            <span className="font-display text-lg font-bold text-primary-foreground">Sri Krishna International</span>
          </div>
          <p className="text-sm text-primary-foreground/50">© 2026 Sri Krishna International. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
