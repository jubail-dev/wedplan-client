
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Crown,
  RefreshCw,
  XCircle,
} from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9F6] px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50">
          <XCircle className="h-11 w-11 text-rose-500" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
          Payment Cancelled
        </p>

        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          No Worries!
        </h1>

        <p className="mt-4 leading-7 text-gray-500">
          Your checkout was cancelled. Your account remains on the Free Plan.
          You can upgrade to Premium whenever you are ready.
        </p>

        <div className="mt-8 rounded-2xl bg-rose-50/70 p-5 text-left">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-rose-500" />
            <p className="font-semibold text-gray-800">
              What happens next?
            </p>
          </div>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            No Premium subscription has been activated from this checkout.
            You can return to the subscription page and try again.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/dashboard/vendor/subscription"
            className="flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 font-semibold text-white transition hover:bg-rose-600"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Link>

          <Link
            href="/dashboard/vendor"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
          <Crown className="h-4 w-4" />
          WedPlan Premium — Lifetime Access
        </div>
      </div>
    </main>
  );
}
