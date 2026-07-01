"use client"
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/Logo.jpeg"
              alt="Karobar Logo"
              width={50}
              height={50}
              className="rounded-md object-contain"
            />
            <span className="text-xl font-semibold text-gray-900">KarobarOne</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-700 hover:text-[#5b4ef9] transition-colors">Home</a>
            <a href="#offerings" className="text-gray-700 hover:text-[#5b4ef9] transition-colors">Offerings</a>
            <a href="#about" className="text-gray-700 hover:text-[#5b4ef9] transition-colors">About</a>
            <a href="#testimonials" className="text-gray-700 hover:text-[#5b4ef9] transition-colors">Testimonials</a>
            <a href="#pricing" className="text-gray-700 hover:text-[#5b4ef9] transition-colors">Pricing</a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/book-demo"
              className="border border-[#5b4ef9] text-[#5b4ef9] px-6 py-2 rounded-lg hover:bg-[#5b4ef9] hover:text-white transition-colors"
            >
              Book a Demo
            </Link>
            <Link
              href="/login"
              className="bg-[#5b4ef9] text-white px-6 py-2 rounded-lg hover:bg-[#4a3ee0] transition-colors"
            >
              Login
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden bg-[#5b4ef9] p-2 rounded-lg"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu with Animation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-4 border-t border-gray-200">
          <div className="flex flex-col gap-4 pt-4">
            <a href="#home" className="text-gray-700 hover:text-[#5b4ef9] transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Home</a>
            <a href="#offerings" className="text-gray-700 hover:text-[#5b4ef9] transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Offerings</a>
            <a href="#about" className="text-gray-700 hover:text-[#5b4ef9] transition-colors py-2" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#testimonials" className="text-gray-700 hover:text-[#5b4ef9] transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Testimonials</a>
            <a href="#pricing" className="text-gray-700 hover:text-[#5b4ef9] transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            <a href="#blog" className="text-gray-700 hover:text-[#5b4ef9] transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Blog</a>
            <a href="#careers" className="text-gray-700 hover:text-[#5b4ef9] transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Careers</a>
            <Link
              href="/book-demo"
              className="border border-[#5b4ef9] text-[#5b4ef9] px-6 py-2 rounded-lg hover:bg-[#5b4ef9] hover:text-white transition-colors text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Book a Demo
            </Link>
            <Link
              href="/login"
              className="bg-[#5b4ef9] text-white px-6 py-2 rounded-lg hover:bg-[#4a3ee0] transition-colors text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}