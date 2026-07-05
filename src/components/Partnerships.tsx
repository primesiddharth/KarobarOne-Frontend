"use client";

import Link from "next/link";
import {
  CreditCard,
  Wallet,
  BarChart3,
  Target,
  ShoppingBag,
  Share2,
  Truck,
  Package,
  MessageCircle,
  Receipt,
  Calculator,
  Box,
  type LucideIcon,
} from "lucide-react";

type Partner = { name: string; color: string; icon: LucideIcon };

const COLUMN_1: Partner[] = [
  { name: "Razorpay", color: "#0f172a", icon: CreditCard },
  { name: "PayU", color: "#25b04a", icon: Wallet },
  { name: "PhonePe", color: "#5f259f", icon: Wallet },
  { name: "Paytm", color: "#00b9f1", icon: Wallet },
  { name: "CCAvenue", color: "#e11d48", icon: CreditCard },
  { name: "Stripe", color: "#635bff", icon: CreditCard },
];

const COLUMN_2: Partner[] = [
  { name: "Google Analytics", color: "#f9ab00", icon: BarChart3 },
  { name: "Google Tag Manager", color: "#4285f4", icon: Target },
  { name: "Google Shopping", color: "#34a853", icon: ShoppingBag },
  { name: "Meta Ads", color: "#0866ff", icon: Target },
  { name: "Instagram", color: "#c13584", icon: Share2 },
  { name: "Pinterest", color: "#e60023", icon: Share2 },
];

const COLUMN_3: Partner[] = [
  { name: "Shiprocket", color: "#7c3aed", icon: Truck },
  { name: "Delhivery", color: "#e11d48", icon: Truck },
  { name: "Blue Dart", color: "#004b93", icon: Package },
  { name: "DTDC", color: "#f5811f", icon: Truck },
  { name: "Ekart", color: "#facc15", icon: Package },
  { name: "Browntape", color: "#92400e", icon: Box },
];

const COLUMN_4: Partner[] = [
  { name: "WhatsApp Business", color: "#25d366", icon: MessageCircle },
  { name: "Zoho Books", color: "#e42527", icon: Receipt },
  { name: "Tally", color: "#1d4ed8", icon: Calculator },
  { name: "Unicommerce", color: "#0891b2", icon: Box },
  { name: "Cashfree", color: "#6d28d9", icon: Wallet },
  { name: "Instamojo", color: "#f43f5e", icon: Wallet },
];

function LogoCard({ name, color, icon: Icon }: Partner) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-6 flex flex-col items-center justify-center gap-2 text-center hover:shadow-md transition-shadow">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}1A` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <span className="font-bold text-sm md:text-base leading-tight" style={{ color }}>
        {name}
      </span>
    </div>
  );
}

function MarqueeColumn({
  items,
  direction = "up",
  duration = 24,
}: {
  items: Partner[];
  direction?: "up" | "down";
  duration?: number;
}) {
  const doubled = [...items, ...items];

  return (
    <div className="relative h-[560px] overflow-hidden">
      <div
        className={`flex flex-col gap-4 ${direction === "up" ? "animate-marquee-up" : "animate-marquee-down"}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {doubled.map((partner, i) => (
          <LogoCard key={`${partner.name}-${i}`} {...partner} />
        ))}
      </div>
    </div>
  );
}

export function Partnerships() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: text content */}
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Partnerships
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl">
              KarobarOne partners with India&apos;s leading payment gateways,
              logistics providers, marketing platforms, and business tools. We
              help ambitious Indian entrepreneurs build a complete commerce
              ecosystem by connecting with partners that drive innovation,
              reliability, and growth at every step of their journey.
            </p>
            <Link
              href="/book-demo"
              className="inline-block bg-[#5b4ef9] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#4a3ee0] transition-colors"
            >
              Learn More
            </Link>
          </div>

          {/* Right: vertical auto-scrolling logo marquee, pauses on hover */}
          <div className="marquee-wrap grid grid-cols-2 md:grid-cols-4 gap-4">
            <MarqueeColumn items={COLUMN_1} direction="up" duration={22} />
            <MarqueeColumn items={COLUMN_2} direction="down" duration={28} />
            <MarqueeColumn items={COLUMN_3} direction="up" duration={26} />
            <MarqueeColumn items={COLUMN_4} direction="down" duration={20} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-up {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-50%);
          }
        }
        @keyframes marquee-down {
          from {
            transform: translateY(-50%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-marquee-up {
          animation-name: marquee-up;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .animate-marquee-down {
          animation-name: marquee-down;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .marquee-wrap:hover .animate-marquee-up,
        .marquee-wrap:hover .animate-marquee-down {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}