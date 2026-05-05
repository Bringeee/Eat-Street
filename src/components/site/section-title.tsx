import { cn } from "@/lib/utils";

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center max-w-2xl mx-auto mb-12 animate-fade-up", className)}>
      {eyebrow && <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">{eyebrow}</p>}
      <h2 className="text-4xl md:text-5xl font-display text-gradient-gold mb-4">{title}</h2>
      <div className="ornate-divider">
        <span className="text-lg">❖</span>
      </div>
      {subtitle && <p className="text-muted-foreground mt-4 leading-relaxed">{subtitle}</p>}
    </div>
  );
}
