export const instant = false;
import CustomerStats from "@/components/dashboard/customer-stats";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function CustomerDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "customer") {
    redirect(
      session.user.role === "vendor"
        ? "/dashboard/vendor"
        : "/",
    );
  }

  return (
    <main className="flex-1 bg-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 lg:py-14">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold tracking-widest text-[#D97985] uppercase">
            Customer Dashboard
          </p>

          <h1 className="font-heading text-3xl font-semibold text-[#292524] sm:text-4xl">
            Welcome back, {session.user.name}!
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#78716C]">
            Manage your wedding bookings and keep track of your
            planning journey.
          </p>
        </div>

        {/* Booking Overview */}
        <section>
          <h2 className="mb-5 font-heading text-2xl font-semibold text-[#292524]">
            Booking Overview
          </h2>

          <CustomerStats />
        </section>

        {/* Wedding Journey */}
        <section className="mt-10 rounded-2xl border border-[#E9DED2] bg-white p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[#FCECEF]">
                <Heart className="size-5 text-[#D97985]" />
              </div>

              <h2 className="font-heading text-2xl font-semibold text-[#292524]">
                Your Wedding Journey
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-[#78716C]">
                Discover trusted wedding professionals and find
                the perfect services for your special day.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D97985] px-5 text-sm font-semibold text-white transition hover:bg-[#C96573]"
            >
              Explore Services
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
