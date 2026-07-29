"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import GlassModal from "@/components/GlassModal";

const plans = [
  {
    name: "Starter",
    price: "₹0",
    period: "Subscription Fee",
    description: "Perfect for getting started",
    features: [
      "Basic website setup",
      "5 products",
      "Payment gateway integration",
      "Email support",
      "2% transaction fee"
    ],
    highlight: false
  },
  {
    name: "Growth",
    price: "₹2,999",
    period: "per month",
    description: "For growing businesses",
    features: [
      "Advanced website features",
      "Unlimited products",
      "Marketing tools",
      "WhatsApp integration",
      "Priority support",
      "1.5% transaction fee"
    ],
    highlight: false
  },
  {
    name: "Pro",
    price: "₹5,999",
    period: "per month",
    description: "For established brands",
    features: [
      "Custom design & development",
      "Advanced analytics",
      "Dedicated account manager",
      "API access",
      "24/7 phone support",
      "1% transaction fee"
    ],
    highlight: false
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large-scale operations",
    features: [
      "White-label solution",
      "Custom integrations",
      "Multi-store management",
      "Advanced security",
      "SLA guarantee",
      "Negotiable transaction fee"
    ],
    highlight: false
  }
];

export function Pricing() {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);

  const selectedPlan = selectedPlanIndex !== null ? plans[selectedPlanIndex] : null;
  const isEnterprise = selectedPlanIndex === 3;

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600">Choose the plan that fits your business needs</p>
          <div className="mt-6 inline-block bg-green-100 border border-green-300 rounded-lg px-6 py-3">
            <p className="text-green-800 font-semibold">🎉 Special Offer: ₹0 subscription fee for first 3 months!</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 border ${
                index === 0
                  ? "border-[#5b4ef9] ring-2 ring-[#5b4ef9] ring-opacity-50"
                  : "border-gray-200"
              }`}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#5b4ef9]">{plan.price}</span>
                  <span className="text-gray-600">/ {plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#5b4ef9] bg-opacity-10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#5b4ef9]" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedPlanIndex(index)}
                className={`w-full py-3 rounded-lg transition-colors ${
                  index === 0
                    ? "bg-[#5b4ef9] text-white hover:bg-[#4a3ee0]"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {index === 3 ? "Contact Sales" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Glass modal - plan button click pe khulta hai */}
      <GlassModal
        isOpen={selectedPlan !== null}
        onClose={() => setSelectedPlanIndex(null)}
        title={selectedPlan ? `${selectedPlan.name} Plan` : ""}
      >
        {selectedPlan && (
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{selectedPlan.price}</span>
              <span className="text-white/70">/ {selectedPlan.period}</span>
            </div>

            <ul className="space-y-2">
              {selectedPlan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-white/90">
                  <Check className="w-4 h-4 text-[#8f87ff] flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className="w-full py-3 rounded-lg bg-[#5b4ef9] text-white font-medium
                         hover:bg-[#4a3ee0] transition-colors mt-2"
              onClick={() => {
                // yahan actual signup/contact flow trigger karo
                setSelectedPlanIndex(null);
              }}
            >
              {isEnterprise ? "Contact Sales" : "Continue with " + selectedPlan.name}
            </button>
          </div>
        )}
      </GlassModal>
    </section>
  );
}