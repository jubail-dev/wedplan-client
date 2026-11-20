
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Settings,
  UserRound,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = authClient.useSession();

  const role = session?.user.role;
  const userName = session?.user.name || "WedPlan User";
  const userImage = session?.user.image;

  const dashboardHref =
    role === "admin"
      ? "/dashboard/admin"
      : role === "vendor"
        ? "/dashboard/vendor"
        : "/dashboard/customer";

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isProfileOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileOpen]);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message || "Unable to sign out.");
      }

      closeMenus();
      toast.success("Signed out successfully.");

      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSigningOut(false);
    }
  };

  const ProfileAvatar = ({ size = "normal" }: { size?: "normal" | "small" }) => {
    const dimension =
      size === "small" ? "h-10 w-10" : "h-11 w-11";

    return (
      <div
        className={`relative flex ${dimension} shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-[#F6D9D9] to-[#E9CBA8] shadow-sm`}
      >
        {userImage ? (
          <Image
            src={userImage}
            alt={userName}
            fill
            sizes="44px"
            unoptimized
            className="object-cover"
          />
        ) : (
          <span className="text-base font-bold text-[#A65D65]">
            {userName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    );
  };

  const ProfileDropdown = () => (
    <div
      ref={profileRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setIsProfileOpen((previous) => !previous)}
        aria-expanded={isProfileOpen}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        className={`group flex items-center gap-2.5 rounded-full border px-2 py-1.5 transition-all duration-300 ${
          isProfileOpen
            ? "border-[#D97985]/50 bg-white shadow-md"
            : "border-[#E9DED2] bg-white/70 hover:border-[#D97985]/50 hover:bg-white hover:shadow-md"
        }`}
      >
        <ProfileAvatar />

        <span className="hidden max-w-28 truncate text-sm font-semibold text-[#44403C] lg:block">
          {userName}
        </span>

        <ChevronDown
          size={16}
          className={`mr-1 text-[#A67B71] transition-transform duration-300 ${
            isProfileOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isProfileOpen && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+14px)] z-[60] w-[290px] overflow-hidden rounded-2xl border border-[#E9DED2] bg-[#FFFCF8] shadow-[0_20px_60px_rgba(75,55,45,0.16)] animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Profile Header */}
          <div className="relative overflow-hidden border-b border-[#F0E5DA] bg-gradient-to-br from-[#FDF2EF] via-[#FFF9F4] to-[#F7EBDD] p-5">
            <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full border border-[#D97985]/10" />
            <div className="absolute -right-3 -top-5 h-16 w-16 rounded-full border border-[#D97985]/15" />

            <div className="relative flex items-center gap-3">
              <div className="rounded-full bg-white p-1 shadow-md">
                <ProfileAvatar />
              </div>

              <div className="min-w-0">
                <p className="truncate text-base font-bold text-[#292524]">
                  {userName}
                </p>
                <p className="mt-0.5 truncate text-xs text-[#78716C]">
                  {session?.user.email}
                </p>

                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#D9B987]/40 bg-white/80 px-2.5 py-1">
                  <Sparkles size={11} className="text-[#B88C4A]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#96713C]">
                    {role || "Member"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dropdown Links */}
          <div className="p-2.5">
            <Link
              href={dashboardHref}
              role="menuitem"
              onClick={closeMenus}
              className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#F8ECE9]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F9E5E5] text-[#C36E78] transition-colors group-hover:bg-[#F2D5D6]">
                <LayoutDashboard size={17} />
              </span>

              <span className="flex-1">
                <span className="block text-sm font-semibold text-[#44403C]">
                  Dashboard
                </span>
                <span className="mt-0.5 block text-[11px] text-[#A8A29E]">
                  Manage your account
                </span>
              </span>

              <ArrowRight
                size={15}
                className="text-[#C4A6A0] transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/dashboard/profile"
              role="menuitem"
              onClick={closeMenus}
              className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#F8ECE9]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4EBDD] text-[#A88751] transition-colors group-hover:bg-[#EDE0CC]">
                <Settings size={17} />
              </span>

              <span className="flex-1">
                <span className="block text-sm font-semibold text-[#44403C]">
                  Profile Settings
                </span>
                <span className="mt-0.5 block text-[11px] text-[#A8A29E]">
                  Update your information
                </span>
              </span>

              <ArrowRight
                size={15}
                className="text-[#C4A6A0] transition-transform group-hover:translate-x-1"
              />
            </Link>

            <div className="my-2 border-t border-dashed border-[#E9DED2]" />

            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-[#FCEBEC] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FCEBEC] text-[#C56573] transition-colors group-hover:bg-[#F5D9DC]">
                <LogOut size={17} />
              </span>

              <span>
                <span className="block text-sm font-semibold text-[#C56573]">
                  {isSigningOut ? "Signing Out..." : "Sign Out"}
                </span>
                <span className="mt-0.5 block text-[11px] text-[#B69A96]">
                  See you again soon
                </span>
              </span>
            </button>
          </div>

          <div className="border-t border-[#F0E5DA] px-4 py-3 text-center">
            <p className="text-[10px] font-medium tracking-wide text-[#B0A098]">
              MADE WITH LOVE · WEDPLAN
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E9DED2]/80 bg-[#FAF7F2]/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="group flex items-center gap-2.5"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:scale-105"
          >
            <circle
              cx="13"
              cy="17"
              r="8"
              stroke="#D97985"
              strokeWidth="2"
            />
            <circle
              cx="21"
              cy="17"
              r="8"
              stroke="#D6B477"
              strokeWidth="2"
            />
          </svg>

          <span className="font-heading text-2xl font-semibold tracking-tight text-[#292524]">
            WedPlan
            <span className="text-[#D97985]">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative py-2 text-sm font-medium text-[#57534E] transition-colors duration-200 hover:text-[#C56573] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-[#D97985] after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 md:flex">
          {!isPending &&
            (session ? (
              <ProfileDropdown />
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-semibold text-[#57534E] transition-colors hover:text-[#C56573]"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D97985] to-[#C96D7A] px-6 py-3 text-sm font-semibold text-white shadow-[0_5px_15px_rgba(201,109,122,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgba(201,109,122,0.3)]"
                >
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              </>
            ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((previous) => !previous)}
          className="rounded-xl border border-[#E9DED2] bg-white/70 p-2.5 text-[#57534E] transition-colors hover:bg-[#F1E3C8] md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-[#E9DED2] bg-[#FFFCF8] px-5 py-5 shadow-lg md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenus}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-[#57534E] transition-colors hover:bg-[#F8ECE9] hover:text-[#C56573]"
              >
                {link.name}
              </Link>
            ))}

            {!isPending &&
              (session ? (
                <>
                  <div className="my-2 border-t border-[#E9DED2]" />

                  {/* Mobile Profile Information */}
                  <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#FDF2EF] to-[#F7EBDD] p-3">
                    <ProfileAvatar size="small" />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#292524]">
                        {userName}
                      </p>
                      <p className="truncate text-xs text-[#78716C]">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={dashboardHref}
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#57534E] transition-colors hover:bg-[#F8ECE9]"
                  >
                    <LayoutDashboard size={18} className="text-[#C36E78]" />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#57534E] transition-colors hover:bg-[#F8ECE9]"
                  >
                    <UserRound size={18} className="text-[#A88751]" />
                    Profile Settings
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#C56573] transition-colors hover:bg-[#FCEBEC] disabled:opacity-60"
                  >
                    <LogOut size={18} />
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </button>
                </>
              ) : (
                <>
                  <div className="my-2 border-t border-[#E9DED2]" />

                  <Link
                    href="/sign-in"
                    onClick={closeMenus}
                    className="rounded-xl px-3 py-3 text-sm font-semibold text-[#57534E] hover:bg-[#F8ECE9]"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={closeMenus}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D97985] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#C56573]"
                  >
                    Get Started
                    <ArrowRight size={16} />
                  </Link>
                </>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}
