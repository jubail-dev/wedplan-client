
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  MapPin,
  Mail,
  User,
  Package,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  ClipboardList,
  Clock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

type BookingStatus = "Pending" | "Accepted" | "Rejected" | "Cancelled";

interface BookingService {
  _id: string;
  serviceName: string;
  category: string;
  price: number;
  image?: string;
  images?: string[];
}

interface BookingCustomer {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

interface VendorBooking {
  _id: string;
  serviceId: string;
  customerId: string;
  vendorId: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
  service?: BookingService;
  customer?: BookingCustomer;
}

interface BookingsApiResponse {
  success: boolean;
  bookings: VendorBooking[];
  message?: string;
}

interface UpdateBookingResponse {
  success: boolean;
  message?: string;
}

type BookingFilter = "All" | BookingStatus;

const filters: BookingFilter[] = [
  "All",
  "Pending",
  "Accepted",
  "Rejected",
];

export default function VendorBookingsPage() {
  const [bookings, setBookings] = useState<VendorBooking[]>([]);
  const [activeFilter, setActiveFilter] =
    useState<BookingFilter>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(
    null,
  );

  // Fetch Vendor Booking Requests
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const tokenResponse = await fetch("/api/auth/token", {
        cache: "no-store",
      });

      const tokenData: { token?: string } =
        await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Authentication Token Not Found!");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/vendor/bookings`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        },
      );

