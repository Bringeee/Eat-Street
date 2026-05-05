import { Instagram, Phone, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/40 bg-card/30">
      <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <h3 className="text-2xl text-gradient-gold font-display mb-3">{SITE.name}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{SITE.tagline}</p>
          <p className="text-xs text-muted-foreground mt-4">Established {SITE.established}</p>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest text-primary mb-3">Visit</h4>
          <p className="text-sm text-muted-foreground">{SITE.address}</p>
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm mt-3 text-foreground hover:text-primary transition-colors"
          >
            {/* <MapPin className="h-4 w-4" /> Open in Google Maps */}
          </a>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest text-primary mb-3">Connect</h4>
          <div className="space-y-2 text-sm">
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" /> {SITE.phone}
            </a>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Instagram className="h-4 w-4" /> @{SITE.instagram}
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-widest text-primary mb-3">Legal</h4>
          <div className="space-y-2 text-sm">
            <Link
              to="/privacy-policy"
              className="text-muted-foreground hover:text-primary transition-colors block"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="text-muted-foreground hover:text-primary transition-colors block"
            >
              Terms & Conditions
            </Link>
            <Link
              to="/cancellation-and-refund"
              className="text-muted-foreground hover:text-primary transition-colors block"
            >
              Cancellation & Refund
            </Link>
            <Link
              to="/shipping-and-delivery"
              className="text-muted-foreground hover:text-primary transition-colors block"
            >
              Shipping & Delivery
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SITE.name}. Crafted with love & spice.
      </div>
    </footer>
  );
}
