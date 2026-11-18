
import Link from "next/link";
import { ArrowRight, CalendarDays, Plus } from "lucide-react";
import VendorStats from "@/components/dashboard/vendor-stats";

export default function VendorDashboardPage() {
  return (
    <main className="min-h-full px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Section */}
        <section>
          <p className="text-sm font-medium tracking-wide text-[#D97985]">
            VENDOR DASHBOARD
          </p>

          <div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h1 className="font-heading text-3xl font-bold text-[#292524] sm:text-4xl">
                Welcome Back!
              </h1>

              <p className="mt-2 text-sm text-[#78716C]">
                Manage your wedding services and keep track of your bookings.
              </p>
            </div>

            <Link
              href="/dashboard/vendor/add-service"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D97985] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#C76B77]"
            >
              <Plus size={18} />
              Add New Service
            </Link>
          </div>
        </section>

        {/* Dashboard Statistics */}
        <section className="space-y-5">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-[#292524]">
              Overview
            </h2>

            <p className="mt-1 text-sm text-[#78716C]">
              Here is a summary of your business performance.
            </p>
          </div>

          <VendorStats />
        </section>

        {/* Quick Actions */}
        <section className="space-y-5">
          <div>
            <h2 className="font-heading text-2xl font-semibold text-[#292524]">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-[#78716C]">
              Quickly access your important dashboard sections.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Link
              href="/dashboard/vendor/services"
              className="group flex items-center justify-between rounded-2xl border border-[#E9DED2] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-[#FCECEF] p-3 text-[#D97985]">
                  <CalendarDays size={23} />
                </div>

                <div>
                  <h3 className="font-semibold text-[#292524]">
                    Manage Services
                  </h3>
                  <p className="mt-1 text-sm text-[#78716C]">
                    View and manage your wedding services.
                  </p>
                </div>
              </div>

              <ArrowRight
                size={20}
                className="text-[#A8A29E] transition group-hover:translate-x-1 group-hover:text-[#D97985]"
              />
            </Link>

            <Link
              href="/dashboard/vendor/bookings"
              className="group flex items-center justify-between rounded-2xl border border-[#E9DED2] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-[#F1E3C8] p-3 text-[#9A7135]">
                  <CalendarDays size={23} />
                </div>

                <div>
                  <h3 className="font-semibold text-[#292524]">
                    Booking Requests
                  </h3>
                  <p className="mt-1 text-sm text-[#78716C]">
                    Review and respond to customer requests.
                  </p>
                </div>
              </div>

              <ArrowRight
                size={20}
                className="text-[#A8A29E] transition group-hover:translate-x-1 group-hover:text-[#D97985]"
              />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
