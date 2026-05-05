import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useReviews, useAdmin } from "@/lib/store";
import { SectionTitle } from "@/components/site/section-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — Eat Street" },
      {
        name: "description",
        content: "Read what our guests are saying — and share your own experience.",
      },
    ],
  }),
  component: Reviews,
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
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(i)}
          className={cn("transition-transform", onChange && "hover:scale-125 cursor-pointer")}
        >
          <Star
            className={cn(i <= value ? "text-gold fill-gold" : "text-muted-foreground/40")}
            style={{ width: size, height: size }}
          />
        </button>
      ))}
    </div>
  );
}

function Reviews() {
  const { reviews, add, remove } = useReviews();
  const isAdmin = useAdmin((s) => s.isAdmin);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      toast.error("Please add your name and a review.");
      return;
    }
    add({ name: name.trim().slice(0, 60), rating, text: text.trim().slice(0, 500) });
    setName("");
    setText("");
    setRating(5);
    toast.success("Thank you for your review!");
  };

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="container mx-auto px-4 py-20">
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
          onSubmit={submit}
          className="lg:col-span-1 bg-card border border-border/40 rounded-xl p-6 space-y-4 h-fit lg:sticky lg:top-24 animate-fade-up"
        >
          <h3 className="font-display text-2xl text-gradient-gold">Share your experience</h3>
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
          />
          <div>
            <p className="text-sm text-muted-foreground mb-2">Your rating</p>
            <Stars value={rating} onChange={setRating} size={26} />
          </div>
          <Textarea
            placeholder="Tell us about your meal..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            maxLength={500}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-glow"
          >
            Submit Review
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
                      onClick={() => {
                        remove(r.id);
                        toast.success("Review deleted");
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
    </div>
  );
}
