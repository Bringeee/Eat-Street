import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/shipping-and-delivery")({
  component: ShippingAndDeliveryPage,
  head: () => ({
    meta: [
      { title: "Shipping & Delivery — Eat Street" },
      {
        name: "description",
        content: "Shipping and delivery information for Eat Street food delivery service.",
      },
    ],
  }),
});

function ShippingAndDeliveryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl font-display text-gradient-gold mb-8">Shipping & Delivery</h1>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Delivery Service Area</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {SITE.name} delivers food within a 5-kilometer (5 km) radius of our restaurant location:
            </p>
            <div className="bg-card/30 border border-border/40 rounded-lg p-4 my-4">
              <p className="text-muted-foreground font-semibold">{SITE.address}</p>
              <p className="text-muted-foreground text-sm mt-2">Service Area: 5 km radius</p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To check if your address is within our delivery area, enter your location details at checkout. Our system will automatically verify your address eligibility using GPS coordinates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Delivery Hours</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We offer delivery during the following hours:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Lunch Hours:</strong> 11:00 AM - 3:30 PM</p>
              <p><strong>Dinner Hours:</strong> 6:00 PM - 10:30 PM</p>
              <p className="text-sm mt-4">Orders placed outside these hours will be scheduled for the next available delivery slot.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Delivery Charges</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Delivery charges are calculated based on the distance of your delivery address from our restaurant:
            </p>
            <div className="space-y-3">
              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <p className="text-muted-foreground"><strong>0-2 km:</strong> ₹30 - ₹50</p>
              </div>
              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <p className="text-muted-foreground"><strong>2-3 km:</strong> ₹50 - ₹75</p>
              </div>
              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <p className="text-muted-foreground"><strong>3-5 km:</strong> ₹75 - ₹100</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Exact delivery charges will be displayed at checkout before you place your order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Estimated Delivery Times</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Estimated delivery times vary based on several factors:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Distance from restaurant (0-5 km)</li>
              <li>Current order volume and kitchen load</li>
              <li>Complexity of your order (number of items, special requests)</li>
              <li>Traffic and weather conditions</li>
              <li>Delivery address accessibility</li>
              <li>Peak vs. off-peak hours</li>
            </ul>
            <div className="bg-card/30 border border-border/40 rounded-lg p-4 mt-4">
              <p className="text-muted-foreground font-semibold">Typical Delivery Windows:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm mt-2">
                <li>Standard Orders: 30-45 minutes from order confirmation</li>
                <li>Peak Hours: 45-60 minutes from order confirmation</li>
                <li>Customized Orders: 45-60 minutes from order confirmation</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Delivery Process</h2>
            <div className="space-y-4 mt-4">
              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Step 1: Order Placement</h3>
                <p className="text-muted-foreground text-sm">
                  Select items from our menu and provide your delivery address. Your address is automatically verified for eligibility.
                </p>
              </div>

              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Step 2: Order Confirmation</h3>
                <p className="text-muted-foreground text-sm">
                  After payment is processed, your order is sent to our kitchen. You'll receive a confirmation SMS/email with your order number.
                </p>
              </div>

              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Step 3: Food Preparation</h3>
                <p className="text-muted-foreground text-sm">
                  Our chefs prepare your food fresh to order. You can track the preparation status on your account.
                </p>
              </div>

              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Step 4: Quality Check & Packing</h3>
                <p className="text-muted-foreground text-sm">
                  Food is packed in insulated containers to maintain temperature and freshness. Quality is verified before dispatch.
                </p>
              </div>

              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Step 5: Dispatch & Delivery</h3>
                <p className="text-muted-foreground text-sm">
                  Our delivery personnel picks up your order and heads to your address. You'll receive real-time updates and can contact the delivery person if needed.
                </p>
              </div>

              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Step 6: Delivery Completion</h3>
                <p className="text-muted-foreground text-sm">
                  Your order is delivered to your doorstep. Verify the items before accepting. You'll receive a delivery confirmation notification.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Delivery Instructions</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When placing your order, you can provide special delivery instructions such as:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Door access details (buzzer number, gate code, etc.)</li>
              <li>Building floor and unit information</li>
              <li>Landmark descriptions</li>
              <li>Contact person name and alternate phone number</li>
              <li>Special handling requests</li>
              <li>Timing preferences (leave at door, ring bell, etc.)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Clear instructions help our delivery team locate your address quickly and accurately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Food Packaging & Temperature Control</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We prioritize food freshness and safety:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Hot items packed in insulated containers to maintain warmth</li>
              <li>Cold items provided with cooling elements</li>
              <li>Sealed, tamper-proof packaging for hygiene</li>
              <li>Separately packed items to prevent flavor mixing</li>
              <li>Eco-friendly and food-safe packaging materials</li>
              <li>Sauces and condiments packed separately</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Recipient Requirements</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To ensure smooth delivery:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Someone must be available at the delivery address</li>
              <li>Verify the items match your order before accepting</li>
              <li>Ensure the address gate/door is accessible</li>
              <li>Have payment method ready (if paying on delivery)</li>
              <li>Keep your phone available for contact</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Delivery Delays & Compensation</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Minor Delays (5-15 minutes beyond estimate):</strong> We apologize for the inconvenience. These occasionally occur due to traffic or high order volume.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Significant Delays (15 minutes beyond estimate):</strong> If your order doesn't arrive within 15 minutes of the promised time due to our fault:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Contact us immediately</li>
              <li>Eligible for 30% refund on order value</li>
              <li>Eligible for 20% discount on next order</li>
              <li>Free replacement if food quality is compromised</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We're not liable for delays caused by factors beyond our control (traffic, weather, wrong address provided).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Non-Delivery & Refund</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If your order cannot be delivered for any reason:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>We'll attempt to contact you at the provided phone number</li>
              <li>If unreachable, we'll attempt delivery 2-3 times within 1 hour</li>
              <li>If still unsuccessful, order will be returned and refund processed</li>
              <li>Refund amount depends on when cancellation occurred (see Cancellation Policy)</li>
              <li>Refund credited within 3-5 business days</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Receiving Your Order</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When your order arrives:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Verify all items are included and correct</li>
              <li>Check that packaging is sealed and undamaged</li>
              <li>Verify food temperature and freshness</li>
              <li>Report any issues immediately (within 30 minutes of delivery)</li>
              <li>Consume food while fresh for best experience</li>
              <li>Provide feedback on your delivery experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Issues After Delivery</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you encounter issues after receiving your order:
            </p>
            <div className="space-y-3 mt-4">
              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Damaged or Spilled Items</h3>
                <p className="text-muted-foreground text-sm">
                  Report within 30 minutes with photos. Eligible for replacement or refund.
                </p>
              </div>

              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Missing Items</h3>
                <p className="text-muted-foreground text-sm">
                  Report within 30 minutes. We'll redeliver the missing item free of charge or provide a refund.
                </p>
              </div>

              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Wrong or Incorrect Items</h3>
                <p className="text-muted-foreground text-sm">
                  Report immediately. We'll provide a replacement order or full refund for incorrect items.
                </p>
              </div>

              <div className="border border-border/40 rounded-lg p-4 bg-card/30">
                <h3 className="text-lg font-semibold text-foreground mb-2">Cold or Poor Quality Food</h3>
                <p className="text-muted-foreground text-sm">
                  Report within 30 minutes with details. We'll offer a replacement or refund.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. Safety & Hygiene Standards</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We maintain highest standards of safety:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>FSSAI certified kitchen and equipment</li>
              <li>Regular health and hygiene inspections</li>
              <li>Trained and vaccinated delivery personnel</li>
              <li>Insulated and sanitized delivery containers</li>
              <li>Contact-free delivery options available</li>
              <li>Strict adherence to food handling protocols</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">14. Contact & Support</h2>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>For Delivery Issues:</strong></p>
              <p><strong>Phone:</strong> {SITE.phone}</p>
              <p><strong>Email:</strong> support@eatstreet.com (if applicable)</p>
              <p><strong>Address:</strong> {SITE.address}</p>
              <p className="mt-4">
                <strong>Delivery Support Hours:</strong> During delivery hours or 24/7 via phone
              </p>
              <p className="mt-4 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
