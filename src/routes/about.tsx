import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle } from "@/components/site/section-title";
import { SITE } from "@/lib/site-config";
import founderImg from "@/assets/gallery/chef.jpg";
import interiorImg from "@/assets/gallery/interior-1.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Eat Street" },
      {
        name: "description",
        content: `The story of ${SITE.name}, founded by ${SITE.founder} in ${SITE.established}.`,
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="container mx-auto px-4 py-20">
      <SectionTitle eyebrow="Our Heritage" title="A Family Story, Slow-Cooked" />

      <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <div className="relative animate-fade-up">
          <img
            src={founderImg}
            alt={SITE.founder}
            className="rounded-xl shadow-elegant w-full"
            loading="lazy"
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
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
            <div>
              <div className="text-2xl font-display text-gradient-gold">
                {new Date().getFullYear() - SITE.established}+
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Years</div>
            </div>
            <div>
              <div className="text-2xl font-display text-gradient-gold">3</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                Generations
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 max-w-5xl mx-auto">
        <img
          src={interiorImg}
          alt="Restaurant interior"
          className="rounded-xl w-full shadow-elegant animate-fade-up"
          loading="lazy"
        />
        <p className="text-center text-muted-foreground mt-6 italic font-display text-xl">
          "Every meal is a small act of remembrance."
        </p>
      </div>
    </div>
  );
}
