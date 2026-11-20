
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Settings,
  Heart,
  Menu,
  X,
  Home,
  ChevronRight,
} from "lucide-react";

const navigation = [
  {
    title: "Overview",
    href: "/dashboard/customer",
    icon: LayoutDashboard,
  },
  {
    title: "My Bookings",
    href: "/dashboard/customer/bookings",
    icon: CalendarDays,
  },
  {
    title: "Profile Settings",
    href: "/dashboard/profile",
    icon: Settings,
  },
];

export default function CustomerSidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard/customer") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-20 z-40 flex items-center justify-between border-b border-[#E9DED2] bg-white px-5 py-3 lg:hidden">
        <span className="font-heading text-lg font-semibold text-[#292524]">
          Customer Dashboard
        </span>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          className="flex size-10 items-center justify-center rounded-lg border border-[#E9DED2] text-[#44403C]"
        >
          {isMobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[137px] z-30 bg-black/30 lg:hidden">
          <aside className="h-full w-72 border-r border-[#E9DED2] bg-white p-5 shadow-xl">
            <SidebarContent
              pathname={pathname}
              isActive={isActive}
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden min-h-full w-72 shrink-0 border-r border-[#E9DED2] bg-white p-5 lg:block">
        <SidebarContent
          pathname={pathname}
          isActive={isActive}
        />
      </aside>
    </>
  );
}

function SidebarContent({
  pathname,
  isActive,
  onNavigate,
}: {
  pathname: string;
  isActive: (href: string) => boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <Link
        href="/dashboard/customer"
        onClick={onNavigate}
        className="mb-9 flex items-center gap-3 px-2"
      >
        <div className="flex size-11 items-center justify-center rounded-xl bg-[#FCECEF]">
          <Heart className="size-6 fill-[#D97985] text-[#D97985]" />
        </div>

        <div>
          <h2 className="font-heading text-2xl font-semibold text-[#292524]">
            WedPlan
          </h2>
          <p className="text-xs text-[#A8A29E]">
            Customer Portal
          </p>
        </div>
      </Link>

      <div className="mb-3 px-3 text-xs font-semibold tracking-widest text-[#A8A29E] uppercase">
        Dashboard Menu
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-[#FCECEF] text-[#C96573]"
                  : "text-[#78716C] hover:bg-[#FAF7F2] hover:text-[#292524]"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="size-5" />
                {item.title}
              </span>

              {active && <ChevronRight className="size-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[#E9DED2] pt-5">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#78716C] transition hover:bg-[#FAF7F2] hover:text-[#292524]"
        >
          <Home className="size-5" />
          Back to Website
        </Link>
      </div>
    </div>
  );
}