      const data: BookingsApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to Fetch Booking Requests!",
        );
      }

      setBookings(data.bookings);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something Went Wrong!";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  // Accept or Reject Booking
  const handleBookingAction = async (
    booking: VendorBooking,
    status: "Accepted" | "Rejected",
  ) => {
    if (booking.status !== "Pending" || processingId) {
      return;
    }

    try {
      setProcessingId(booking._id);

      const tokenResponse = await fetch("/api/auth/token", {
        cache: "no-store",
      });

      const tokenData: { token?: string } =
        await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Authentication Token Not Found!");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/vendor/bookings/${booking._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      const data: UpdateBookingResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to Update Booking!",
        );
      }

      setBookings((previousBookings) =>
        previousBookings.map((item) =>
          item._id === booking._id
            ? { ...item, status }
            : item,
        ),
      );

      toast.success(
        status === "Accepted"
          ? "Booking Request Accepted Successfully!"
          : "Booking Request Rejected Successfully!",
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something Went Wrong!";

      toast.error(message);
    } finally {
      setProcessingId(null);
    }
  };

  // Filter Bookings
  const filteredBookings =
    activeFilter === "All"
      ? bookings
      : bookings.filter(
          (booking) => booking.status === activeFilter,
        );

  // Booking Counts
  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending",
  ).length;

  const acceptedCount = bookings.filter(
    (booking) => booking.status === "Accepted",
  ).length;

  const rejectedCount = bookings.filter(
    (booking) => booking.status === "Rejected",
  ).length;

  // Format Date
  const formatDate = (date: string) => {
    if (!date) return "Not Available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not Available";
    }

    return parsedDate.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Status Style
  const getStatusStyle = (status: BookingStatus) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Accepted":
        return "bg-green-50 text-green-700 border-green-200";

      case "Rejected":
        return "bg-red-50 text-red-600 border-red-200";

      case "Cancelled":
        return "bg-stone-100 text-stone-600 border-stone-200";
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#D97985]">
              <ClipboardList size={17} />
              Vendor Dashboard
              <ArrowRight size={14} />
              Booking Requests
            </div>

            <h1 className="font-heading text-3xl font-bold text-stone-800 sm:text-4xl">
              Booking Requests
            </h1>

            <p className="mt-2 text-sm text-stone-500 sm:text-base">
              Manage and review booking requests from your customers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void fetchBookings()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#E9DED2] bg-white px-4 py-3 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-[#FDFBF8] disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#E9DED2] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">
                  Total Requests
                </p>
                <h2 className="mt-2 text-3xl font-bold text-stone-800">
                  {bookings.length}
                </h2>
              </div>

              <div className="rounded-xl bg-[#FCECEF] p-3 text-[#D97985]">
                <ClipboardList size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E9DED2] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">
                  Pending
                </p>
                <h2 className="mt-2 text-3xl font-bold text-amber-600">
                  {pendingCount}
                </h2>
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E9DED2] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">
                  Accepted
                </p>
                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {acceptedCount}
                </h2>
              </div>

              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <CheckCircle2 size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E9DED2] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-500">
                  Rejected
                </p>
                <h2 className="mt-2 text-3xl font-bold text-red-600">
                  {rejectedCount}
                </h2>
              </div>

              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <XCircle size={23} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const count =
              filter === "All"
                ? bookings.length
                : bookings.filter(
                    (booking) => booking.status === filter,
                  ).length;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeFilter === filter
                    ? "bg-[#D97985] text-white shadow-sm"
                    : "border border-[#E9DED2] bg-white text-stone-600 hover:bg-[#FDFBF8]"
                }`}
              >
                {filter}
                <span className="ml-2 opacity-75">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#E9DED2] bg-white">
            <Loader2
              size={35}
              className="animate-spin text-[#D97985]"
            />
            <p className="mt-4 text-sm font-medium text-stone-500">
              Loading Booking Requests...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-5 text-center">
            <div className="rounded-full bg-red-50 p-4 text-red-500">
              <AlertCircle size={30} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-stone-800">
              Unable to Load Booking Requests
            </h3>

            <p className="mt-2 max-w-md text-sm text-stone-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void fetchBookings()}
              className="mt-5 rounded-xl bg-[#D97985] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c96976]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredBookings.length === 0 && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-[#E9DED2] bg-white px-5 text-center">
            <div className="rounded-full bg-[#FCECEF] p-5 text-[#D97985]">
              <Package size={35} />
            </div>

            <h3 className="mt-5 font-heading text-2xl font-bold text-stone-800">
              {bookings.length === 0
                ? "No Booking Requests Yet"
                : `No ${activeFilter} Requests`}
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
              {bookings.length === 0
                ? "When customers request your wedding services, their booking requests will appear here."
                : `You currently have no ${activeFilter.toLowerCase()} booking requests.`}
            </p>

            {activeFilter !== "All" && bookings.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter("All")}
                className="mt-5 rounded-xl bg-[#D97985] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c96976]"
              >
                View All Requests
              </button>
            )}
          </div>
        )}

        {/* Booking Cards */}
        {!loading && !error && filteredBookings.length > 0 && (
          <div className="space-y-5">
            {filteredBookings.map((booking) => {
              const serviceImage =
                booking.service?.image ||
                booking.service?.images?.[0];

              const isProcessing =
                processingId === booking._id;

              return (
                <article
                  key={booking._id}
                  className="overflow-hidden rounded-2xl border border-[#E9DED2] bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="p-5 sm:p-6">

                    {/* Card Header */}
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs font-medium text-stone-400">
                        <CalendarDays size={15} />
                        Requested on {formatDate(booking.createdAt)}
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {/* Main Content */}
                    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">

                      {/* Service Information */}
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-stone-700">
                          <Package size={17} className="text-[#D97985]" />
                          Service Information
                        </h3>

                        <div className="flex gap-4 rounded-xl bg-[#FAF7F2] p-3">
                          <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-[#F1E3C8]">
                            {serviceImage ? (
                              <Image
                                src={serviceImage}
                                alt={booking.service?.serviceName || "Wedding Service"}
                                fill
                                sizes="112px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[#D97985]">
                                <Package size={30} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-heading text-lg font-bold text-stone-800">
                              {booking.service?.serviceName || "Service Unavailable"}
                            </h4>

                            <p className="mt-1 text-xs text-stone-500">
                              {booking.service?.category || "Wedding Service"}
                            </p>

                            <p className="mt-3 font-bold text-[#D97985]">
                              ৳
                              {booking.service?.price?.toLocaleString(
                                "en-BD",
                              ) || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Customer Information */}
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-stone-700">
                          <User size={17} className="text-[#D97985]" />
                          Customer Information
                        </h3>

                        <div className="flex items-center gap-3 rounded-xl bg-[#FAF7F2] p-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FCECEF] text-lg font-bold text-[#D97985]">
                            {booking.customer?.name
                              ?.charAt(0)
                              .toUpperCase() || "C"}
                          </div>

                          <div className="min-w-0">
                            <h4 className="truncate font-semibold text-stone-800">
                              {booking.customer?.name || "Customer"}
                            </h4>

                            <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-stone-500">
                              <Mail size={13} />
                              {booking.customer?.email || "Email unavailable"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Event Information */}
                    <div className="mt-6 grid gap-4 rounded-xl border border-[#E9DED2] p-4 sm:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-[#FCECEF] p-2 text-[#D97985]">
                          <CalendarDays size={18} />
                        </div>

                        <div>
                          <p className="text-xs font-medium text-stone-400">
                            Event Date
                          </p>
                          <p className="mt-1 text-sm font-semibold text-stone-700">
                            {formatDate(booking.eventDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-[#FCECEF] p-2 text-[#D97985]">
                          <MapPin size={18} />
                        </div>

                        <div>
                          <p className="text-xs font-medium text-stone-400">
                            Event Location
                          </p>
                          <p className="mt-1 text-sm font-semibold text-stone-700">
                            {booking.eventLocation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Message */}
                    <div className="mt-5">
                      <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-stone-700">
                        <MessageSquare
                          size={16}
                          className="text-[#D97985]"
                        />
                        Customer Message
                      </h3>

                      <div className="rounded-xl bg-[#FAF7F2] p-4 text-sm leading-6 text-stone-600">
                        {booking.message?.trim()
                          ? booking.message
                          : "No additional message provided."}
                      </div>
                    </div>

                    {/* Actions */}
                    {booking.status === "Pending" && (
                      <div className="mt-6 flex flex-col justify-end gap-3 border-t border-[#E9DED2] pt-5 sm:flex-row">
                        <button
                          type="button"
                          onClick={() =>
                            void handleBookingAction(
                              booking,
                              "Rejected",
                            )
                          }
                          disabled={processingId !== null}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <XCircle size={17} />
                          )}
                          Reject Request
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void handleBookingAction(
                              booking,
                              "Accepted",
                            )
                          }
                          disabled={processingId !== null}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D97985] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c96976] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <CheckCircle2 size={17} />
                          )}
                          Accept Request
                        </button>
                      </div>
                    )}

                    {/* Processed Information */}
                    {booking.status !== "Pending" && (
                      <div className="mt-6 flex items-center gap-2 border-t border-[#E9DED2] pt-5 text-sm text-stone-500">
                        {booking.status === "Accepted" ? (
                          <CheckCircle2
                            size={17}
                            className="text-green-600"
                          />
                        ) : (
                          <XCircle
                            size={17}
                            className="text-red-500"
                          />
                        )}

                        This booking request has already been processed.
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Footer Note */}
        {!loading && !error && bookings.length > 0 && (
          <p className="mt-6 text-center text-xs text-stone-400">
            Showing {filteredBookings.length} of {bookings.length} booking requests
          </p>
        )}
      </div>
    </main>
  );
}
