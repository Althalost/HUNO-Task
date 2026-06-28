import Navbar from "@/components/Navbar";
import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
            💎 Simple, transparent pricing
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="text-lg text-slate-600">
            Start for free. Upgrade when you need more.
          </p>
        </div>

        <div className="flex justify-center">
          <PricingTable
            newSubscriptionRedirectUrl="/dashboard"
            appearance={{
              variables: {
                colorPrimary: "#4f46e5",
                borderRadius: "0.75rem",
              },
              elements: {
                card: "shadow-lg border border-slate-200/60 rounded-2xl",
                pricingTableCard: "rounded-2xl",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
