
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Heart } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FAF7F2]">
      <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-8 lg:gap-16">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E9DED2] bg-white/70 px-4 py-2">
            <Heart size={15} className="text-[#D97985]" />
            <span className="text-xs font-medium tracking-wide text-[#8F4653]">
              YOUR DREAM WEDDING STARTS HERE
            </span>
          </div>

          <h1 className="font-heading text-5xl font-semibold leading-[1.15] tracking-tight text-[#292524] sm:text-6xl lg:text-7xl">
            Make Your
            <span className="block text-[#D97985]">Special Day</span>
            Truly Unforgettable.
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-[#78716C] sm:text-lg">
            Discover trusted wedding vendors, explore beautiful services,
            and bring every detail of your dream celebration together
            with WedPlan.
          </p>

          <div className="mt-9">
            <Link
              href="/services"
              className="inline-flex items-center gap-3 rounded-full bg-[#D97985] px-7 py-4 text-sm font-semibold text-white shadow-lg shadow-[#D97985]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#C56573] hover:shadow-xl"
            >
              Explore Wedding Services
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-4 text-sm text-[#78716C]">
            <div className="flex -space-x-2">
              <span className="h-9 w-9 rounded-full border-2 border-[#FAF7F2] bg-[#E8C6B8]" />
              <span className="h-9 w-9 rounded-full border-2 border-[#FAF7F2] bg-[#D9B8A7]" />
              <span className="h-9 w-9 rounded-full border-2 border-[#FAF7F2] bg-[#C9A58D]" />
            </div>

            <p>
              <span className="font-semibold text-[#292524]">
                Every detail matters.
              </span>
              <br />
              Let us help you plan it beautifully.
            </p>
          </div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[540px]"
        >
          <div className="absolute -right-5 -top-5 h-40 w-40 rounded-full bg-[#F1E3C8]/60 blur-3xl" />
          <div className="absolute -bottom-8 -left-5 h-48 w-48 rounded-full bg-[#FCECEF] blur-3xl" />

          <div className="relative overflow-hidden rounded-[180px_180px_24px_24px] border-[8px] border-white shadow-2xl shadow-[#8F765B]/15">
            <div className="aspect-[4/5] bg-gradient-to-br from-[#E8CFC2] via-[#F5E5D9] to-[#D9B8A7]">
              <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                <Heart size={48} strokeWidth={1} className="text-[#B76E79]" />
                <p className="mt-5 font-heading text-3xl italic text-[#785B50]">
                  Your Beautiful
                </p>
                <p className="font-heading text-4xl font-semibold text-[#785B50]">
                  Beginning
                </p>
                <span className="mt-5 h-px w-16 bg-[#B76E79]" />
                <p className="mt-4 text-xs tracking-[0.25em] text-[#8F6D60]">
                  MADE WITH LOVE
                </p>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -bottom-5 -left-5 rounded-2xl border border-[#E9DED2] bg-white px-5 py-4 shadow-lg sm:-left-10"
          >
            <p className="font-heading text-xl font-semibold text-[#292524]">
              Made for Love
            </p>
            <p className="mt-1 text-xs text-[#78716C]">
              Planned with care.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
