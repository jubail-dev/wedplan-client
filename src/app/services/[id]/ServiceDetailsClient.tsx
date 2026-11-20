
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  MapPin,
  ShieldCheck,
  UserRound,
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

interface ServiceResponse {
  success: boolean;
  service: Service;
  message?: string;
}

export default function ServiceDetailsClient() {
  const params = useParams<{ id: string }>();
  const serviceId = params.id;

  const [service, setService] = useState<Service | null>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const baseUrl = process.env.NEXT_PUBLIC_BASE_SERVER_URL;

        if (!baseUrl) {
          throw new Error("Server URL is not configured.");
        }

        const response = await fetch(
          `${baseUrl}/services/${serviceId}`,
          {
            signal: controller.signal,
          },
        );

        const data: ServiceResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load service details.",
          );
        }

        setService(data.service);

        const serviceImages = data.service.images?.length
          ? data.service.images
          : data.service.image
            ? [data.service.image]
            : [];

        setSelectedImage(serviceImages[0] || "");
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (serviceId) {
      void fetchServiceDetails();
    }

    return () => {
      controller.abort();
    };
  }, [serviceId]);

  const serviceImages = service
    ? service.images?.length
      ? service.images
      : service.image
        ? [service.image]
        : []
    : [];

  const isPremium =
    service?.vendor?.subscriptionPlan === "premium";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] px-4 py-20">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-8 h-5 w-32 rounded bg-[#EDE3D8]" />

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="h-[400px] rounded-2xl bg-[#EDE3D8]" />

            <div className="space-y-5">
              <div className="h-5 w-32 rounded bg-[#EDE3D8]" />
              <div className="h-10 w-3/4 rounded bg-[#EDE3D8]" />
              <div className="h-24 rounded bg-[#EDE3D8]" />
              <div className="h-12 w-1/2 rounded bg-[#EDE3D8]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF7F2] px-4">
        <div className="max-w-md rounded-2xl border border-[#EDE3D8] bg-white p-8 text-center shadow-sm">
          <div className="mb-4 text-5xl">💐</div>

          <h1 className="font-serif text-2xl font-bold text-[#3D3434]">
            Service Not Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#786D6D]">
            {error ||
              "This service may have been removed or is currently unavailable."}
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D97985] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c96875]"
          >
            <ArrowLeft size={16} />
            Browse Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#786D6D] transition hover:text-[#D97985]"
        >
          <ArrowLeft size={17} />
          Back to Services
        </Link>

        <div className="grid items-start gap-10 lg:grid-cols-2">
          {/* Image Gallery */}
          <div>
            <div className="relative h-[300px] overflow-hidden rounded-2xl bg-[#F1E3C8] sm:h-[450px]">
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={service.serviceName}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-7xl">
                  💐
                </div>
              )}
            </div>

            {serviceImages.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {serviceImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition ${
                      selectedImage === image
                        ? "border-[#D97985]"
                        : "border-transparent"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`${service.serviceName} image ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Service Information */}
          <div>
            <span className="inline-flex rounded-full bg-[#F1E3C8] px-4 py-2 text-xs font-semibold text-[#9A7044]">
              {service.category}
            </span>

            <h1 className="mt-5 font-serif text-3xl font-bold leading-tight text-[#3D3434] sm:text-4xl">
              {service.serviceName}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[#786D6D]">
              <span className="inline-flex items-center gap-2">
                <MapPin size={17} className="text-[#D97985]" />
                {service.location}
              </span>

              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={17} className="text-[#D97985]" />
                Approved Service
              </span>
            </div>

            {/* Price */}
            <div className="mt-8 rounded-2xl border border-[#EDE3D8] bg-white p-6">
              <p className="text-sm font-medium text-[#786D6D]">
                Service Price
              </p>

              <p className="mt-2 text-3xl font-bold text-[#D97985]">
                ৳{service.price.toLocaleString("en-BD")}
              </p>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="font-serif text-2xl font-bold text-[#3D3434]">
                About This Service
              </h2>

              <p className="mt-4 whitespace-pre-line text-base leading-8 text-[#786D6D]">
                {service.description}
              </p>
            </div>

            {/* Vendor Information */}
            <div className="mt-8 rounded-2xl border border-[#EDE3D8] bg-white p-6">
              <h2 className="font-serif text-xl font-bold text-[#3D3434]">
                Service Provider
              </h2>

              <div className="mt-5 flex items-center gap-4">
                {service.vendor?.image ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#F1E3C8]">
                    <Image
                      src={service.vendor.image}
                      alt="Vendor profile"
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F1E3C8] text-[#D97985]">
                    <UserRound size={25} />
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[#3D3434]">
                      {service.vendor?.businessName ||
                        service.vendor?.name ||
                        "Wedding Professional"}
                    </p>

                    {isPremium && (
                      <span
                        title="Premium Vendor"
                        className="inline-flex items-center gap-1 rounded-full border border-[#E8C66A] bg-[#FFF7DF] px-2 py-1 text-[10px] font-bold text-[#A77916]"
                      >
                        <BadgeCheck size={12} />
                        Premium
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-[#786D6D]">
                    Verified Service Provider
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Button */}
            <div className="mt-8">
              <Link
                href={`/services/${service._id}/booking`}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#D97985] px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-[#c96875]"
              >
                <CalendarDays size={19} />
                Request Booking
              </Link>

              <p className="mt-3 text-center text-xs text-[#A09494]">
                Make your special day unforgettable with the right professionals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
