import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site-config";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — Eat Street" },
      {
        name: "description",
        content: "Privacy Policy for Eat Street restaurant and food delivery service.",
      },
    ],
  }),
});

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-4xl font-display text-gradient-gold mb-8">Privacy Policy</h1>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              At {SITE.name}, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our food delivery services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We collect information in the following ways:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Personal Information:</strong> Name, phone number, email address, and delivery address</li>
              <li><strong>Payment Information:</strong> Credit/debit card details processed securely through Razorpay</li>
              <li><strong>Location Data:</strong> Your GPS coordinates to determine delivery eligibility within 5km radius</li>
              <li><strong>Order History:</strong> Details of your orders, preferences, and dietary requirements</li>
              <li><strong>Device Information:</strong> IP address, browser type, and device information for security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We use collected information for:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Processing and delivering your food orders</li>
              <li>Verifying delivery location eligibility (within 5km radius)</li>
              <li>Payment processing through our payment partner</li>
              <li>Sending order confirmations and updates</li>
              <li>Improving our menu and service quality</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Responding to your inquiries and customer support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Delivery Service Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our food delivery service is available within a 5-kilometer radius of our restaurant location at {SITE.address}. We collect and use your location data to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Determine if your delivery address is within our service area</li>
              <li>Calculate accurate delivery time estimates</li>
              <li>Optimize delivery routes for faster service</li>
              <li>Ensure food quality upon arrival</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Payment Information Security</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We partner with Razorpay for secure payment processing. Your payment information is encrypted and never stored on our servers. Razorpay complies with PCI DSS standards. We do not have access to your complete card details—only transaction information is retained for order records.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">We may share your information with:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Delivery Partners:</strong> Limited information necessary for delivery</li>
              <li><strong>Payment Processors:</strong> Razorpay for payment processing</li>
              <li><strong>Service Providers:</strong> Third parties assisting in operations (hosting, analytics)</li>
              <li><strong>Legal Requirements:</strong> When required by law or court order</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We never sell or rent your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request data portability</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Contact us at {SITE.phone} or through our website to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Order history may be retained for accounting and customer service purposes. You can request deletion of your account and associated data at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your information, including SSL encryption, secure servers, and regular security audits. However, no online transmission is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy periodically. Changes will be effective immediately upon posting to our website. Your continued use of our services constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our privacy practices:
            </p>
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
