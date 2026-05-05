import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle } from "@/components/site/section-title";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site-config";
import { Phone, Instagram, MapPin, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Eat Street" },
      { name: "description", content: `Visit us at ${SITE.address}. Reach us at ${SITE.phone}.` },
    ],
  }),
  component: Contact,
});

function Contact() {
  const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`;

  return (
    <div className="container mx-auto px-4 py-20">
      <SectionTitle
        eyebrow="Reach Us"
        title="Find Your Way Here"
        subtitle="We can't wait to welcome you. Reservations are recommended on weekends."
      />

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="space-y-4 animate-fade-up">
          {[
            { icon: MapPin, label: "Address", value: SITE.address, href: SITE.mapsUrl },
            {
              icon: Phone,
              label: "Phone",
              value: SITE.phone,
              href: `tel:${SITE.phone.replace(/\s/g, "")}`,
            },
            {
              icon: MessageCircle,
              label: "WhatsApp",
              value: "Order with us directly",
              href: `https://wa.me/${SITE.whatsapp}`,
            },
            {
              icon: Instagram,
              label: "Instagram",
              value: `@${SITE.instagram}`,
              href: SITE.instagramUrl,
            },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-card border border-border/40 rounded-xl p-5 hover-lift group"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-warm flex items-center justify-center shadow-glow">
                <c.icon className="h-5 w-5 text-gold" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
                <p className="text-foreground group-hover:text-primary transition-colors">
                  {c.value}
                </p>
              </div>
            </a>
          ))}
          <Button
            asChild
            size="lg"
            className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-glow"
          >
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">
              <MapPin className="mr-2 h-4 w-4" /> Open in Google Maps
            </a>
          </Button>
        </div>

        <div className="rounded-xl overflow-hidden border border-border/40 shadow-elegant animate-fade-up [animation-delay:150ms] min-h-[420px]">
          <iframe
            src={mapsEmbed}
            title="Restaurant location map"
            className="w-full h-full min-h-[420px] grayscale-[0.3]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
