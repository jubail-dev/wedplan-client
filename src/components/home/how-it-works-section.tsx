
"use client";

import { motion } from "motion/react";
import {
  Search,
  Heart,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Explore Services",
    description:
      "Browse a wide range of wedding services and discover professionals that match your needs.",
    icon: Search,
  },
  {
    number: "02",
    title: "Choose Your Vendor",
    description:
      "Compare service details, explore pricing, and select the perfect vendor for your celebration.",
    icon: Heart,
  },
  {
    number: "03",
    title: "Book Your Service",
    description:
      "Send your booking request and take one step closer to your dream wedding.",
    icon: CalendarCheck,
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-white px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D97985]">
            Simple & Easy
          </span>

          <h2 className="mt-4 font-heading text-3xl font-semibold text-[#292524] sm:text-4xl">
            Your Dream Wedding in
            <span className="text-[#D97985]"> Three Simple Steps</span>
          </h2>

          <p className="mt-5 leading-7 text-[#78716C]">
            We make wedding planning simple and enjoyable.
            Follow these easy steps to bring your vision to life.
          </p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative text-center"
              >
                <div className="relative mx-auto flex size-20 items-center justify-center rounded-full border border-[#E9DED2] bg-[#FCECEF] text-[#D97985]">
                  <Icon size={30} strokeWidth={1.6} />

                  <span className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full bg-[#D97985] text-xs font-semibold text-white">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-7 font-heading text-2xl font-semibold text-[#292524]">
                  {step.title}
                </h3>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#78716C]">
                  {step.description}
                </p>

                {index !== steps.length - 1 && (
                  <div className="absolute -right-6 top-10 hidden -translate-y-1/2 text-[#D6B477] lg:block">
                    <ArrowRight size={28} strokeWidth={1.5} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
