"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, TrendingUp, Users, DollarSign, ShoppingCart } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const videoWrapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: videoWrapRef,
    offset: ["start 0.9", "start 0.2"], // video viewport me aate hi expand start
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.75, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], [24, 0]);

  return (
    <section id="home" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Grow Your Business
            <br />
            <span className="text-[#5b4ef9]">Profitably</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Everything you need to scale your business from website to shipping, all in one platform
          </p>
          <Link href="/questionaree" className="bg-[#5b4ef9] text-white px-8 py-4 rounded-lg hover:bg-[#4a3ee0] transition-colors inline-flex items-center gap-2">
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Scroll-maximize video (StoreHippo style) */}
        <div ref={videoWrapRef} className="mb-16 flex justify-center">
          <motion.div
            style={{ scale, borderRadius }}
            className="w-full max-w-5xl aspect-video overflow-hidden shadow-2xl"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              src="/videos/hero-video.mp4"
            />
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          <div className="bg-gradient-to-br from-[#5b4ef9] to-[#4a3ee0] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-semibold">Business Dashboard</h3>
              <div className="bg-white/20 px-3 py-1 rounded-full text-white text-sm">
                Live
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-white" />
                  <span className="text-white/80 text-sm">Revenue</span>
                </div>
                <p className="text-white text-2xl font-bold">₹2.4L</p>
                <p className="text-green-300 text-xs">+23% this month</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-white" />
                  <span className="text-white/80 text-sm">Customers</span>
                </div>
                <p className="text-white text-2xl font-bold">1,234</p>
                <p className="text-green-300 text-xs">+12% this month</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-4 h-4 text-white" />
                  <span className="text-white/80 text-sm">Orders</span>
                </div>
                <p className="text-white text-2xl font-bold">456</p>
                <p className="text-green-300 text-xs">+8% this month</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-white" />
                  <span className="text-white/80 text-sm">Profit</span>
                </div>
                <p className="text-white text-2xl font-bold">₹48K</p>
                <p className="text-green-300 text-xs">+15% this month</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="h-2 bg-[#5b4ef9] rounded-full mb-2" style={{ width: '75%' }}></div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-lg font-semibold text-gray-900">3.2%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="h-2 bg-[#5b4ef9] rounded-full mb-2" style={{ width: '60%' }}></div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-lg font-semibold text-gray-900">₹1,850</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="h-2 bg-[#5b4ef9] rounded-full mb-2" style={{ width: '90%' }}></div>
              <p className="text-sm text-gray-600">Customer Satisfaction</p>
              <p className="text-lg font-semibold text-gray-900">4.8/5</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}