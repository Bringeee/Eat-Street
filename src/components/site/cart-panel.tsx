import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Minus,
  Plus,
  Trash2,
  CreditCard,
  MapPin,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  LocateOff,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { formatINR, SITE } from "@/lib/site-config";
import { useRazorpay, type PaymentStage } from "@/hooks/useRazorpay";
import { useGeolocation } from "@/hooks/useGeolocation";
import { MAX_DISTANCE_KM } from "@/lib/geolocation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CartPanel() {
  const { items, setQty, remove, clear, total } = useCart();
  const { initiatePayment, scriptLoaded, stage, resetStage } = useRazorpay();
  const geo = useGeolocation();

  const isProcessing = stage !== "idle" && stage !== "success" && stage !== "failed";

  const handlePay = () => {
    if (items.length === 0) return;

    // Check geolocation state
    if (geo.state === "denied") {
      toast.error("Location access denied", {
        description:
          "Please enable location permission in your browser settings to pay online.",
      });
      return;
    }

    if (geo.state === "loading" || geo.state === "idle") {
      toast.info("Getting your location…", {
        description: "Please wait while we verify your location.",
      });
      return;
    }

    if (geo.state === "unavailable") {
      toast.error("Location unavailable", {
        description:
          geo.error || "Could not determine your location. Please check your GPS settings.",
      });
      return;
    }

    if (!geo.withinRange) {
      toast.error(`You're ${geo.distanceKm} km away`, {
        description: `Online payment is only available within ${MAX_DISTANCE_KM} km of ${SITE.name}. Please visit us to pay online!`,
      });
      return;
    }

    // All checks passed — initiate production Razorpay flow
    initiatePayment({
      amountInr: total(),
      description: `Order from ${SITE.name} (${items.length} items)`,
      onSuccess: (paymentId, orderId) => {
        toast.success("Payment successful! 🎉", {
          description: `Payment ID: ${paymentId}`,
        });
        clear();
        // Reset stage after a short delay so user sees the success state
        setTimeout(resetStage, 2000);
      },
      onFailure: (error) => {
        toast.error("Payment failed", { description: error });
        setTimeout(resetStage, 2000);
      },
      onDismiss: () => {
        // User closed checkout without paying — stage auto-resets in hook
      },
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-muted-foreground">
        <div className="text-5xl">🍽️</div>
        <p>Your thali is empty.</p>
        <p className="text-sm">Add dishes from the menu to begin.</p>
      </div>
    );
  }

  return (
    <>
      {/* Cart items */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {items.map((i) => (
          <div
            key={i.dish.id}
            className="flex gap-3 p-3 rounded-lg bg-card border border-border/50"
          >
            <img
              src={i.dish.image}
              alt={i.dish.name}
              className="h-16 w-16 rounded-md object-cover"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{i.dish.name}</p>
              <p className="text-sm text-primary">{formatINR(i.dish.price)}</p>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => setQty(i.dish.id, i.qty - 1)}
                  disabled={isProcessing}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm w-6 text-center">{i.qty}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => setQty(i.dish.id, i.qty + 1)}
                  disabled={isProcessing}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 ml-auto text-destructive"
                  onClick={() => remove(i.dish.id)}
                  disabled={isProcessing}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer — total, distance, stage, pay button */}
      <div className="border-t border-border/40 pt-4 space-y-4">
        {/* Total */}
        <div className="flex justify-between text-lg">
          <span className="text-muted-foreground">Total</span>
          <span className="font-display text-gradient-gold font-semibold">
            {formatINR(total())}
          </span>
        </div>

        {/* Live distance indicator */}
        <LocationBadge geo={geo} />

        {/* Payment stage indicator (shown during processing) */}
        {stage !== "idle" && <StageBadge stage={stage} />}

        {/* Pay button */}
        <Button
          onClick={handlePay}
          disabled={isProcessing || !scriptLoaded || geo.state === "loading"}
          className={cn(
            "w-full text-white shadow-glow transition-all duration-300",
            geo.withinRange && !isProcessing
              ? "bg-gradient-gold hover:opacity-90"
              : "bg-muted-foreground/60 cursor-not-allowed",
          )}
          size="lg"
        >
          {stage === "creating_order" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating order…
            </>
          ) : stage === "checkout_open" ? (
            <>
              <CreditCard className="mr-2 h-4 w-4 animate-pulse" />
              Complete payment…
            </>
          ) : stage === "verifying" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying payment…
            </>
          ) : geo.state === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking location…
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay {formatINR(total())}
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
          onClick={clear}
          disabled={isProcessing}
        >
          Clear cart
        </Button>
      </div>
    </>
  );
}

/* ── Payment Stage Badge ───────────────────────────────────────── */

function StageBadge({ stage }: { stage: PaymentStage }) {
  if (stage === "creating_order") {
    return (
      <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-400/10 rounded-lg px-3 py-2.5 animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        <span>Creating secure payment order…</span>
      </div>
    );
  }

  if (stage === "verifying") {
    return (
      <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-400/10 rounded-lg px-3 py-2.5 animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        <span>Verifying payment with server…</span>
      </div>
    );
  }

  if (stage === "success") {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 rounded-lg px-3 py-2.5">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span className="font-medium">Payment verified successfully!</span>
      </div>
    );
  }

  if (stage === "failed") {
    return (
      <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2.5">
        <XCircle className="h-4 w-4 shrink-0" />
        <span className="font-medium">Payment could not be verified</span>
      </div>
    );
  }

  return null;
}

/* ── Location Badge ────────────────────────────────────────────── */

function LocationBadge({
  geo,
}: {
  geo: ReturnType<typeof import("@/hooks/useGeolocation").useGeolocation>;
}) {
  if (geo.state === "idle" || geo.state === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 rounded-lg px-3 py-2.5 animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span>Detecting your location…</span>
      </div>
    );
  }

  if (geo.state === "denied") {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2.5">
        <LocateOff className="h-4 w-4 shrink-0" />
        <span>Location denied — enable it in browser settings to pay online</span>
      </div>
    );
  }

  if (geo.state === "unavailable") {
    return (
      <div className="flex items-center gap-2 text-sm text-orange-400 bg-orange-400/10 rounded-lg px-3 py-2.5">
        <ShieldAlert className="h-4 w-4 shrink-0" />
        <span>{geo.error || "Could not get your location"}</span>
      </div>
    );
  }

  // granted — show distance
  if (geo.withinRange) {
    return (
      <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-400/10 rounded-lg px-3 py-2.5">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        <div className="flex flex-col">
          <span className="font-medium">Within range — ready to pay!</span>
          <span className="text-xs text-emerald-400/70">
            <MapPin className="inline h-3 w-3 mr-0.5" />
            {geo.distanceKm} km from {SITE.name}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2.5">
      <ShieldAlert className="h-4 w-4 shrink-0" />
      <div className="flex flex-col">
        <span className="font-medium">Too far for online payment</span>
        <span className="text-xs text-red-400/70">
          <MapPin className="inline h-3 w-3 mr-0.5" />
          {geo.distanceKm} km away (max {MAX_DISTANCE_KM} km)
        </span>
      </div>
    </div>
  );
}
