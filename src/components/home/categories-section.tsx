
"use client";

import Link from "next/link";
import {
  Camera,
  MapPin,
  Flower2,
  Utensils,
  Sparkles,
  Shirt,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "motion/react";

const categories = [
  {
    title: "Photography & Videography",
    description: "Capture every beautiful moment of your special day.",
    icon: Camera,
  },
  {
    title: "Wedding Venues",
    description: "Find the perfect place for your dream celebration.",
    icon: MapPin,
  },
  {
    title: "Decoration & Florist",
    description: "Create a magical atmosphere with stunning decor.",
    icon: Flower2,
  },
  {
    title: "Catering Services",
    description: "Delight your guests with unforgettable dining.",
    icon: Utensils,
  },
  {
    title: "Makeup & Styling",
    description: "Look and feel your most beautiful on your big day.",
    icon: Sparkles,
  },
  {
    title: "Wedding Fashion",
    description: "Discover beautiful outfits for your celebration.",
    icon: Shirt,
  },
];

export default function CategoriesSection() {
  return (
    <section className="bg-white px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D97985]">
            Explore Categories
          </span>

          <h2 className="mt-4 font-heading text-3xl font-semibold text-[#292524] sm:text-4xl">
            Everything You Need for Your
            <span className="text-[#D97985]"> Dream Wedding</span>
          </h2>

          <p className="mt-5 leading-7 text-[#78716C]">
            From the perfect venue to the smallest details, discover
            trusted professionals to make your celebration unforgettable.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/services?category=${encodeURIComponent(category.title)}`}
                  className="group flex h-full items-start gap-5 rounded-2xl border border-[#E9DED2] bg-[#FAF7F2]/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#D97985]/50 hover:bg-white hover:shadow-xl hover:shadow-[#8F765B]/10"
                >
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#FCECEF] text-[#D97985] transition-colors duration-300 group-hover:bg-[#D97985] group-hover:text-white">
                    <Icon size={26} strokeWidth={1.7} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-semibold text-[#292524]">
                      {category.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#78716C]">
                      {category.description}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#D97985]">
                      Explore Services
                      <ArrowUpRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
