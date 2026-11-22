
"use client";

import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  Crown,
  Layers3,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface VendorStatsData {
  totalServices: number;
  activeServices: number;
  pendingBookingRequests: number;
  acceptedBookings: number;
  subscriptionPlan: "free" | "premium";
}

interface VendorStatsResponse {
  success: boolean;
  stats: VendorStatsData;
  message?: string;
}

const statCards = [
  {
    title: "Total Services",
    key: "totalServices",
    icon: Layers3,
    description: "All services you have created",
  },
  {
    title: "Active Services",
    key: "activeServices",
    icon: BriefcaseBusiness,
    description: "Approved and available services",
  },
  {
    title: "Pending Booking Requests",
    key: "pendingBookingRequests",
    icon: Clock,
    description: "Requests waiting for your response",
  },
  {
    title: "Accepted Bookings",
    key: "acceptedBookings",
    icon: CheckCircle2,
    description: "Successfully accepted bookings",
  },
] as const;

export default function VendorStats() {
  const [stats, setStats] = useState<VendorStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        throw new Error("Unable to retrieve authentication token.");
      }

      const tokenData: { token?: string } = await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/vendor/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        },
      );

      const result: VendorStatsResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load dashboard statistics.",
        );
      }

      setStats(result.stats);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-2xl border border-[#E9DED2] bg-white/70"
          />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
        <p className="text-sm text-red-600">
          {error || "Unable to load dashboard statistics."}
        </p>

        <button
          onClick={fetchStats}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#D97985] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#c76b77]"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.key}
              className="rounded-2xl border border-[#E9DED2] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-[#FCECEF] p-3 text-[#D97985]">
                  <Icon size={22} />
                </div>

                <span className="text-3xl font-semibold text-[#292524]">
                  {stats[card.key]}
                </span>
              </div>

              <h3 className="mt-5 text-sm font-semibold text-[#292524]">
                {card.title}
              </h3>

              <p className="mt-1 text-xs text-[#78716C]">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E9DED2] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-[#F1E3C8] p-3 text-[#9A7135]">
            <Crown size={23} />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-[#292524]">
              Current Subscription Plan
            </h3>
            <p className="mt-1 text-sm capitalize text-[#78716C]">
              {stats.subscriptionPlan} Plan
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#F1E3C8] px-4 py-2 text-sm font-semibold capitalize text-[#8A642C]">
          {stats.subscriptionPlan}
        </span>
      </div>
    </div>
  );
}
