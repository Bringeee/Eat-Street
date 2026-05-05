import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu as MenuIcon, X, User } from "lucide-react";
import { CartPanel } from "./cart-panel";
import { cn } from "@/lib/utils";

type NavLink = { to: string; label: string } | { hash: string; label: string };

const links: NavLink[] = [
  { to: "/", label: "Home" },
  { to: "/categories", label: "Menu" },
  { hash: "gallery", label: "Gallery" },
  { hash: "about", label: "About" },
  { hash: "services", label: "Services" },
  { hash: "reviews", label: "Reviews" },
  { hash: "contact", label: "Contact" },
];

function isHashLink(link: NavLink): link is { hash: string; label: string } {
  return "hash" in link;
}

export function Header() {
  const count = useCart((s) => s.count());
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/40">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl text-gradient-gold font-display font-semibold tracking-wide">
            EAT STREET
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) =>
            isHashLink(l) ? (
              <a
                key={l.label}
                href={`#${l.hash}`}
                className="text-sm tracking-wide text-foreground/80 hover:text-primary transition-colors"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                to={l.to}
                className="text-sm tracking-wide text-foreground/80 hover:text-primary transition-colors"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" title="Admin Panel">
            <Link to="/admin">
              <User className="h-5 w-5" />
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" title="Shopping Cart">
                <ShoppingCart className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md flex flex-col">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">Your Thali</SheetTitle>
              </SheetHeader>
              <CartPanel />
            </SheetContent>
          </Sheet>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobile((m) => !m)}
            aria-label="Toggle menu"
          >
            {mobile ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden transition-[max-height] duration-300",
          mobile ? "max-h-96" : "max-h-0",
        )}
      >
        <nav className="flex flex-col px-4 pb-4 gap-1 border-t border-border/40">
          {links.map((l) =>
            isHashLink(l) ? (
              <a
                key={l.label}
                href={`#${l.hash}`}
                onClick={() => setMobile(false)}
                className="py-3 text-sm border-b border-border/30 text-foreground/80"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setMobile(false)}
                className="py-3 text-sm border-b border-border/30 text-foreground/80"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
