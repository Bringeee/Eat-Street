import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";

// ─── Helpers ──────────────────────────────────────────────────────

function getRazorpayInstance() {
  const key_id = process.env.VITE_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error(
      "Razorpay credentials are missing. Set VITE_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.",
    );
  }

  return new Razorpay({ key_id, key_secret });
}

// ─── Create Order ─────────────────────────────────────────────────

/**
 * Server function: creates a Razorpay order.
 * Called from the client before opening the checkout form.
 * The KEY_SECRET never leaves the server.
 */
export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      /** Amount in INR (not paise) — the server converts to paise */
      amountInr: z.number().positive(),
      /** Human-readable receipt identifier */
      receipt: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: Math.round(data.amountInr * 100), // convert ₹ → paise
      currency: "INR",
      receipt: data.receipt || `rcpt_${Date.now()}`,
      notes: {
        source: "eat-street-web",
      },
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  });

// ─── Verify Payment ───────────────────────────────────────────────

/**
 * Server function: verifies the Razorpay payment signature.
 * Uses HMAC SHA256(order_id + "|" + payment_id, KEY_SECRET).
 * Returns { verified: true } only if the signature is authentic.
 */
export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      razorpay_order_id: z.string(),
      razorpay_payment_id: z.string(),
      razorpay_signature: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      throw new Error("RAZORPAY_KEY_SECRET is not configured on the server.");
    }

    const body = data.razorpay_order_id + "|" + data.razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    const verified = expectedSignature === data.razorpay_signature;

    return {
      verified,
      paymentId: verified ? data.razorpay_payment_id : null,
      orderId: verified ? data.razorpay_order_id : null,
    };
  });
