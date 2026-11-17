
"use client";

import { motion } from "motion/react";
import {
  ShieldCheck,
  Search,
  BadgeDollarSign,
  HeartHandshake,
} from "lucide-react";

const benefits = [
  {
    title: "Trusted Wedding Vendors",
    description:
      "Discover verified and approved wedding professionals you can confidently trust.",
    icon: ShieldCheck,
    number: "01",
  },
  {
    title: "Easy Service Discovery",
    description:
      "Find the right wedding services effortlessly with simple browsing and categories.",
    icon: Search,
    number: "02",
  },
  {
    title: "Transparent Pricing",
    description:
      "Explore service prices clearly and choose options that fit your wedding budget.",
    icon: BadgeDollarSign,
    number: "03",
  },
  {
    title: "Stress-Free Planning",
    description:
      "Keep your wedding planning organized with everything you need in one place.",
    icon: HeartHandshake,
    number: "04",
  },
];

export default function WhyChooseSection() {
  return (
    <section className="bg-[#FAF7F2] px-5 py-24 md:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D97985]">
            Why WedPlan
          </span>

          <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight text-[#292524] sm:text-5xl">
            Your Wedding Journey,
            <span className="text-[#D97985]"> Made Beautiful.</span>
          </h2>

          <p className="mt-6 max-w-lg text-base leading-8 text-[#78716C]">
            Planning your dream wedding should be exciting, not stressful.
            WedPlan brings trusted professionals and essential services
            together to make every step easier.
          </p>

          <div className="mt-9 flex items-center gap-4">
            <div className="h-14 w-1 rounded-full bg-[#D97985]" />
            <p className="font-heading text-xl italic text-[#8F765B]">
              Every little detail deserves something special.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                key={benefit.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl border border-[#E9DED2] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#8F765B]/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-[#FCECEF] text-[#D97985]">
                    <Icon size={24} strokeWidth={1.7} />
                  </div>

                  <span className="font-heading text-2xl text-[#D6B477]">
                    {benefit.number}
                  </span>
                </div>

                <h3 className="mt-6 font-heading text-xl font-semibold text-[#292524]">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#78716C]">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
