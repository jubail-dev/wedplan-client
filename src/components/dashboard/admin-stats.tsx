
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Users,
  Store,
  UserRound,
  BriefcaseBusiness,
  Clock,
  Receipt,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface AdminStatsData {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalServices: number;
  pendingServices: number;
  totalTransactions: number;
}

interface AdminStatsResponse {
  success: boolean;
  stats: AdminStatsData;
  message?: string;
}

const statCards = [
  {
    title: "Total Registered Users",
    key: "totalUsers",
    icon: Users,
    description: "All registered platform users",
  },
  {
    title: "Total Vendors",
    key: "totalVendors",
    icon: Store,
    description: "Registered service providers",
  },
  {
    title: "Total Customers",
    key: "totalCustomers",
    icon: UserRound,
    description: "Registered customers",
  },
  {
    title: "Total Services",
    key: "totalServices",
    icon: BriefcaseBusiness,
    description: "All submitted services",
  },
  {
    title: "Pending Services",
    key: "pendingServices",
    icon: Clock,
    description: "Services waiting for approval",
  },
  {
    title: "Total Transactions",
    key: "totalTransactions",
    icon: Receipt,
    description: "All recorded transactions",
  },
] as const;

export default function AdminStats() {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
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
        `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/admin/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        },
      );

      const result: AdminStatsResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load admin statistics.",
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
  }, []);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
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
          type="button"
          onClick={() => void fetchStats()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#D97985] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#c76b77]"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
  );
}
