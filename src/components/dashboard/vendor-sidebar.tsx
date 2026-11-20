
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  PlusCircle,
  ClipboardList,
  Crown,
  UserRound,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    label: "Overview",
    href: "/dashboard/vendor",
    icon: LayoutDashboard,
  },
  {
    label: "My Services",
    href: "/dashboard/vendor/services",
    icon: BriefcaseBusiness,
  },
  {
    label: "Add Service",
    href: "/dashboard/vendor/add-service",
    icon: PlusCircle,
  },
  {
    label: "Booking Requests",
    href: "/dashboard/vendor/bookings",
    icon: ClipboardList,
  },
  {
    label: "Subscription",
    href: "/dashboard/vendor/subscription",
    icon: Crown,
  },
  {
    label: "Profile Settings",
    href: "/dashboard/profile",
    icon: UserRound,
  },
];

export default function VendorSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="border-b border-[#E9DED2] px-6 py-7">
        <Link
          href="/"
          className="font-heading text-2xl font-bold text-[#D97985]"
        >
          WedPlan
        </Link>
        <p className="mt-1 text-xs tracking-wider text-[#A8A29E]">
          VENDOR DASHBOARD
        </p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard/vendor" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-[#FCECEF] text-[#D97985]"
                  : "text-[#78716C] hover:bg-[#FAF7F2] hover:text-[#D97985]"
              }`}
            >
              <Icon className="size-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#E9DED2] p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#78716C] transition hover:bg-[#FAF7F2] hover:text-[#D97985]"
        >
          <ArrowLeft className="size-5" />
          Back to Website
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex size-10 items-center justify-center rounded-xl border border-[#E9DED2] bg-white text-[#57534E] shadow-sm lg:hidden"
        aria-label="Open dashboard menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden min-h-full w-64 shrink-0 flex-col border-r border-[#E9DED2] bg-white lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-label="Close dashboard menu"
          />

          <aside className="relative flex h-full w-72 flex-col bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-5 z-10 flex size-9 items-center justify-center rounded-full bg-[#FAF7F2] text-[#78716C]"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>

            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
