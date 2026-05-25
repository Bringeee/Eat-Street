import { useCallback, useEffect, useRef, useState } from "react";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "@/lib/razorpay";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export type PaymentStage =
  | "idle"
  | "creating_order"   // server is creating a Razorpay order
  | "checkout_open"     // Razorpay checkout UI is visible
  | "verifying"         // server is verifying the signature
  | "success"
  | "failed";

/**
 * Production-ready Razorpay hook.
 *
 * Flow:
 *  1. Client calls initiatePayment(amountInr)
 *  2. Server creates a Razorpay order (KEY_SECRET stays server-side)
 *  3. Client opens Razorpay checkout with the order_id
 *  4. On payment success, client sends response to server
 *  5. Server verifies HMAC SHA256 signature
 *  6. Only then is the payment marked as successful
 */
export function useRazorpay() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [stage, setStage] = useState<PaymentStage>("idle");
  const loadedRef = useRef(false);

  // Load the Razorpay checkout script once
  useEffect(() => {
    if (
      loadedRef.current ||
      document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`)
    ) {
      setScriptLoaded(true);
      loadedRef.current = true;
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
      loadedRef.current = true;
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
    };
    document.body.appendChild(script);
  }, []);

  const initiatePayment = useCallback(
    async ({
      amountInr,
      description,
      onSuccess,
      onFailure,
      onDismiss,
    }: {
      amountInr: number;
      description?: string;
      onSuccess: (paymentId: string, orderId: string) => void;
      onFailure: (error: string) => void;
      onDismiss?: () => void;
    }) => {
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;

      if (!key) {
        onFailure("Razorpay key is not configured. Please contact the restaurant.");
        return;
      }

      if (!window.Razorpay) {
        onFailure("Payment gateway is still loading. Please try again.");
        return;
      }

      // ── Step 1: Create order on server ────────────────────────
      setStage("creating_order");

      let orderId: string;
      try {
        const order = await createRazorpayOrder({
          data: {
            amountInr,
            receipt: `web_${Date.now()}`,
          },
        });
        orderId = order.orderId;
      } catch (err) {
        setStage("failed");
        onFailure(
          err instanceof Error
            ? err.message
            : "Failed to create payment order. Please try again.",
        );
        return;
      }

      // ── Step 2: Open Razorpay checkout ────────────────────────
      setStage("checkout_open");

      const options: RazorpayOptions = {
        key,
        amount: Math.round(amountInr * 100),
        currency: "INR",
        name: "Eat Street Restaurant",
        description: description || "Food Order Payment",
        order_id: orderId,
        theme: {
          color: "#b8860b",
        },
        modal: {
          ondismiss: () => {
            setStage("idle");
            onDismiss?.();
          },
          confirm_close: true,
        },
        handler: async (response) => {
          // ── Step 3: Verify signature on server ──────────────
          setStage("verifying");

          try {
            const result = await verifyRazorpayPayment({
              data: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });

            if (result.verified) {
              setStage("success");
              onSuccess(result.paymentId!, result.orderId!);
            } else {
              setStage("failed");
              onFailure("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            setStage("failed");
            onFailure(
              err instanceof Error
                ? err.message
                : "Could not verify payment. Please contact support.",
            );
          }
        },
      };

      try {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", () => {
          setStage("failed");
          onFailure("Payment failed. Please try again.");
        });
        rzp.open();
      } catch (err) {
        setStage("failed");
        onFailure(`Could not open payment gateway: ${err}`);
      }
    },
    [],
  );

  const resetStage = useCallback(() => setStage("idle"), []);

  return { scriptLoaded, stage, initiatePayment, resetStage };
}
