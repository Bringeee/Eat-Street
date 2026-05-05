import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/cancellation-and-refund")({
  component: CancellationAndRefundPage,
  head: () => ({
    meta: [
      { title: "Cancellation & Refund Policy — Eat Street" },
      {
        name: "description",
        content: "Cancellation and refund policy for Eat Street food delivery service.",
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
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Cancellation Policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At {SITE.name}, we understand that plans change. We offer flexible cancellation options depending on the order status:
            </p>

            <div className="space-y-4 mt-4">
              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Stage 1: Before Confirmation (First 5 Minutes)</h3>
                <p className="text-muted-foreground text-sm">
                  <strong>Refund:</strong> 100% refund + full cancellation with no deductions
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  During this period, your order is being reviewed for feasibility and availability. You can cancel anytime without charges.
                </p>
              </div>

              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Stage 2: After Confirmation (5-15 Minutes)</h3>
                <p className="text-muted-foreground text-sm">
                  <strong>Refund:</strong> 85% refund (15% deduction)
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Your order has been confirmed and sent to the kitchen. This deduction covers preparation initiation and operational costs.
                </p>
              </div>

              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Stage 3: Preparation Phase (15+ Minutes)</h3>
                <p className="text-muted-foreground text-sm">
                  <strong>Refund:</strong> 70% refund (30% deduction)
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Your order is actively being prepared. Ingredients may have been sourced and cooking initiated.
                </p>
              </div>

              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Stage 4: Ready for Delivery</h3>
                <p className="text-muted-foreground text-sm">
                  <strong>Refund:</strong> 50% refund (50% deduction) or order rescheduling available
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Your order is packed and ready. You may request rescheduled delivery or accept a 50% refund.
                </p>
              </div>

              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Stage 5: Out for Delivery</h3>
                <p className="text-muted-foreground text-sm">
                  <strong>Refund:</strong> Not applicable - delivery in progress
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Your order cannot be cancelled once the delivery personnel is en route. However, you may refuse delivery and receive a 50% refund.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. How to Cancel an Order</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To cancel your order, please call us directly at:
            </p>
            <div className="bg-card/30 border border-border/40 rounded-lg p-4 my-4">
              <p className="text-foreground font-semibold text-lg">{SITE.phone}</p>
              <p className="text-muted-foreground text-sm mt-2">
                Have your order number ready when you call. Our team will process your cancellation request immediately.
              </p>
            </div>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Important:</strong> Cancellation must be requested as soon as possible. The refund amount will depend on the stage of your order (see cancellation stages above).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Refund Processing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Processing Time:</strong> Refunds are processed within 3-5 business days from the cancellation date.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Payment Method:</strong> Refunds are credited back to the original payment method used (credit card, debit card, or digital wallet).
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Tracking:</strong> You can track your refund status in your account under "Transaction History" or contact us at {SITE.phone}.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Note:</strong> Your bank or payment provider may take additional time to reflect the refund in your account (typically 2-3 business days).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Special Circumstances</h2>
            <div className="space-y-4 mt-4">
              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Order Rejected Due to Address Issue</h3>
                <p className="text-muted-foreground text-sm">
                  If your order is cancelled because your delivery address is outside our 5km service area, a 100% refund will be issued immediately.
                </p>
              </div>

              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Item Out of Stock</h3>
                <p className="text-muted-foreground text-sm">
                  If a menu item becomes unavailable after order confirmation, we'll contact you immediately to offer alternatives or process a 100% refund.
                </p>
              </div>

              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Non-Delivery</h3>
                <p className="text-muted-foreground text-sm">
                  If your order is not delivered within 45 minutes of the estimated delivery time due to our fault, you're eligible for a 30% refund in addition to a replacement order discount.
                </p>
              </div>

              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Incorrect or Damaged Order</h3>
                <p className="text-muted-foreground text-sm">
                  Report within 30 minutes of delivery. We'll offer a replacement or full refund for the incorrect/damaged items.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Non-Refundable Situations</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">Refunds will NOT be issued for:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Change of mind after delivery is completed</li>
              <li>Personal dissatisfaction with taste (subjective preferences)</li>
              <li>Delays caused by customer-provided incorrect address</li>
              <li>Orders cancelled due to customer non-availability at delivery address</li>
              <li>Refusal to accept delivery without valid reason</li>
              <li>Food quality issues arising from improper storage after delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Rescheduling Orders</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Instead of cancelling, you can request to reschedule your order to a different time within 24 hours:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>No rescheduling fees or charges apply</li>
              <li>Rescheduling must be done before the order enters the delivery phase</li>
              <li>Items must remain available at the new scheduled time</li>
              <li>Contact us at {SITE.phone} or through the app to reschedule</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Promotional and Discount Refunds</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Applied Discounts:</strong> If you cancelled an order with an applied discount or promotional code, the refund will include the discounted amount. The discount code may or may not be reusable depending on its terms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Gift Cards:</strong> If payment was made via gift card, the refund will be credited back to your gift card balance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Disputed Charges</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you believe you've been incorrectly charged or there's an error in your refund:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Contact us at {SITE.phone} with your order number</li>
              <li>Provide details of the dispute</li>
              <li>We will investigate and respond within 5 business days</li>
              <li>If you filed a chargeback with your bank, notify us immediately</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Refund Guarantee</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We're committed to customer satisfaction. If you're not satisfied with your experience, reach out to us, and we'll work to make it right. In most cases, we'll offer:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>A replacement order</li>
              <li>A partial or full refund</li>
              <li>Discount code for future orders</li>
              <li>Combination of the above</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Us</h2>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>For Cancellations & Refunds:</strong></p>
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
