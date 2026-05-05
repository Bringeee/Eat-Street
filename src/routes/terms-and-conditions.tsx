import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/terms-and-conditions")({
  component: TermsAndConditionsPage,
  head: () => ({
    meta: [
      { title: "Terms and Conditions — Eat Street" },
      {
        name: "description",
        content: "Terms and Conditions for using Eat Street restaurant and food delivery service.",
      },
    ],
  }),
});

function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl font-display text-gradient-gold mb-8">Terms and Conditions</h1>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using the {SITE.name} website and food delivery services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Services Provided</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {SITE.name} provides food delivery services within a 5-kilometer radius of our restaurant location ({SITE.address}). We reserve the right to refuse service outside this delivery area.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We offer a curated menu of authentic Indian cuisine prepared fresh to order. Menu items, prices, and availability are subject to change without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You must:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Be at least 18 years old to place orders</li>
              <li>Provide accurate and complete information</li>
              <li>Have a valid delivery address within our 5km service area</li>
              <li>Provide valid payment information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Order Placement and Acceptance</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Placing an order on our website constitutes an offer to purchase. We reserve the right to accept or reject any order, including orders that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Violate these terms</li>
              <li>Are outside our delivery area</li>
              <li>Cannot be fulfilled due to menu item unavailability</li>
              <li>Appear to be fraudulent or suspicious</li>
              <li>Violate health and safety regulations</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Order confirmation will be sent via email or SMS once accepted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Pricing and Payment</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Prices displayed on our website are in Indian Rupees (INR) and include applicable taxes. Additional charges may apply for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Delivery fees (calculated based on distance)</li>
              <li>Special requests or customizations</li>
              <li>Packaging and handling</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Payment must be made through Razorpay. We accept all major credit cards, debit cards, and digital payment methods. By placing an order, you authorize us to charge your payment method for the full order amount including delivery fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Delivery Area and Time</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We deliver within 5 kilometers of our restaurant location. Delivery time estimates are approximate and may vary based on:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Current order volume</li>
              <li>Distance and traffic conditions</li>
              <li>Weather conditions</li>
              <li>Delivery address accessibility</li>
              <li>Special requests or customizations</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We are not liable for delays beyond reasonable circumstances. Delivery is attempted to your provided address. You are responsible for ensuring someone is available to receive the order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Food Quality and Allergies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              While we take great care in preparing your food, we cannot guarantee complete allergen-free preparation. Please inform us of any allergies when placing your order. Menu descriptions are based on standard recipes and may not include all ingredients.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If you receive damaged, incorrect, or unsatisfactory items, contact us within 30 minutes of delivery for resolution.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Delivery Address Verification</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You agree to provide accurate delivery address information. We use GPS location data to verify delivery eligibility within our 5km service area. Incorrect addresses may result in:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Order cancellation</li>
              <li>Forfeiture of payment</li>
              <li>Extended delivery times</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Modification and Cancellation</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong>Cancellations:</strong> Orders can be cancelled within 5 minutes of placement for a full refund. After preparation begins, cancellations are subject to 30% deduction of order value. Refunds will be processed within 3-5 business days.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Modifications:</strong> Special requests and modifications must be communicated at the time of order placement. We cannot guarantee modifications after the order is confirmed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. User Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You agree to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Provide accurate information</li>
              <li>Respect our staff and delivery personnel</li>
              <li>Not misuse the website or services</li>
              <li>Not place orders as a joke or test</li>
              <li>Accept responsibility for payment</li>
              <li>Not engage in fraudulent activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {SITE.name} is provided on an "as-is" basis. We are not liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Delays or failures in delivery due to circumstances beyond our control</li>
              <li>Food quality issues from storage or handling after delivery</li>
              <li>Loss of enjoyment or disappointment with food</li>
              <li>Any indirect or consequential damages</li>
              <li>Website outages or technical errors</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Our total liability is limited to the order amount paid.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on our website, including text, images, recipes, and design, is the property of {SITE.name} or our suppliers. You may not reproduce, distribute, or transmit this content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. Dispute Resolution</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In case of disputes, please contact us at {SITE.phone}. We will attempt to resolve issues amicably. If resolution cannot be achieved, disputes will be resolved according to applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">14. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Changes are effective immediately upon posting. Continued use of our services constitutes acceptance of updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">15. Contact Information</h2>
            <div className="space-y-2 text-muted-foreground">
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
