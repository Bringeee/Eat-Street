import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { formatINR, SITE } from "@/lib/site-config";
import { toast } from "sonner";
import { DistanceDisplay } from "./distance-display";
// geolocation checks temporarily disabled to allow placing orders regardless of distance

export function CartPanel() {
  const { items, setQty, remove, clear, total } = useCart();
  const { state, distanceKm, withinRange } = useGeolocation();
  // geolocation checks re-enabled
  // Checkout dialog state
  const [openCheckout, setOpenCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [deliveryType, setDeliveryType] = useState<"home" | "dine">("home");
  const [address, setAddress] = useState("");
  const [tableNo, setTableNo] = useState("");

  const handleOrderWhatsApp = () => {
    if (items.length === 0) {
      toast.error("Cart is empty", {
        description: "Please add items before placing an order.",
      });
      return;
    }

    // Open checkout dialog to collect customer details
    setOpenCheckout(true);
  };

  const placeOrder = () => {
    // Validate checkout form before placing order
    if (!customerName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (deliveryType === "home" && !address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }

    if (deliveryType === "dine" && !tableNo.trim()) {
      toast.error("Please enter your table number");
      return;
    }

    const itemList = items
      .map((item) => `${item.qty}x ${item.dish.name} - ${formatINR(item.dish.price * item.qty)}`)
      .join("\n");

    const deliveryInfo = deliveryType === "home" ? `Delivery address: ${address}` : `Dine-in table: ${tableNo}`;

    const message = `Hi! I'd like to place an order:\n\n${itemList}\n\nName: ${customerName}\nDelivery type: ${deliveryType === "home" ? "Home Delivery" : "Dine-in"}\n${deliveryInfo}\n\n*Total: ${formatINR(total())}*\n\nPlease confirm availability and delivery details.`;

    // If geolocation is granted and user is out of range, block placing order
    if (state === "granted" && !withinRange) {
      toast.error("Out of delivery range", { description: `You are ${distanceKm} km away. We only deliver within 5 km.` });
      return;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
    setOpenCheckout(false);
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
      {/* Distance Display */}
      <div className="mb-4 pb-4 border-b border-border/40">
        <DistanceDisplay />
      </div>

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
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm w-6 text-center">{i.qty}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => setQty(i.dish.id, i.qty + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 ml-auto text-destructive"
                  onClick={() => remove(i.dish.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer — total and order button */}
      <div className="border-t border-border/40 pt-4 space-y-4">
        {/* Total */}
        <div className="flex justify-between text-lg">
          <span className="text-muted-foreground">Total</span>
          <span className="font-display text-gradient-gold font-semibold">
            {formatINR(total())}
          </span>
        </div>

        {/* Out of range warning */}
        {state === "granted" && !withinRange && (
          <div className="flex gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
            <MessageCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-xs text-destructive">You are {distanceKm} km away. We only deliver within 5 km.</p>
          </div>
        )}

        {/* Order on WhatsApp button opens checkout dialog */}
        <div>
          <Button onClick={() => setOpenCheckout(true)} disabled={state === "granted" && !withinRange} className="w-full text-white shadow-glow transition-all duration-300 bg-gradient-gold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed" size="lg">
            <MessageCircle className="mr-2 h-4 w-4" />
            Order on WhatsApp
          </Button>

          {openCheckout && (
            <Dialog open={openCheckout} onOpenChange={setOpenCheckout}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Order details</DialogTitle>
                  <DialogDescription>Enter your details to place the order.</DialogDescription>
                </DialogHeader>

                <div className="space-y-3 mt-4">
                  <label className="text-sm">Name</label>
                  <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Your name" />

                  <label className="text-sm">Delivery type</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setDeliveryType("home")} className={`px-3 py-2 rounded-md border ${deliveryType === "home" ? "bg-primary text-white" : "bg-card"}`}>
                      Home Delivery
                    </button>
                    <button type="button" onClick={() => setDeliveryType("dine")} className={`px-3 py-2 rounded-md border ${deliveryType === "dine" ? "bg-primary text-white" : "bg-card"}`}>
                      Dine-in
                    </button>
                  </div>

                  {deliveryType === "home" ? (
                    <div>
                      <label className="text-sm">Address</label>
                      <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city, landmark" />
                    </div>
                  ) : (
                    <div>
                      <label className="text-sm">Table number</label>
                      <Input value={tableNo} onChange={(e) => setTableNo(e.target.value)} placeholder="Table #" />
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => setOpenCheckout(false)} variant="ghost">Cancel</Button>
                    <Button onClick={placeOrder} className="ml-auto">Place order</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
          onClick={clear}
        >
          Clear cart
        </Button>
      </div>
    </>
  );
}
