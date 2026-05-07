import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import heroImg from "@/assets/hero-thali.jpg";
import founderImg from "@/assets/gallery/chef.jpeg";
import g1 from "@/assets/gallery/interior-1.jpg";
import g2 from "@/assets/gallery/tandoor.jpg";
import g3 from "@/assets/gallery/spices.jpg";
import g4 from "@/assets/gallery/thali.jpg";
import g5 from "@/assets/gallery/dining-room.jpg";
import g6 from "@/assets/gallery/interior-2.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SectionTitle } from "@/components/site/section-title";
import { useMenu, useReviews, useAdmin } from "@/lib/store";
import { formatINR, SITE } from "@/lib/site-config";
import { reviewsService } from "@/lib/firebase-reviews-service";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowRight, Star, Wifi, Trash2, Phone, Instagram, MapPin } from "lucide-react";
import {  Utensils, Cake, HeartHandshake } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const IMAGES = [
  { src: g1, alt: "Lantern-lit dining hall" },
  { src: g4, alt: "Royal thali platter" },
  { src: g2, alt: "Tandoor oven flames" },
  { src: g6, alt: "Chef garnishing curry" },
  { src: g3, alt: "Indian spice palette" },
  { src: g5, alt: "Private dining room" },
];

const SERVICES = [
  {
    icon: Utensils,
    title: "Buffet System",
    desc: "Enjoy our lavish buffet featuring a wide variety of Indian and continental dishes prepared fresh every day.",
    badge: "Unlimited",
  },
  {
    icon: Cake,
    title: "Birthday Party Hosting",
    desc: "Celebrate memorable birthdays with customised decorations, music, and delicious food arrangements.",
    badge: "Custom Setup",
  },
  {
    icon: HeartHandshake,
    title: "Anniversary Celebrations",
    desc: "Make your special moments unforgettable with elegant seating, candle-light setups, and curated dining experiences.",
    badge: "Special Arrangements",
  },
  {
    icon: Wifi,
    title: "High-Speed Wi-Fi",
    desc: "Free fibre Wi-Fi throughout the restaurant for guests and remote-working diners.",
    badge: "Free",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — Modern Indian Cuisine` },
      { name: "description", content: SITE.tagline },
    ],
  }),
  component: Home,
});

function Stars({
  value,
  onChange,
  size = 18,
}: {
  value: number;
  onChange?: (n: number) => void;
  size?: number;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHovered(i)}
          className={cn("transition-transform", onChange && "hover:scale-125 cursor-pointer")}
        >
          <Star
            className={cn(
              (hovered || value) >= i ? "text-gold fill-gold" : "text-muted-foreground/40",
            )}
            style={{ width: size, height: size }}
          />
        </button>
      ))}
    </div>
  );
}

function Home() {
  const dishes = useMenu((s) => s.dishes);
  
  // Get 10 random dishes, or all dishes if less than 10 available
  const getRandomDishes = (dishList: typeof dishes, count: number) => {
    if (dishList.length <= count) return dishList;
    const shuffled = [...dishList].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };
  
  const featured = getRandomDishes(dishes, 10);
  const { reviews: storeReviews, add, remove } = useReviews();
  const [reviews, setReviews] = useState(storeReviews);
  const isAdmin = useAdmin((s) => s.isAdmin);
  const [openGallery, setOpenGallery] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [carouselApi, setCarouselApi] = useState<any>(null);

  // Load Firebase reviews on component mount
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const firebaseReviews = await reviewsService.getAllReviews();
        // Convert Firebase reviews to store format
        const convertedReviews = firebaseReviews.map((r) => ({
          id: r.id,
          name: r.name,
          rating: r.rating,
          text: r.text,
          createdAt: r.createdAt,
        }));
        setReviews(convertedReviews);
      } catch (error) {
        console.error("Error loading Firebase reviews:", error);
        // Fallback to store reviews if Firebase fails
        setReviews(storeReviews);
      }
    };
    loadReviews();
  }, [storeReviews]);

  // Auto-scroll carousel
  useEffect(() => {
    if (!carouselApi) return;

    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselApi]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      toast.error("Please add your name and a review.");
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars.");
      return;
    }

    setLoading(true);
    try {
      // Save to Firebase
      const newReview = await reviewsService.addReview({
        name: name.trim().slice(0, 60),
        rating,
        text: text.trim().slice(0, 500),
        createdAt: Date.now(),
      });

      if (newReview) {
        // Also add to local store for redundancy
        add({
          name: newReview.name,
          rating: newReview.rating,
          text: newReview.text,
        });

        // Update local reviews state
        setReviews((prev) => [newReview, ...prev]);

        // Reset form
        setName("");
        setText("");
        setRating(0);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`;

  return (
    <>
      {/* HERO */}
      <section className="relative h-[88vh] min-h-[600px] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Royal Indian thali"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative z-10 h-full container mx-auto px-4 flex flex-col items-center justify-center text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary mb-4 animate-fade-in">
            Est. {SITE.established}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium text-gradient-gold mb-6 animate-fade-up max-w-4xl leading-[1.05]">
            {SITE.name}
          </h1>
          <p className="text-lg md:text-xl text-foreground/90 max-w-xl mb-8 animate-fade-up [animation-delay:200ms]">
            {SITE.tagline}
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-up [animation-delay:400ms]">
            <Button
              asChild
              size="lg"
              className="bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-glow"
            >
              <a href="#featured">
                Explore the Menu <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary/40 hover:bg-primary/10"
            >
              <a href="#about">Our Story</a>
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURED DISHES - MENU SECTION */}
      <section id="featured" className="container mx-auto px-4 py-24">
        <SectionTitle
          eyebrow="Signature creations"
          title="From the Royal Kitchen"
          subtitle="A taste of what awaits — every dish hand-crafted with heirloom recipes and the freshest spices."
        />
        {featured.length > 0 ? (
          <>
            <Carousel 
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
              setApi={setCarouselApi}
            >
              <CarouselContent className="-ml-4">
                {featured.map((d, i) => (
                  <CarouselItem key={d.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                    <div
                      className="group relative overflow-hidden rounded-xl bg-card border border-border/40 hover-lift animate-fade-up h-full"
                      style={{ animationDelay: `${(i % 4) * 100}ms` }}
                    >
                      <div className="aspect-[4/5] overflow-hidden">
                        <img
                          src={d.image}
                          alt={d.name}
                          loading="lazy"
                          width={800}
                          height={1000}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-display text-gradient-gold mb-1">{d.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{d.description}</p>
                        <p className="text-primary font-medium">{formatINR(d.price)}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12" />
              <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>
            <div className="text-center mt-10">
              <Button asChild variant="ghost" className="text-primary">
                <Link to="/categories">
                  View Full Menu <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">Featured dishes coming soon!</p>
            <Button asChild variant="outline" className="border-primary/40">
              <Link to="/categories">
                Browse Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="container mx-auto px-4 py-20">
        <SectionTitle
          eyebrow="Step Inside"
          title="Our Gallery"
          subtitle="A visual journey through our kitchen, our dishes, and our home."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {IMAGES.map((img, i) => (
            <button
              key={i}
              onClick={() => setOpenGallery(img.src)}
              className="group relative overflow-hidden rounded-xl bg-card animate-fade-up aspect-square"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors" />
              <div className="absolute inset-0 ring-1 ring-inset ring-gold/20 group-hover:ring-gold/60 rounded-xl transition" />
            </button>
          ))}
        </div>

        <Dialog open={!!openGallery} onOpenChange={(o) => !o && setOpenGallery(null)}>
          <DialogContent className="max-w-5xl p-0 bg-transparent border-0">
            {openGallery && (
              <img src={openGallery} alt="" className="w-full h-auto rounded-xl shadow-elegant" />
            )}
          </DialogContent>
        </Dialog>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="container mx-auto px-4 py-20">
        <SectionTitle eyebrow="Our Heritage" title="A Family Story, Slow-Cooked" />

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="relative animate-fade-up">
            <img
              src={founderImg}
              alt={SITE.founder}
              className="rounded-xl shadow-elegant w-full"
              loading="lazy"
              width={500}
              height={400}
            />
            <div className="absolute -bottom-6 -right-6 bg-gradient-gold text-primary-foreground px-6 py-4 rounded-lg shadow-glow hidden md:block">
              <div className="text-3xl font-display">{SITE.established}</div>
              <div className="text-xs uppercase tracking-widest">Founded</div>
            </div>
          </div>
          <div className="space-y-6 animate-fade-up [animation-delay:150ms]">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Founder</p>
            <h3 className="text-3xl font-display text-gradient-gold">{SITE.founder}</h3>
            <p className="text-muted-foreground leading-relaxed">{SITE.story}</p>
                      <p className="text-muted-foreground leading-relaxed">{SITE.restro}</p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
              <div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section className="bg-card/30 border-y border-border/40 py-5">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: `${new Date().getFullYear() - SITE.established}+`, l: "Years of heritage" },
            { n: "100+", l: "Authentic recipes" },
            { n: "★ 4.5", l: "Guest rating" },
            { n: "100%", l: "House-ground spices" },
          ].map((s) => (
            <div key={s.l} className="space-y-1">
              <div className="text-3xl md:text-4xl font-display text-gradient-gold">{s.n}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="container mx-auto px-4 py-20">
        <SectionTitle
          eyebrow="Beyond the Plate"
          title="Extra Services"
          subtitle="Modern conveniences, woven thoughtfully into a timeless dining experience."
        />

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="group relative bg-card border border-border/40 rounded-xl p-8 hover-lift animate-fade-up overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-gold opacity-5 group-hover:opacity-15 transition-opacity" />
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div className="h-14 w-14 rounded-lg bg-gradient-warm flex items-center justify-center shadow-glow">
                    <s.icon className="h-7 w-7 text-gold" strokeWidth={1.5} />
                  </div>
                  <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-gold/40 text-gold">
                    {s.badge}
                  </span>
                </div>
                <h3 className="text-2xl font-display text-gradient-gold mb-2">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="mt-16 max-w-3xl mx-auto text-center bg-gradient-warm rounded-2xl p-10 shadow-elegant animate-fade-up">
          <Zap className="h-12 w-12 text-gold mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-2xl font-display text-gradient-gold mb-3">
            Powering your journey, one meal at a time.
          </h3>
          <p className="text-foreground/80">
            We're proud to be one of the first heritage restaurants offering fast EV charging on
            premises — because the future of food and the future of mobility belong together.
          </p>
        </div> */}
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="container mx-auto px-4 py-20">
        <SectionTitle
          eyebrow="Guest Voices"
          title="Reviews & Stories"
          subtitle={
            reviews.length > 0
              ? `Rated ${avg.toFixed(1)} from ${reviews.length} guests`
              : "Be the first to share your experience."
          }
        />

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <form
            onSubmit={submitReview}
            className="lg:col-span-1 bg-card border border-border/40 rounded-xl p-6 space-y-4 h-fit lg:sticky lg:top-24 animate-fade-up"
          >
            <h3 className="font-display text-2xl text-gradient-gold">Share your experience</h3>
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              disabled={loading}
            />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your rating</p>
              <Stars value={rating} onChange={loading ? undefined : setRating} size={26} />
            </div>
            <Textarea
              placeholder="Tell us about your meal..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              maxLength={500}
              disabled={loading}
            />
            <Button
              type="submit"
              className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-glow"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </form>

          <div className="lg:col-span-2 space-y-4">
            {reviews.map((r, i) => (
              <div
                key={r.id}
                className="bg-card border border-border/40 rounded-xl p-6 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-display text-lg">{r.name}</p>
                    <Stars value={r.rating} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                    {isAdmin && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive h-8 w-8"
                        onClick={async () => {
                          try {
                            // Delete from Firebase
                            await reviewsService.deleteReview(r.id);
                            // Remove from local state
                            setReviews((prev) => prev.filter((review) => review.id !== r.id));
                            // Remove from store
                            remove(r.id);
                            toast.success("Review deleted");
                          } catch (error) {
                            console.error("Error deleting review:", error);
                            toast.error("Failed to delete review");
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-foreground/80 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="container mx-auto px-4 py-20">
        <SectionTitle
          eyebrow="Reach Us"
          title="Find Your Way Here"
          subtitle="We can't wait to welcome you. Reservations are recommended on weekends."
        />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-up">
            {[
              {
                icon: Instagram,
                label: "Instagram",
                value: `@${SITE.instagram}`,
                href: SITE.instagramUrl,
              },
              {
                icon: Phone,
                label: "Phone",
                value: SITE.phone,
                href: `tel:${SITE.phone.replace(/\s/g, "")}`,
              },
              { icon: MapPin, label: "Address", value: SITE.address, href: SITE.mapsUrl },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 bg-card border border-border/40 rounded-xl p-6 hover-lift group text-center"
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-warm flex items-center justify-center shadow-glow">
                  <c.icon className="h-5 w-5 text-gold" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    {c.label}
                  </p>
                  <p className="text-foreground group-hover:text-primary transition-colors text-xs sm:text-sm break-words">
                    {c.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
