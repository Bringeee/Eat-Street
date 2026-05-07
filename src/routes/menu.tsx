import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMenu, useCart } from "@/lib/store";
import { CATEGORIES, CATEGORY_INFO, type Category, type Dish } from "@/lib/menu-data";
import { formatINR } from "@/lib/site-config";
import { SectionTitle } from "@/components/site/section-title";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Eat Street" },
      {
        name: "description",
        content: "Explore our menu of starters, mains, desserts and beverages — all priced in INR.",
      },
    ],
  }),
  component: MenuPage,
  validateSearch: (search: Record<string, unknown>): { category?: string } => ({
    category: (search.category as string) || undefined,
  }),
});

function MenuPage() {
  const dishes = useMenu((s) => s.dishes);
  const add = useCart((s) => s.add);
  const search = Route.useSearch();
  const [active, setActive] = useState<Category | "All">("All");
  const [variantDialog, setVariantDialog] = useState<Dish | null>(null);

  useEffect(() => {
    if (search.category && CATEGORIES.includes(search.category as Category)) {
      setActive(search.category as Category);
    } else {
      setActive("All");
    }
  }, [search.category]);

  const filtered = active === "All" ? dishes : dishes.filter((d) => d.category === active);
  const isFromCategory = !!search.category;
  const categoryInfo = isFromCategory && active !== "All" ? CATEGORY_INFO[active] : null;

  const handleAddDish = (dish: Dish) => {
    if (dish.hasDualPricing && dish.halfPrice && dish.fullPrice) {
      setVariantDialog(dish);
    } else {
      add(dish);
      toast.success(`${dish.name} added to your thali`);
    }
  };

  const handleVariantSelect = (variant: "half" | "full") => {
    if (!variantDialog) return;

    const price = variant === "half" ? variantDialog.halfPrice! : variantDialog.fullPrice!;
    const dishToAdd: Dish = {
      ...variantDialog,
      id: `${variantDialog.id}-${variant}`,
      price,
      name: `${variantDialog.name} (${variant === "half" ? "Half" : "Full"} Plate)`,
    };

    add(dishToAdd);
    toast.success(
      `${variantDialog.name} (${variant === "half" ? "Half" : "Full"} Plate) added to your thali`,
    );
    setVariantDialog(null);
  };

  return (
    <div className="container mx-auto px-4 py-20">
      {isFromCategory ? (
        <div className="mb-12 animate-fade-up">
          <Link to="/categories">
            <Button variant="ghost" size="sm" className="gap-2 mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Categories
            </Button>
          </Link>
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display text-gradient-gold mb-4">{active}</h1>
            <div className="ornate-divider">
              <span className="text-lg">❖</span>
            </div>
            {categoryInfo && (
              <p className="text-muted-foreground mt-4 leading-relaxed text-lg">
                {categoryInfo.description}
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          <SectionTitle
            eyebrow="The Menu"
            title="A Feast of Flavours"
            subtitle="Tap to add dishes to your thali. Place your order on WhatsApp when ready."
          />

          <div className="flex flex-wrap justify-center gap-2 mb-12 animate-fade-up">
            {(["All", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm tracking-wide border transition-all",
                  active === c
                    ? "bg-gradient-gold text-primary-foreground border-transparent shadow-glow"
                    : "border-border/60 text-foreground/70 hover:text-primary hover:border-primary/40",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((d, i) => (
          <article
            key={d.id}
            className="group bg-card border border-border/40 rounded-xl overflow-hidden hover-lift animate-fade-up"
            style={{ animationDelay: `${(i % 6) * 60}ms` }}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={d.image}
                alt={d.name}
                loading="lazy"
                width={800}
                height={600}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <h3 className="text-xl font-display text-foreground leading-tight">{d.name}</h3>
                <div className="text-primary font-medium whitespace-nowrap">
                  {d.hasDualPricing && d.halfPrice && d.fullPrice ? (
                    <div className="text-sm">
                      {formatINR(d.halfPrice)} / {formatINR(d.fullPrice)}
                    </div>
                  ) : (
                    <span className="text-sm">{formatINR(d.price)}</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[2.5rem]">
                {d.description}
              </p>
              <Button
                onClick={() => handleAddDish(d)}
                className="w-full bg-gradient-warm hover:opacity-90 border border-primary/30 text-white mt-auto text-xs"
                size="sm"
              >
                <Plus className="mr-1 h-3 w-3 flex-shrink-0" />
                <span className="truncate">Add to Thali</span>
              </Button>
            </div>
          </article>
        ))}
      </div>

      {/* Variant Selection Dialog */}
      <Dialog open={!!variantDialog} onOpenChange={(open) => !open && setVariantDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Size</DialogTitle>
            <DialogDescription>
              Select Half Plate or Full Plate for {variantDialog?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button
              onClick={() => handleVariantSelect("half")}
              className="bg-gradient-gold text-primary-foreground hover:opacity-90"
            >
              Half Plate - {variantDialog?.halfPrice ? formatINR(variantDialog.halfPrice) : ""}
            </Button>
            <Button
              onClick={() => handleVariantSelect("full")}
              className="bg-gradient-gold text-primary-foreground hover:opacity-90"
            >
              Full Plate - {variantDialog?.fullPrice ? formatINR(variantDialog.fullPrice) : ""}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
