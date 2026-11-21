
"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type CustomerStatsData = {
  totalBookings: number;
  pendingBookings: number;
  acceptedBookings: number;
  rejectedBookings: number;
};

const initialStats: CustomerStatsData = {
  totalBookings: 0,
  pendingBookings: 0,
  acceptedBookings: 0,
  rejectedBookings: 0,
};

const statItems = [
  {
    title: "Total Booking Requests",
    key: "totalBookings",
    icon: CalendarDays,
    description: "Your total booking requests",
  },
  {
    title: "Pending Bookings",
    key: "pendingBookings",
    icon: Clock3,
    description: "Waiting for vendor response",
  },
  {
    title: "Accepted Bookings",
    key: "acceptedBookings",
    icon: CheckCircle2,
    description: "Successfully accepted",
  },
  {
    title: "Rejected Bookings",
    key: "rejectedBookings",
    icon: XCircle,
    description: "Booking requests rejected",
  },
] as const;

export default function CustomerStats() {
  const [stats, setStats] = useState<CustomerStatsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const tokenResponse = await fetch("/api/auth/token", {
          cache: "no-store",
        });

        if (!tokenResponse.ok) {
          throw new Error("Failed to get authentication token.");
        }

        const { token } = await tokenResponse.json();

        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/customer/dashboard/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard statistics.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error("Could not load dashboard statistics.");
        }

        if (isMounted) {
          setStats(result.stats ?? initialStats);
        }
      } catch (error) {
        if (isMounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Something went wrong.",
          );
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {statItems.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-2xl border border-[#E9DED2] bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-11 items-center justify-center rounded-xl bg-[#FCECEF]">
                <Icon className="size-5 text-[#D97985]" />
              </div>

              <span className="text-2xl font-semibold text-[#292524]">
                {stats ? stats[stat.key] : "—"}
              </span>
            </div>

            <h3 className="mt-5 font-semibold text-[#44403C]">
              {stat.title}
            </h3>

            <p className="mt-1 text-xs text-[#A8A29E]">
              {stat.description}
            </p>
          </div>
        );
      })}

      {error && (
        <p className="text-sm text-red-500 sm:col-span-2 xl:col-span-4">
          {error}
        </p>
      )}
    </div>
  );
}
