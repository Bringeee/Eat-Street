import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionTitle } from "@/components/site/section-title";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import g1 from "@/assets/gallery/interior-1.jpg";
import g2 from "@/assets/gallery/tandoor.jpg";
import g3 from "@/assets/gallery/spices.jpg";
import g4 from "@/assets/gallery/thali.jpg";
import g5 from "@/assets/gallery/dining-room.jpg";
import g6 from "@/assets/gallery/interior-2.jpg";

const IMAGES = [
  { src: g1, alt: "Lantern-lit dining hall" },
  { src: g4, alt: "Royal thali platter" },
  { src: g2, alt: "Tandoor oven flames" },
  { src: g6, alt: "Interior view of the restaurant" },
  { src: g3, alt: "Indian spice palette" },
  { src: g5, alt: "Private dining room" },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Eat Street" },
      {
        name: "description",
        content: "Step inside Eat Street — our kitchen, dining rooms, and signature dishes.",
      },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-20">
      <SectionTitle
        eyebrow="Step Inside"
        title="Our Gallery"
        subtitle="A visual journey through our kitchen, our dishes, and our home."
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
        {IMAGES.map((img, i) => (
          <button
            key={i}
            onClick={() => setOpen(img.src)}
            className={`group relative overflow-hidden rounded-xl bg-card animate-fade-up ${i === 0 || i === 3 ? "md:row-span-2 md:aspect-[3/4]" : "aspect-square"}`}
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

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-0">
          {open && <img src={open} alt="" className="w-full h-auto rounded-xl shadow-elegant" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
