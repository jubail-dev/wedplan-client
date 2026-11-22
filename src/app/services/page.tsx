
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";

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

const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Read category from URL and handle browser navigation.
  useEffect(() => {
    const syncCategoryFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const selectedCategory = params.get("category") || "";

      setCategory(
        CATEGORIES.includes(selectedCategory) ? selectedCategory : "",
      );
    };

    syncCategoryFromUrl();

    window.addEventListener("popstate", syncCategoryFromUrl);

    return () => {
      window.removeEventListener("popstate", syncCategoryFromUrl);
    };
  }, []);

  // Fetch services according to selected filters.
  const fetchServices = useCallback(
    async (signal: AbortSignal) => {
      try {
        setLoading(true);
        setError("");

        const baseUrl = process.env.NEXT_PUBLIC_BASE_SERVER_URL;

        if (!baseUrl) {
          throw new Error("Server URL is not configured.");
        }

        const params = new URLSearchParams();

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (category) {
          params.set("category", category);
        }

        if (location.trim()) {
          params.set("location", location.trim());
        }

        params.set("sort", sort);

        const response = await fetch(
          `${baseUrl}/services?${params.toString()}`,
          {
            signal,
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to load wedding services.");
        }

        const data: ServicesResponse = await response.json();

        if (!data.success || !Array.isArray(data.services)) {
          throw new Error("Unable to load services.");
        }

        setServices(data.services);
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
    },
    [search, category, location, sort],
  );

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      void fetchServices(controller.signal);
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [fetchServices, retryCount]);

  // Update category and URL together.
  const handleCategoryChange = (value: string) => {
    setCategory(value);

    const params = new URLSearchParams(window.location.search);

    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }

    const queryString = params.toString();

    const newUrl = queryString
      ? `${window.location.pathname}?${queryString}`
      : window.location.pathname;

    window.history.replaceState(null, "", newUrl);
  };

  // Clear all filters.
  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setSort("newest");

    window.history.replaceState(
      null,
      "",
      window.location.pathname,
    );
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#D97985]">
            Find Your Perfect Match
          </p>

          <h1 className="font-serif text-4xl font-bold text-[#3D3434] sm:text-5xl">
            Explore Wedding Services
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#786D6D]">
            Discover trusted wedding professionals and find everything you
            need to make your special day unforgettable.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="rounded-2xl border border-[#EDE3D8] bg-white p-5 shadow-sm sm:p-7">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div>
              <label
                htmlFor="service-search"
                className="mb-2 block text-sm font-semibold text-[#3D3434]"
              >
                Search Services
              </label>

              <input
                id="service-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by service name..."
                className="w-full rounded-xl border border-[#E8DED5] bg-[#FFFCF9] px-4 py-3 text-sm outline-none transition focus:border-[#D97985] focus:ring-2 focus:ring-[#D97985]/10"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="service-category"
                className="mb-2 block text-sm font-semibold text-[#3D3434]"
              >
                Category
              </label>

              <select
                id="service-category"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full rounded-xl border border-[#E8DED5] bg-[#FFFCF9] px-4 py-3 text-sm outline-none transition focus:border-[#D97985] focus:ring-2 focus:ring-[#D97985]/10"
              >
                <option value="">All Categories</option>

                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="service-location"
                className="mb-2 block text-sm font-semibold text-[#3D3434]"
              >
                Location
              </label>

              <input
                id="service-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location..."
                className="w-full rounded-xl border border-[#E8DED5] bg-[#FFFCF9] px-4 py-3 text-sm outline-none transition focus:border-[#D97985] focus:ring-2 focus:ring-[#D97985]/10"
              />
            </div>

            {/* Price Sorting */}
            <div>
              <label
                htmlFor="service-sort"
                className="mb-2 block text-sm font-semibold text-[#3D3434]"
              >
                Sort By Price
              </label>

              <select
                id="service-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-xl border border-[#E8DED5] bg-[#FFFCF9] px-4 py-3 text-sm outline-none transition focus:border-[#D97985] focus:ring-2 focus:ring-[#D97985]/10"
              >
                <option value="newest">Newest First</option>
                <option value="price-low-to-high">
                  Price: Low to High
                </option>
                <option value="price-high-to-low">
                  Price: High to Low
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-12">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#3D3434]">
                {category || "Wedding Services"}
              </h2>

              <p className="mt-1 text-sm text-[#786D6D]">
                Find the right professionals for your special day.
              </p>
            </div>

            {!loading && !error && (
              <p className="text-sm font-medium text-[#786D6D]">
                {services.length} Services Found
              </p>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-[#EDE3D8] bg-white"
                >
                  <div className="h-56 animate-pulse bg-[#EDE3D8]" />

                  <div className="space-y-3 p-5">
                    <div className="h-4 w-1/3 animate-pulse rounded bg-[#EDE3D8]" />
                    <div className="h-6 w-3/4 animate-pulse rounded bg-[#EDE3D8]" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-[#EDE3D8]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center">
              <h3 className="text-xl font-semibold text-[#3D3434]">
                Something Went Wrong
              </h3>

              <p className="mt-2 text-sm text-red-500">{error}</p>

              <button
                type="button"
                onClick={() => setRetryCount((previous) => previous + 1)}
                className="mt-5 rounded-xl bg-[#D97985] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c96875]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && services.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#DCCFC4] bg-white px-6 py-16 text-center">
              <div className="mb-4 text-5xl">💐</div>

              <h3 className="font-serif text-2xl font-bold text-[#3D3434]">
                No Services Found
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#786D6D]">
                We couldn&apos;t find any services matching your search.
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-6 rounded-xl bg-[#D97985] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c96875]"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Services Grid */}
          {!loading && !error && services.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const serviceImage =
                  service.image || service.images?.[0];

                const isPremium =
                  service.vendor?.subscriptionPlan === "premium";

                return (
                  <article
                    key={service._id}
                    className="group overflow-hidden rounded-2xl border border-[#EDE3D8] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Service Image */}
                    <div className="relative h-56 overflow-hidden bg-[#F1E3C8]">
                      {serviceImage ? (
                        <Image
                          src={serviceImage}
                          alt={service.serviceName}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl">
                          💐
                        </div>
                      )}

                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#D97985] shadow-sm">
                        {service.category}
                      </span>
                    </div>

                    {/* Service Information */}
                    <div className="p-5">
                      <h3 className="line-clamp-1 text-xl font-bold text-[#3D3434]">
                        {service.serviceName}
                      </h3>

                      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-[#786D6D]">
                        {service.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="text-lg font-bold text-[#D97985]">
                          ৳{service.price.toLocaleString("en-BD")}
                        </p>

                        <p className="min-w-0 truncate text-sm text-[#786D6D]">
                          📍 {service.location}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-[#F0E8E0] pt-4">
                        <div className="min-w-0">
                          <p className="text-xs text-[#A09494]">
                            Provided by
                          </p>

                          <div className="mt-1 flex min-w-0 items-center gap-2">
                            <p className="truncate text-sm font-semibold text-[#3D3434]">
                              {service.vendor?.businessName ||
                                service.vendor?.name ||
                                "Wedding Professional"}
                            </p>

                            {isPremium && (
                              <span
                                title="Premium Vendor"
                                className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#E8C66A] bg-[#FFF7DF] px-2 py-1 text-[10px] font-bold text-[#A77916]"
                              >
                                <BadgeCheck size={12} />
                                Premium
                              </span>
                            )}
                          </div>
                        </div>

                        <Link
                          href={`/services/${service._id}`}
                          className="shrink-0 rounded-xl bg-[#D97985] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c96875]"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
