import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, CATEGORY_INFO } from "@/lib/menu-data";
import { SectionTitle } from "@/components/site/section-title";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Menu Categories — Eat Street" },
      {
        name: "description",
        content:
          "Browse our menu by category - Veg Main Course, Starters, Breads, Biryani, and more.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <Link to="/" className="mb-6 inline-block">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      <SectionTitle
        eyebrow="Our Menu"
        title="Choose Your Flavor"
        subtitle="Select a category to explore our delicious dishes."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {CATEGORIES.map((category, index) => {
          const info = CATEGORY_INFO[category];
          return (
            <Link key={category} to="/menu" search={{ category }} className="no-underline">
              <div
                className="group bg-card border border-border/40 rounded-xl overflow-hidden hover-lift animate-fade-up transition-all duration-300 h-full cursor-pointer flex flex-col"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Image - Clickable */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={info.image}
                    alt={category}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-display text-foreground mb-2">{category}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {info.description}
                  </p>
                  <Button className="w-full bg-gradient-warm hover:opacity-90 border border-primary/30 text-white gap-2 mt-auto">
                    Explore Menu
                    <ArrowRight className="h-4 w-4 flex-shrink-0" />
                  </Button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
