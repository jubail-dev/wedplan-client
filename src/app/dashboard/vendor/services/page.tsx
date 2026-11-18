
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  MapPin,
  Tag,
  Loader2,
  AlertCircle,
  RefreshCw,
  Package,
  CalendarDays,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

interface VendorService {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  image: string;
  images?: string[];
  status: "Pending" | "Approved" | "Rejected";
  isAvailable: boolean;
  createdAt: string;
}

interface ServicesApiResponse {
  success: boolean;
  services: VendorService[];
  message?: string;
}

export default function VendorServicesPage() {
  const [services, setServices] = useState<VendorService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const tokenResponse = await fetch("/api/auth/token", {
        cache: "no-store",
      });

      const tokenData: { token?: string } =
        await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Authentication token not found!");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/vendor/services`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        },
      );

      const data: ServicesApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch services!",
        );
      }

      setServices(data.services);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong!";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchServices();
  }, [fetchServices]);

  const getStatusStyle = (status: VendorService["status"]) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-3xl font-bold text-stone-800">
              My Services
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Manage your wedding services and track their approval status.
            </p>
          </div>

          <Link
            href="/dashboard/vendor/add-service"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D97985] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c56874]"
          >
            <Plus size={18} />
            Add New Service
          </Link>
        </div>

        {/* Service Summary */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total Services",
              value: services.length,
              color: "text-stone-800",
            },
            {
              label: "Approved",
              value: services.filter(
                (service) => service.status === "Approved",
              ).length,
              color: "text-green-600",
            },
            {
              label: "Pending",
              value: services.filter(
                (service) => service.status === "Pending",
              ).length,
              color: "text-amber-600",
            },
            {
              label: "Rejected",
              value: services.filter(
                (service) => service.status === "Rejected",
              ).length,
              color: "text-red-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#E9DED2] bg-white p-4 shadow-sm"
            >
              <p className="text-sm text-stone-500">
                {item.label}
              </p>

              <p className={`mt-2 text-2xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[#E9DED2] bg-white">
            <div className="text-center">
              <Loader2 className="mx-auto animate-spin text-[#D97985]" size={36} />

              <p className="mt-3 text-sm text-stone-500">
                Loading your services...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <AlertCircle className="mx-auto text-red-500" size={40} />

            <h2 className="mt-3 text-lg font-semibold text-stone-800">
              Unable to Load Services
            </h2>

            <p className="mt-2 text-sm text-stone-500">
              {error}
            </p>

            <button
              onClick={() => void fetchServices()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#D97985] px-5 py-2.5 text-sm font-semibold text-white"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#DCCBC0] bg-white px-6 py-16 text-center">
            <Package className="mx-auto text-[#D97985]" size={48} />

            <h2 className="mt-4 font-heading text-2xl font-bold text-stone-800">
              No Services Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
              You haven't added any wedding services yet.
              Start by creating your first service.
            </p>

            <Link
              href="/dashboard/vendor/add-service"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D97985] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c56874]"
            >
              <Plus size={18} />
              Add Your First Service
            </Link>
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article
                key={service._id}
                className="overflow-hidden rounded-2xl border border-[#E9DED2] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Service Image */}
                <div className="relative h-52 w-full bg-[#F1E3C8]">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.serviceName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package size={48} className="text-stone-400" />
                    </div>
                  )}

                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(service.status)}`}
                  >
                    {service.status}
                  </span>
                </div>

                {/* Service Information */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-stone-800">
                        {service.serviceName}
                      </h2>

                      <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
                        <Tag size={14} />
                        {service.category}
                      </p>
                    </div>

                    <p className="shrink-0 font-bold text-[#D97985]">
                      ৳{service.price.toLocaleString("en-BD")}
                    </p>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-stone-500">
                    {service.description}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-[#F0E8E0] pt-4">
                    <p className="flex items-center gap-2 text-sm text-stone-600">
                      <MapPin size={16} className="text-[#D97985]" />
                      {service.location}
                    </p>

                    <p className="flex items-center gap-2 text-sm text-stone-600">
                      <CalendarDays size={16} className="text-[#D97985]" />
                      Added:{" "}
                      {new Date(service.createdAt).toLocaleDateString(
                        "en-BD",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  {/* Availability */}
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-[#FAF7F2] px-3 py-3">
                    <span className="text-sm font-medium text-stone-600">
                      Availability
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        service.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {service.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  {/* Actions - API integration will be added next */}
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      disabled
                      title="Details action will be added next"
                      className="flex cursor-not-allowed items-center justify-center gap-1 rounded-lg border border-[#E9DED2] py-2 text-xs font-semibold text-stone-400"
                    >
                      <Eye size={15} />
                      View
                    </button>

                    <button
                      type="button"
                      disabled
                      title="Update API will be added next"
                      className="flex cursor-not-allowed items-center justify-center gap-1 rounded-lg border border-[#E9DED2] py-2 text-xs font-semibold text-stone-400"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled
                      title="Delete API will be added next"
                      className="flex cursor-not-allowed items-center justify-center gap-1 rounded-lg border border-[#E9DED2] py-2 text-xs font-semibold text-stone-400"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
