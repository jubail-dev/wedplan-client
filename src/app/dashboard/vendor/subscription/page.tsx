
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Crown,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Infinity as InfinityIcon,
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

interface CheckoutResponse {
  success?: boolean;
  message?: string;
  url?: string;
}

export default function VendorSubscriptionPage() {
  const [stats, setStats] = useState<VendorStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const fetchSubscription = useCallback(async () => {
    try {
      setIsLoading(true);

      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        throw new Error("Unable to retrieve authentication token.");
      }

      const tokenData: { token?: string } = await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error("Please sign in again to continue.");
      }

      const serverUrl = process.env.NEXT_PUBLIC_BASE_SERVER_URL;

      if (!serverUrl) {
        throw new Error("Server configuration is missing.");
      }

      const response = await fetch(
        `${serverUrl}/vendor/dashboard/stats`,
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
          result.message || "Failed to load subscription information.",
        );
      }

      setStats(result.stats);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSubscription();
  }, [fetchSubscription]);

  const handleUpgrade = async () => {
    if (isCheckoutLoading) return;

    try {
      setIsCheckoutLoading(true);

      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        throw new Error("Unable to retrieve authentication token.");
      }

      const tokenData: { token?: string } = await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error("Please sign in again to continue.");
      }

      const serverUrl = process.env.NEXT_PUBLIC_BASE_SERVER_URL;

      if (!serverUrl) {
        throw new Error("Server configuration is missing.");
      }

      const response = await fetch(
        `${serverUrl}/vendor/subscription/checkout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        },
      );

      const result: CheckoutResponse = await response.json();

      if (!response.ok || !result.success || !result.url) {
        throw new Error(
          result.message || "Unable to start Stripe Checkout.",
        );
      }

      window.location.assign(result.url);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      toast.error(message);
      setIsCheckoutLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="size-8 animate-spin text-[#D97985]" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-[#E9DED2] bg-white p-8 text-center">
        <ShieldCheck className="size-10 text-[#D97985]" />

        <h2 className="mt-4 text-xl font-semibold text-stone-800">
          Unable to Load Subscription
        </h2>

        <p className="mt-2 text-sm text-stone-500">
          We could not retrieve your current subscription information.
        </p>

        <button
          type="button"
          onClick={() => void fetchSubscription()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#D97985] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#C76B77]"
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      </div>
    );
  }

  const isPremium = stats.subscriptionPlan === "premium";
  const activeLimit = 3;
  const usagePercentage = Math.min(
    (stats.activeServices / activeLimit) * 100,
    100,
  );
  const hasReachedLimit = stats.activeServices >= activeLimit;

  return (
    <div className="min-h-full bg-[#FAF7F2] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Page Heading */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#D97985]">
            <Crown size={17} />
            <span>VENDOR DASHBOARD</span>
          </div>

          <h1 className="font-heading text-3xl font-bold text-stone-800 sm:text-4xl">
            Subscription Plans
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500">
            Choose the right plan for your wedding business and grow
            your services with WedPlan.
          </p>
        </div>

        {/* Current Plan */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-[#E9DED2] bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex items-center gap-4">
              <div
                className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${
                  isPremium
                    ? "bg-[#F1E3C8] text-[#9A7135]"
                    : "bg-[#FCECEF] text-[#D97985]"
                }`}
              >
                {isPremium ? (
                  <Crown size={27} />
                ) : (
                  <Sparkles size={27} />
                )}
              </div>

              <div>
                <p className="text-xs font-semibold tracking-wider text-stone-400">
                  YOUR CURRENT PLAN
                </p>

                <h2 className="mt-1 font-heading text-2xl font-bold capitalize text-stone-800">
                  {stats.subscriptionPlan} Plan
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  {isPremium
                    ? "You have lifetime Premium access."
                    : "You are currently using the Free plan."}
                </p>
              </div>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                isPremium
                  ? "bg-[#F1E3C8] text-[#8A642C]"
                  : "bg-[#FCECEF] text-[#B95F6D]"
              }`}
            >
              {isPremium ? "Premium Member" : "Free Member"}
            </span>
          </div>

          <div className="border-t border-[#F0E9E1] bg-[#FFFEFC] px-6 py-5 sm:px-8">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-stone-700">
                Active Services Usage
              </p>

              <p className="text-sm font-semibold text-stone-700">
                {stats.activeServices}{" "}
                <span className="font-normal text-stone-400">
                  / {isPremium ? "Unlimited" : "3"}
                </span>
              </p>
            </div>

            {!isPremium && (
              <div className="h-2 overflow-hidden rounded-full bg-[#F5E9E7]">
                <div
                  className="h-full rounded-full bg-[#D97985] transition-all"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            )}

            <p className="mt-3 text-xs leading-5 text-stone-500">
              {isPremium
                ? "Your Premium plan allows unlimited active services."
                : hasReachedLimit
                  ? "You have reached your Free plan limit. Upgrade to Premium to publish unlimited services."
                  : `You can publish ${activeLimit - stats.activeServices} more active service${activeLimit - stats.activeServices === 1 ? "" : "s"} with your Free plan.`}
            </p>
          </div>
        </section>

        {/* Plan Comparison */}
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          {/* Free Plan */}
          <section className="flex flex-col rounded-2xl border border-[#E9DED2] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-[#FCECEF] text-[#D97985]">
                <Sparkles size={23} />
              </div>

              {stats.subscriptionPlan === "free" && (
                <span className="rounded-full bg-[#FCECEF] px-3 py-1.5 text-xs font-semibold text-[#B95F6D]">
                  CURRENT PLAN
                </span>
              )}
            </div>

            <h2 className="mt-6 font-heading text-2xl font-bold text-stone-800">
              Free Plan
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              A simple way to get started with your wedding business.
            </p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-heading text-4xl font-bold text-stone-800">
                $0
              </span>
              <span className="text-sm text-stone-400">/ forever</span>
            </div>

            <div className="my-7 border-t border-dashed border-[#E9DED2]" />

            <p className="mb-5 text-sm font-semibold text-stone-700">
              What&apos;s included
            </p>

            <ul className="flex-1 space-y-4">
              {[
                "Maximum 3 Active Services",
                "Basic Vendor Dashboard",
                "Booking Request Management",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-stone-600"
                >
                  <Check
                    size={18}
                    className="mt-0.5 shrink-0 text-[#D97985]"
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-[#E9DED2] bg-[#FAF7F2] px-5 py-3.5 text-center text-sm font-semibold text-stone-500">
              {stats.subscriptionPlan === "free"
                ? "Your Current Plan"
                : "Free Plan"}
            </div>
          </section>

          {/* Premium Plan */}
          <section className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#D9BD83] bg-white p-6 shadow-md sm:p-8">
            <div className="absolute right-0 top-0 rounded-bl-xl bg-[#F1E3C8] px-4 py-2 text-xs font-bold text-[#8A642C]">
              RECOMMENDED
            </div>

            <div className="flex size-12 items-center justify-center rounded-xl bg-[#F1E3C8] text-[#9A7135]">
              <Crown size={24} />
            </div>

            <h2 className="mt-6 font-heading text-2xl font-bold text-stone-800">
              Premium Plan
            </h2>

            <p className="mt-2 text-sm leading-6 text-stone-500">
              Unlock unlimited publishing and grow your wedding business
              without limits.
            </p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-heading text-4xl font-bold text-stone-800">
                $99
              </span>
              <span className="text-sm text-stone-400">/ lifetime</span>
            </div>

            <p className="mt-1 text-xs text-stone-400">
              One-time payment. Lifetime access.
            </p>

            <div className="my-7 border-t border-dashed border-[#E9DED2]" />

            <p className="mb-5 text-sm font-semibold text-stone-700">
              Everything in Free, plus
            </p>

            <ul className="flex-1 space-y-4">
              {[
                "Unlimited Active Services",
                "Premium Vendor Badge",
                "All Free Plan Benefits",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-stone-600"
                >
                  <Check
                    size={18}
                    className="mt-0.5 shrink-0 text-[#A17B3D]"
                  />
                  {feature}
                </li>
              ))}
            </ul>

            {isPremium ? (
              <div className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-[#F1E3C8] px-5 py-3.5 text-sm font-semibold text-[#8A642C]">
                <Check size={18} />
                Lifetime Premium Activated
              </div>
            ) : (
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={isCheckoutLoading}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D97985] px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#D97985]/20 transition hover:bg-[#C76B77] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCheckoutLoading ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Redirecting to Checkout...
                  </>
                ) : (
                  <>
                    <Crown size={18} />
                    Upgrade to Premium
                  </>
                )}
              </button>
            )}
          </section>
        </div>

        {/* Security Notice */}
        <div className="mt-8 flex gap-3 rounded-2xl border border-[#E9DED2] bg-white p-5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F1E3C8] text-[#9A7135]">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-700">
              Secure Payment with Stripe
            </h3>

            <p className="mt-1 text-xs leading-5 text-stone-500">
              Your payment is processed securely through Stripe Checkout.
              Premium access will be activated after successful payment
              confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
