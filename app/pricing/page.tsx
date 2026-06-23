import Navbar from "@/components/Navbar";
import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="text-lg text-slate-600">
            Select the perfect plan for your needs and start creating unlimited
            boards.
          </p>
        </div>

        <div className="flex justify-center">
          <PricingTable
            newSubscriptionRedirectUrl="/dashboard"
            appearance={{
              variables: {
                colorPrimary: "#4f46e5",
                borderRadius: "0.5rem",
              },
              elements: {
                card: "shadow-md border border-slate-200/60 rounded-xl",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
