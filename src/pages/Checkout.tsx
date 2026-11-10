import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingWidgets from "@/components/FloatingWidgets";
export default function Checkout() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground text-center">
            Checkout
          </h1>
          <p className="mt-3 text-muted-foreground text-center">
            Complete your payment on the Paystack checkout page.
          </p>
        </div>
      </main>
      <Footer />
      <FloatingWidgets />
    </div>
  );
}
