import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle } from "@/components/site/section-title";
import { Zap, BatteryCharging, Wifi, Car } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Extra Services — Eat Street" },
      {
        name: "description",
        content: "AC & DC fast EV charging, valet parking, and free Wi-Fi at Eat Street.",
      },
    ],
  }),
  component: Services,
});

const SERVICES = [
  {
    icon: Zap,
    title: "DC Fast Charging",
    desc: "High-speed CCS2 & CHAdeMO ports. Charge to 80% in roughly the time it takes to enjoy a thali.",
    badge: "Up to 60 kW",
  },
  {
    icon: BatteryCharging,
    title: "AC Slow Charging",
    desc: "Dedicated Type-2 AC outlets — perfect for an unhurried evening with family.",
    badge: "7.4 kW",
  },
  {
    icon: Car,
    title: "Valet Parking",
    desc: "Complimentary valet service for all dine-in guests. Pull up to the entrance, we'll take it from there.",
    badge: "Complimentary",
  },
  {
    icon: Wifi,
    title: "High-Speed Wi-Fi",
    desc: "Free fibre Wi-Fi throughout the restaurant for guests and remote-working diners.",
    badge: "Free",
  },
];

function Services() {
  return (
    <div className="container mx-auto px-4 py-20">
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

      <div className="mt-16 max-w-3xl mx-auto text-center bg-gradient-warm rounded-2xl p-10 shadow-elegant animate-fade-up">
        <Zap className="h-12 w-12 text-gold mx-auto mb-4" strokeWidth={1.5} />
        <h3 className="text-2xl font-display text-gradient-gold mb-3">
          Powering your journey, one meal at a time.
        </h3>
        <p className="text-foreground/80">
          We're proud to be one of the first heritage restaurants offering fast EV charging on
          premises — because the future of food and the future of mobility belong together.
        </p>
      </div>
    </div>
  );
}
