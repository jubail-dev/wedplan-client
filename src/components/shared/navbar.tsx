
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E9DED2] bg-[#FAF7F2]/95 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="13"
              cy="17"
              r="8"
              stroke="#D97985"
              strokeWidth="2"
            />
            <circle
              cx="21"
              cy="17"
              r="8"
              stroke="#D6B477"
              strokeWidth="2"
            />
          </svg>

          <span className="font-heading text-2xl font-semibold tracking-tight text-[#292524]">
            WedPlan
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[#57534E] transition-colors hover:text-[#D97985]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-[#57534E] transition-colors hover:text-[#D97985]"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-[#D97985] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#C56573] hover:shadow-md"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 text-[#292524] transition-colors hover:bg-[#F1E3C8] md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-[#E9DED2] bg-[#FAF7F2] px-5 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium text-[#57534E] transition-colors hover:text-[#D97985]"
              >
                {link.name}
              </Link>
            ))}

            <div className="flex flex-col gap-3 border-t border-[#E9DED2] pt-4">
              <Link
                href="/sign-in"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium text-[#57534E]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D97985] px-6 py-3 text-sm font-semibold text-white"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
