
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Suspense,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Send,
} from "lucide-react";

interface Vendor {
  _id: string;
  name: string;
  email: string;
  image?: string;
  businessName?: string;
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
  service?: Service;
  message?: string;
}

function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function BookingPageContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const serviceId = params.id;

  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!serviceId) return;

    const controller = new AbortController();

    const fetchService = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/services/${serviceId}`,
          { signal: controller.signal },
        );

        const data: ServiceResponse = await response.json();

        if (!response.ok || !data.success || !data.service) {
          throw new Error(
            data.message || "This service is currently unavailable.",
          );
        }

        setService(data.service);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load service details.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void fetchService();

    return () => controller.abort();
  }, [serviceId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!eventDate || !eventLocation.trim()) {
      toast.error("Please complete all required fields.");
      return;
    }

    if (eventDate < getTodayDate()) {
      toast.error("Please select a valid event date.");
      return;
    }

    try {
      setIsSubmitting(true);

      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        router.push(
          `/sign-in?callbackURL=${encodeURIComponent(
            `/services/${serviceId}/booking`,
          )}`,
        );
        return;
      }

      const tokenData: { token?: string } = await tokenResponse.json();
      const token = tokenData.token;

      if (!token) {
        router.push(
          `/sign-in?callbackURL=${encodeURIComponent(
            `/services/${serviceId}/booking`,
          )}`,
        );
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/customer/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceId,
            eventDate,
            eventLocation: eventLocation.trim(),
            message: message.trim(),
          }),
        },
      );

      const data: { success?: boolean; message?: string } =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit booking request.");
      }

      toast.success("Booking request submitted successfully!");

      router.push("/dashboard/customer/bookings");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#EDE3D8] border-t-[#D97985]" />
          <p className="mt-4 text-sm text-[#786D6D]">
            Loading booking details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF7F2] px-4">
        <div className="max-w-md text-center">
          <h1 className="font-serif text-3xl text-[#3D3030]">
            Service Unavailable
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#786D6D]">
            {error || "This service could not be found or is no longer available."}
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D97985] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#C76673]"
          >
            <ArrowLeft size={16} />
            Browse Services
          </Link>
        </div>
      </main>
    );
  }

  const serviceImage =
    service.images?.[0] ||
    service.image ||
    "/images/service-placeholder.png";

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/services/${serviceId}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#786D6D] transition hover:text-[#D97985]"
        >
          <ArrowLeft size={16} />
          Back to Service Details
        </Link>

        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D97985]">
            Make It Memorable
          </p>
          <h1 className="mt-3 font-serif text-4xl text-[#3D3030] sm:text-5xl">
            Request a Booking
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#786D6D]">
            Share your event details with the vendor. They will review your
            request and get back to you.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="rounded-3xl border border-[#EDE3D8] bg-white p-6 shadow-sm sm:p-9">
            <div className="mb-8">
              <h2 className="font-serif text-2xl text-[#3D3030]">
                Event Information
              </h2>
              <p className="mt-2 text-sm text-[#786D6D]">
                Please provide accurate information about your event.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="eventDate"
                  className="mb-2 block text-sm font-medium text-[#493C3C]"
                >
                  Event Date <span className="text-[#D97985]">*</span>
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B69A91]"
                  />
                  <input
                    id="eventDate"
                    type="date"
                    min={getTodayDate()}
                    value={eventDate}
                    onChange={(event) => setEventDate(event.target.value)}
                    required
                    className="w-full rounded-xl border border-[#EDE3D8] bg-[#FFFEFC] py-3.5 pl-11 pr-4 text-sm text-[#493C3C] outline-none transition focus:border-[#D97985] focus:ring-2 focus:ring-[#D97985]/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="eventLocation"
                  className="mb-2 block text-sm font-medium text-[#493C3C]"
                >
                  Event Location <span className="text-[#D97985]">*</span>
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B69A91]"
                  />
                  <input
                    id="eventLocation"
                    type="text"
                    placeholder="Enter your event venue or address"
                    value={eventLocation}
                    onChange={(event) => setEventLocation(event.target.value)}
                    required
                    maxLength={200}
                    className="w-full rounded-xl border border-[#EDE3D8] bg-[#FFFEFC] py-3.5 pl-11 pr-4 text-sm text-[#493C3C] outline-none transition placeholder:text-[#B8AAAA] focus:border-[#D97985] focus:ring-2 focus:ring-[#D97985]/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-[#493C3C]"
                >
                  Additional Message
                  <span className="ml-1 font-normal text-[#A99A9A]">
                    (Optional)
                  </span>
                </label>

                <div className="relative">
                  <MessageSquare
                    size={18}
                    className="pointer-events-none absolute left-4 top-4 text-[#B69A91]"
                  />
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell the vendor about your event requirements..."
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    maxLength={1000}
                    className="w-full resize-none rounded-xl border border-[#EDE3D8] bg-[#FFFEFC] py-3.5 pl-11 pr-4 text-sm text-[#493C3C] outline-none transition placeholder:text-[#B8AAAA] focus:border-[#D97985] focus:ring-2 focus:ring-[#D97985]/10"
                  />
                </div>

                <p className="mt-2 text-right text-xs text-[#A99A9A]">
                  {message.length}/1000
                </p>
              </div>

              <div className="rounded-xl bg-[#FAF7F2] p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-[#D97985]"
                  />
                  <p className="text-xs leading-6 text-[#786D6D]">
                    Your booking request will be sent to the vendor with
                    Pending status. The vendor will review and respond to
                    your request.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D97985] px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#C76673] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Booking Request
                  </>
                )}
              </button>
            </form>
          </section>

          <aside className="h-fit overflow-hidden rounded-3xl border border-[#EDE3D8] bg-white shadow-sm">
            <div className="relative h-56 w-full">
              <Image
                src={serviceImage}
                alt={service.serviceName}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 380px"
              />
            </div>

            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D97985]">
                Selected Service
              </p>

              <h2 className="mt-3 font-serif text-2xl text-[#3D3030]">
                {service.serviceName}
              </h2>

              <span className="mt-3 inline-block rounded-full bg-[#FAF0EF] px-3 py-1 text-xs font-medium text-[#C76D78]">
                {service.category}
              </span>

              <p className="mt-4 line-clamp-4 text-sm leading-6 text-[#786D6D]">
                {service.description}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-[#F0E9E2] pt-5">
                <span className="text-sm text-[#786D6D]">Service Price</span>
                <span className="font-serif text-2xl font-semibold text-[#3D3030]">
                  ৳{service.price.toLocaleString("en-BD")}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-[#786D6D]">
                <MapPin size={16} className="text-[#D97985]" />
                {service.location}
              </div>

              {service.vendor && (
                <div className="mt-6 border-t border-[#F0E9E2] pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A99A9A]">
                    Service Provider
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    {service.vendor.image ? (
                      <Image
                        src={service.vendor.image}
                        alt={service.vendor.name}
                        width={42}
                        height={42}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FAF0EF] font-serif text-lg text-[#D97985]">
                        {service.vendor.name?.charAt(0).toUpperCase() || "V"}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#493C3C]">
                        {service.vendor.businessName ||
                          service.vendor.name}
                      </p>
                      <p className="mt-1 text-xs text-[#A99A9A]">
                        Verified Service Provider
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF7F2]">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#EDE3D8] border-t-[#D97985]" />
            <p className="mt-4 text-sm text-[#786D6D]">
              Loading booking page...
            </p>
          </div>
        </main>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
