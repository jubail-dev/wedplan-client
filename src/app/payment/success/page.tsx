
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Crown,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

interface VendorStatsResponse {
  success: boolean;
  stats?: {
    subscriptionPlan: "free" | "premium";
  };
  message?: string;
}

type PaymentStatus = "checking" | "success" | "pending" | "error";

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState<PaymentStatus>("checking");
  const [message, setMessage] = useState(
    "Please wait while we verify your payment.",
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const verifyPayment = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setStatus("checking");
      setMessage("Checking your subscription status...");

      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        throw new Error("Unable to retrieve authentication token.");
      }

      const tokenData: { token?: string } = await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error("Please sign in again to verify your payment.");
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

      if (!response.ok || !result.success || !result.stats) {
        throw new Error(
          result.message || "Unable to verify your subscription.",
        );
      }

      if (result.stats.subscriptionPlan === "premium") {
        setStatus("success");
        setMessage(
          "Your payment has been verified and your Premium subscription is now active.",
        );
      } else {
        setStatus("pending");
        setMessage(
          "Your payment return was received, but Premium activation is still being processed. Please check again shortly.",
        );
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while verifying your payment.",
      );
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void verifyPayment();
  }, [verifyPayment]);

  const isSuccess = status === "success";
  const isPending = status === "pending";
  const isError = status === "error";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4 py-12">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-[#E9DED2] bg-white shadow-lg">
        <div
          className={`flex flex-col items-center px-6 py-10 text-center sm:px-10 ${
            isSuccess ? "bg-[#F5F8EF]" : "bg-[#FFFAFA]"
          }`}
        >
          <div
            className={`flex size-20 items-center justify-center rounded-full ${
              isSuccess
                ? "bg-green-100 text-green-600"
                : isPending
                  ? "bg-[#F1E3C8] text-[#9A7135]"
                  : isError
                    ? "bg-red-100 text-red-600"
                    : "bg-[#FCECEF] text-[#D97985]"
            }`}
          >
            {status === "checking" ? (
              <LoaderCircle size={38} className="animate-spin" />
            ) : isSuccess ? (
              <CheckCircle2 size={42} />
            ) : isPending ? (
              <Clock size={40} />
            ) : isError ? (
              <XCircle size={40} />
            ) : null}
          </div>

          <h1 className="mt-6 font-heading text-3xl font-bold text-stone-800">
            {isSuccess
              ? "Payment Successful!"
              : isPending
                ? "Payment Processing"
                : isError
                  ? "Verification Failed"
                  : "Verifying Your Payment"}
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-stone-500">
            {message}
          </p>
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          {isSuccess && (
            <div className="rounded-2xl border border-[#E9DED2] bg-[#FFFEFC] p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#F1E3C8] text-[#9A7135]">
                  <Crown size={23} />
                </div>

                <div>
                  <h2 className="font-semibold text-stone-800">
                    Premium Lifetime Access
                  </h2>
                  <p className="mt-1 text-xs text-stone-500">
                    Your Premium plan is now active.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-[#E9DED2] pt-4 text-sm font-medium text-green-700">
                <ShieldCheck size={18} />
                Payment verified by our server
              </div>
            </div>
          )}

          {isPending && (
            <div className="rounded-xl border border-[#E9DED2] bg-[#FFFEFC] p-4">
              <p className="text-sm leading-6 text-stone-600">
                Stripe has returned you to WedPlan. Our payment webhook
                may still be processing your transaction. Your account
                will show Premium once the server verifies the payment.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {(isPending || isError) && (
              <button
                type="button"
                onClick={() => void verifyPayment()}
                disabled={isRefreshing}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#D97985] px-5 text-sm font-semibold text-white transition hover:bg-[#C76B77] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRefreshing ? (
                  <LoaderCircle size={18} className="animate-spin" />
                ) : (
                  <RefreshCw size={17} />
                )}
                Check Payment Status
              </button>
            )}

            <Link
              href="/dashboard/vendor/subscription"
              className="flex h-12 items-center justify-center rounded-xl border border-[#E9DED2] bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-[#FAF7F2]"
            >
              Back to Subscription
            </Link>

            <Link
              href="/dashboard/vendor"
              className="text-center text-sm font-medium text-[#D97985] transition hover:text-[#C76B77]"
            >
              Go to Vendor Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
