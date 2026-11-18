
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  Clock3,
  CheckCircle2,
  XCircle,
  X,
  Eye,
  Ban,
  Loader2,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";

type Service = {
  serviceName?: string;
  category?: string;
  images?: string[];
  image?: string;
  price?: number;
  location?: string;
};

type Vendor = {
  name?: string;
  image?: string;
  businessName?: string;
};

type Booking = {
  _id: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: "Pending" | "Accepted" | "Rejected" | "Cancelled";
  createdAt: string;
  service?: Service | null;
  vendor?: Vendor | null;
};

type ApiResponse = {
  success: boolean;
  bookings: Booking[];
  message?: string;
};

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Accepted: "bg-green-50 text-green-700 border-green-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
  Cancelled: "bg-stone-100 text-stone-600 border-stone-200",
};

function formatDate(date: string) {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
    null,
  );

  const fetchBookings = useCallback(async () => {
    try {
      setError("");

      const tokenResponse = await fetch("/api/auth/token", {
        cache: "no-store",
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to authenticate your account.");
      }

      const { token } = await tokenResponse.json();

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/customer/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch bookings.");
      }

      setBookings(result.bookings);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancellingId(bookingId);

      const tokenResponse = await fetch("/api/auth/token", {
        cache: "no-store",
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to authenticate your account.");
      }

      const { token } = await tokenResponse.json();

      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/customer/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to cancel booking.");
      }

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "Cancelled" }
            : booking,
        ),
      );

      setSelectedBooking((previousBooking) =>
        previousBooking?._id === bookingId
          ? { ...previousBooking, status: "Cancelled" }
          : previousBooking,
      );

      toast.success("Booking cancelled successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-5 py-8 md:px-8 lg:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Page Heading */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-widest text-[#D97985] uppercase">
            Customer Dashboard
          </p>

          <h1 className="font-heading text-3xl font-semibold text-[#292524] sm:text-4xl">
            My Bookings
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#78716C]">
            Keep track of your wedding service requests and their
            current status.
          </p>
        </div>

        {/* Booking Count */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#E9DED2] bg-white p-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#FCECEF]">
            <ClipboardList className="size-5 text-[#D97985]" />
          </div>

          <div>
            <p className="text-sm text-[#78716C]">
              Total Booking Requests
            </p>
            <p className="text-xl font-semibold text-[#292524]">
              {bookings.length}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-60 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-[#D97985]" />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <XCircle className="mx-auto size-10 text-red-400" />

            <h2 className="mt-4 font-semibold text-[#292524]">
              Unable to Load Bookings
            </h2>

            <p className="mt-2 text-sm text-[#78716C]">{error}</p>

            <button
              onClick={() => {
                setLoading(true);
                fetchBookings();
              }}
              className="mt-5 rounded-xl bg-[#D97985] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C96573]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <div className="rounded-2xl border border-[#E9DED2] bg-white px-6 py-16 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#FCECEF]">
              <CalendarDays className="size-7 text-[#D97985]" />
            </div>

            <h2 className="mt-5 font-heading text-2xl font-semibold text-[#292524]">
              No Bookings Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#78716C]">
              You have not submitted any booking requests yet.
              Explore our services to start planning your special day.
            </p>

            <a
              href="/services"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#D97985] px-6 text-sm font-semibold text-white transition hover:bg-[#C96573]"
            >
              Explore Services
            </a>
          </div>
        )}

        {/* Booking List */}
        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-5">
            {bookings.map((booking) => {
              const serviceImage =
                booking.service?.image ||
                booking.service?.images?.[0];

              return (
                <article
                  key={booking._id}
                  className="overflow-hidden rounded-2xl border border-[#E9DED2] bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 p-5 sm:flex-row sm:p-6">
                    {/* Service Image */}
                    <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl bg-[#F1E3C8] sm:h-36 sm:w-44">
                      {serviceImage ? (
                        <Image
                          src={serviceImage}
                          alt={booking.service?.serviceName || "Service"}
                          fill
                          sizes="(max-width: 640px) 100vw, 176px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <CalendarDays className="size-10 text-[#D97985]" />
                        </div>
                      )}
                    </div>

                    {/* Booking Information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                          <h2 className="font-heading text-xl font-semibold text-[#292524]">
                            {booking.service?.serviceName ||
                              "Service Unavailable"}
                          </h2>

                          <p className="mt-1 text-sm text-[#A8A29E]">
                            {booking.service?.category || "Wedding Service"}
                          </p>
                        </div>

                        <span
                          className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}
                        >
                          {booking.status === "Accepted" && (
                            <CheckCircle2 className="size-3.5" />
                          )}
                          {booking.status === "Pending" && (
                            <Clock3 className="size-3.5" />
                          )}
                          {booking.status === "Rejected" && (
                            <XCircle className="size-3.5" />
                          )}
                          {booking.status === "Cancelled" && (
                            <Ban className="size-3.5" />
                          )}
                          {booking.status}
                        </span>
                      </div>

                      {/* Vendor Information */}
                      <div className="mt-4 flex items-center gap-3">
                        {booking.vendor?.image ? (
                          <Image
                            src={booking.vendor.image}
                            alt={booking.vendor.name || "Vendor"}
                            width={34}
                            height={34}
                            className="size-9 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex size-9 items-center justify-center rounded-full bg-[#FCECEF] text-sm font-semibold text-[#D97985]">
                            {booking.vendor?.name?.charAt(0) || "V"}
                          </div>
                        )}

                        <div>
                          <p className="text-xs text-[#A8A29E]">
                            Vendor
                          </p>
                          <p className="text-sm font-medium text-[#44403C]">
                            {booking.vendor?.businessName ||
                              booking.vendor?.name ||
                              "Vendor Information Unavailable"}
                          </p>
                        </div>
                      </div>

                      {/* Event Information */}
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#78716C]">
                        <span className="flex items-center gap-2">
                          <CalendarDays className="size-4 text-[#D97985]" />
                          {formatDate(booking.eventDate)}
                        </span>

                        <span className="flex items-center gap-2">
                          <MapPin className="size-4 text-[#D97985]" />
                          {booking.eventLocation}
                        </span>
                      </div>

                      {/* Booking Actions */}
                      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#F1E9E1] pt-4">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E9DED2] px-4 text-sm font-semibold text-[#57534E] transition hover:bg-[#FAF7F2]"
                        >
                          <Eye className="size-4" />
                          View Details
                        </button>

                        {booking.status === "Pending" && (
                          <button
                            onClick={() =>
                              handleCancelBooking(booking._id)
                            }
                            disabled={cancellingId === booking._id}
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {cancellingId === booking._id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Ban className="size-4" />
                            )}
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-semibold text-[#292524]">
                Booking Details
              </h2>

              <button
                onClick={() => setSelectedBooking(null)}
                className="flex size-9 items-center justify-center rounded-full bg-[#FAF7F2] text-[#78716C] hover:bg-[#F1E3C8]"
                aria-label="Close booking details"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs text-[#A8A29E]">Service Name</p>
                <p className="mt-1 font-semibold text-[#292524]">
                  {selectedBooking.service?.serviceName ||
                    "Service Unavailable"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#A8A29E]">Vendor</p>
                <p className="mt-1 font-medium text-[#44403C]">
                  {selectedBooking.vendor?.businessName ||
                    selectedBooking.vendor?.name ||
                    "Unavailable"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#A8A29E]">Event Date</p>
                <p className="mt-1 font-medium text-[#44403C]">
                  {formatDate(selectedBooking.eventDate)}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#A8A29E]">Event Location</p>
                <p className="mt-1 font-medium text-[#44403C]">
                  {selectedBooking.eventLocation}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#A8A29E]">
                  Booking Request Date
                </p>
                <p className="mt-1 font-medium text-[#44403C]">
                  {formatDate(selectedBooking.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#A8A29E]">Booking Status</p>
                <span
                  className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[selectedBooking.status]}`}
                >
                  {selectedBooking.status}
                </span>
              </div>

              <div>
                <p className="text-xs text-[#A8A29E]">Your Message</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#57534E]">
                  {selectedBooking.message || "No additional message."}
                </p>
              </div>

              {selectedBooking.status === "Pending" && (
                <button
                  onClick={() =>
                    handleCancelBooking(selectedBooking._id)
                  }
                  disabled={cancellingId === selectedBooking._id}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-50 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                >
                  <Ban className="size-4" />
                  {cancellingId === selectedBooking._id
                    ? "Cancelling..."
                    : "Cancel Booking"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
