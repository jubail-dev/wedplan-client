"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  MapPin,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface Vendor {
  name?: string;
  businessName?: string;
  image?: string;
  subscriptionPlan?: "free" | "premium";
}

interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  image?: string;
  images?: string[];
  vendor?: Vendor;
}

interface ServicesResponse {
  success: boolean;
  totalServices: number;
  services: Service[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_SERVER_URL;

export default function FeaturedServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const shouldReduceMotion = useReducedMotion();

  const fetchServices = useCallback(async (signal: AbortSignal) => {
    try {
      setLoading(true);
      setError("");

      if (!BASE_URL) {
        throw new Error("Server URL is not configured.");
      }

      const response = await fetch(`${BASE_URL}/services`, {
        signal,
      });

      if (!response.ok) {
        throw new Error("Failed to load featured wedding services.");
      }

      const data: ServicesResponse = await response.json();

      if (!data.success || !Array.isArray(data.services)) {
        throw new Error("Unable to load wedding services.");
      }

      // Backend already returns only Approved and Active services.
      setServices(data.services.slice(0, 6));
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message);
        setServices([]);
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void fetchServices(controller.signal);

    return () => controller.abort();
  }, [fetchServices, retryCount]);

  const formatPrice = (price: number) =>
    `৳${price.toLocaleString("en-BD")}`;

  const reveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#F9E9E9]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#F5E9D8]/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={reveal}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center sm:mb-14"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#F0DDE0] bg-[#FFF8F8] px-4 py-2">
            <Sparkles size={14} className="text-[#D97985]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A65D68] sm:text-xs">
              Curated for Your Special Day
            </span>
          </div>

          <h2 className="font-heading text-3xl font-semibold tracking-tight text-[#292524] sm:text-4xl lg:text-5xl">
            Featured Wedding{" "}
            <span className="italic text-[#D97985]">Services</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#78716C] sm:text-base">
            Explore handpicked wedding professionals and discover the
            perfect services to make every moment of your celebration
            unforgettable.
          </p>

          <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[#D9A7A7] to-transparent" />
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-[#EFE5DE] bg-white"
              >
                <div className="h-60 animate-pulse bg-[#F2EAE4]" />
                <div className="space-y-4 p-5">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-[#F2EAE4]" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-[#F2EAE4]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[#F2EAE4]" />
                  <div className="h-10 animate-pulse rounded-xl bg-[#F2EAE4]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-3xl border border-[#EFE0DD] bg-[#FFFAF8] px-6 py-14 text-center">
            <p className="font-heading text-2xl font-semibold text-[#3D3434]">
              Services Couldn&apos;t Load
            </p>

            <p className="mt-3 text-sm text-[#A16F6F]">{error}</p>

            <button
              type="button"
              onClick={() => setRetryCount((previous) => previous + 1)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D97985] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#C56573]"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#E5D8CE] bg-[#FFFCF9] px-6 py-14 text-center">
            <Sparkles size={32} className="mx-auto text-[#D97985]" />

            <h3 className="mt-4 font-heading text-2xl font-semibold text-[#3D3434]">
              Coming Soon
            </h3>

            <p className="mt-2 text-sm text-[#887B73]">
              Our featured wedding services will appear here soon.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#C56573] hover:underline"
            >
              Explore All Services
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Featured Services Grid */}
        {!loading && !error && services.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const serviceImage = service.image || service.images?.[0];

                const isPremium =
                  service.vendor?.subscriptionPlan === "premium";

                return (
                  <motion.article
                    key={service._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={reveal}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.5,
                      delay: shouldReduceMotion ? 0 : index * 0.08,
                    }}
                    className="group overflow-hidden rounded-3xl border border-[#EFE5DE] bg-white shadow-[0_8px_30px_rgba(80,55,40,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_45px_rgba(80,55,40,0.11)]"
                  >
                    {/* Image */}
                    <div className="relative h-60 overflow-hidden bg-[#F1E3D8]">
                      {serviceImage ? (
                        <Image
                          src={serviceImage}
                          alt={service.serviceName}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Sparkles
                            size={42}
                            className="text-[#C99A91]"
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/5" />

                      <span className="absolute left-4 top-4 max-w-[55%] truncate rounded-full border border-white/60 bg-white/90 px-3.5 py-2 text-[11px] font-semibold text-[#A65D68] shadow-sm backdrop-blur-md sm:max-w-[75%]">
                        {service.category}
                      </span>

                      {isPremium && (
                        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-[#F2D58A] bg-[#FFF8E5]/95 px-3 py-2 text-[10px] font-bold text-[#9B741F] shadow-sm">
                          <BadgeCheck size={13} />
                          Premium
                        </span>
                      )}

                      <div className="absolute bottom-4 left-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                          Starting From
                        </p>
                        <p className="mt-1 text-xl font-bold text-white drop-shadow-sm">
                          {formatPrice(service.price)}
                        </p>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 sm:p-6">
                      <h3 className="line-clamp-1 font-heading text-xl font-semibold text-[#332B29] transition-colors group-hover:text-[#C56573]">
                        {service.serviceName}
                      </h3>

                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-[#887B73]">
                        {service.description}
                      </p>

                      {/* Location */}
                      <div className="mt-5 flex items-center gap-2 text-sm text-[#887B73]">
                        <MapPin
                          size={15}
                          className="shrink-0 text-[#D97985]"
                        />
                        <span className="truncate">{service.location}</span>
                      </div>

                      {/* Vendor */}
                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#F0E8E0] pt-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#F0E0DB] bg-[#F8ECE8]">
                            {service.vendor?.image ? (
                              <Image
                                src={service.vendor.image}
                                alt={
                                  service.vendor.businessName ||
                                  service.vendor.name ||
                                  "Vendor"
                                }
                                fill
                                unoptimized
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-sm font-semibold text-[#B56D76]">
                                {(
                                  service.vendor?.businessName ||
                                  service.vendor?.name ||
                                  "W"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] text-[#A09494]">
                              Provided by
                            </p>
                            <p className="truncate text-sm font-semibold text-[#403633]">
                              {service.vendor?.businessName ||
                                service.vendor?.name ||
                                "Wedding Professional"}
                            </p>
                          </div>
                        </div>

                        {isPremium && (
                          <BadgeCheck
                            size={18}
                            className="shrink-0 text-[#C49A3A]"
                            aria-label="Premium Vendor"
                          />
                        )}
                      </div>

                      {/* Details Button */}
                      <Link
                        href={`/services/${service._id}`}
                        className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#EBCBD0] bg-[#FFF8F8] px-4 py-3 text-sm font-semibold text-[#B85F6D] transition-all duration-300 hover:border-[#D97985] hover:bg-[#D97985] hover:text-white"
                      >
                        View Details
                        <ArrowUpRight
                          size={16}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </Link>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* View All */}
            <div className="mt-12 text-center">
              <Link
                href="/services"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#D97985] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#D97985]/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#C56573] hover:shadow-xl"
              >
                Explore All Wedding Services
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}