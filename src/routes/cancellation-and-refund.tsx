import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/cancellation-and-refund")({
  component: CancellationAndRefundPage,
  head: () => ({
    meta: [
      { title: "Cancellation & Refund Policy — Eat Street" },
      {
        name: "description",
        content: "Cancellation and refund policy for Eat Street restaurant.",
      },
    ],
  }),
});

function CancellationAndRefundPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl font-display text-gradient-gold mb-8">Cancellation & Refund Policy</h1>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Refund Policy</h2>
            <div className="border border-border/40 rounded-lg p-6 bg-card/30">
              <p className="text-foreground text-lg font-semibold mb-2">We do not offer refunds.</p>
              <p className="text-muted-foreground leading-relaxed">
                All orders placed at {SITE.name} are final. Once your order is confirmed and sent to the kitchen, no refunds will be issued.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Cancellation Policy</h2>
            <div className="border border-border/40 rounded-lg p-6 bg-card/30">
              <p className="text-foreground text-lg font-semibold mb-4">To cancel an order, please call us immediately:</p>
              <p className="text-foreground font-semibold text-xl mb-2">{SITE.phone}</p>
              <p className="text-muted-foreground leading-relaxed">
                If you wish to cancel your order, you must contact us by phone as soon as possible. Our team will attempt to stop the order preparation if it hasn't already started. Cancellations are subject to availability and the current stage of order preparation.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong>Please note:</strong> We cannot guarantee cancellations once cooking has begun.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>For Cancellations:</strong></p>
              <p><strong>Phone:</strong> {SITE.phone}</p>
              <p><strong>Address:</strong> {SITE.address}</p>
              <p className="mt-4 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
