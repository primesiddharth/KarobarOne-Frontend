"use client";

import Link from "next/link";

const COLUMN_1 = ["Razorpay", "PayU", "PhonePe", "Paytm", "CCAvenue", "Stripe"];
const COLUMN_2 = ["Google Analytics", "Google Tag Manager", "Google Shopping", "Meta Ads", "Instagram", "Pinterest"];
const COLUMN_3 = ["Shiprocket", "Delhivery", "Blue Dart", "DTDC", "Ekart", "Browntape"];
const COLUMN_4 = ["WhatsApp Business", "Zoho Books", "Tally", "Unicommerce", "Cashfree", "Instamojo"];

function MarqueeColumn({
  items,
  direction = "up",
  duration = 24,
}: {
  items: string[];
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
        {doubled.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="bg-white rounded-2xl shadow-md px-6 py-8 flex items-center justify-center text-center"
          >
            <span className="text-gray-800 font-semibold text-sm md:text-base">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Partnerships() {
  return (
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: text content */}
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Partnerships
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl">
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