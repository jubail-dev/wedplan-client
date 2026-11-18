
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ArrowRight, LogOut } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const role = session?.user.role;

  const dashboardHref =
    role === "admin"
      ? "/dashboard/admin"
      : role === "vendor"
        ? "/dashboard/vendor"
        : "/dashboard/customer";

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message || "Unable to sign out.");
      }

      setIsMenuOpen(false);
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

  const authenticatedLinks = [
    ...navLinks,
    ...(session ? [{ name: "Dashboard", href: dashboardHref }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E9DED2] bg-[#FAF7F2]/95 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
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
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 md:flex">
          {authenticatedLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[#57534E] transition-colors hover:text-[#D97985]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-5 md:flex">
          {!isPending &&
            (session ? (
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="inline-flex items-center gap-2 rounded-full border border-[#E9DED2] px-5 py-2.5 text-sm font-semibold text-[#57534E] transition-all hover:border-[#D97985] hover:bg-[#FCECEF] hover:text-[#C56573] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut size={16} />
                {isSigningOut ? "Signing Out..." : "Sign Out"}
              </button>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-[#57534E] transition-colors hover:text-[#D97985]"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 rounded-full bg-[#D97985] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#C56573] hover:shadow-md"
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
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 text-[#292524] transition-colors hover:bg-[#F1E3C8] md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-[#E9DED2] bg-[#FAF7F2] px-5 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            {authenticatedLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium text-[#57534E] transition-colors hover:text-[#D97985]"
              >
                {link.name}
              </Link>
            ))}

            <div className="flex flex-col gap-3 border-t border-[#E9DED2] pt-4">
              {!isPending &&
                (session ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#57534E] transition-colors hover:text-[#C56573] disabled:opacity-60"
                  >
                    <LogOut size={17} />
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </button>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm font-medium text-[#57534E]"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/sign-up"
                      onClick={() => setIsMenuOpen(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D97985] px-6 py-3 text-sm font-semibold text-white"
                    >
                      Get Started
                      <ArrowRight size={16} />
                    </Link>
                  </>
                ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
