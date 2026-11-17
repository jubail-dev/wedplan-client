
import Link from "next/link";
import { Camera, Users, Mail, Phone, MapPin } from "lucide-react";
const footerLinks = {
  explore: [
    { name: "Home", href: "/" },
    { name: "Browse Services", href: "/services" },
    { name: "About Us", href: "/about" },
  ],
  account: [
    { name: "Sign In", href: "/sign-in" },
    { name: "Create Account", href: "/sign-up" },
    { name: "Become a Vendor", href: "/sign-up" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[#E9DED2] bg-[#F3EEE7]">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
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

              <span className="font-heading text-2xl font-semibold text-[#292524]">
                WedPlan
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-7 text-[#78716C]">
              Discover trusted wedding vendors and bring your dream wedding
              to life with a little help from WedPlan.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="rounded-full border border-[#E9DED2] p-2.5 text-[#78716C] transition-colors hover:border-[#D97985] hover:text-[#D97985]"
              >
                <Camera size={18} />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="rounded-full border border-[#E9DED2] p-2.5 text-[#78716C] transition-colors hover:border-[#D97985] hover:text-[#D97985]"
              >
                <Users size={18} />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-[#292524]">
              Explore
            </h3>

            <ul className="mt-5 space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#78716C] transition-colors hover:text-[#D97985]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-[#292524]">
              Your Account
            </h3>

            <ul className="mt-5 space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#78716C] transition-colors hover:text-[#D97985]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-[#292524]">
              Get in Touch
            </h3>

            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3 text-sm text-[#78716C]">
                <Mail size={17} className="mt-0.5 shrink-0 text-[#D97985]" />
                <span>support@wedplan.com</span>
              </li>

              <li className="flex items-start gap-3 text-sm text-[#78716C]">
                <Phone size={17} className="mt-0.5 shrink-0 text-[#D97985]" />
                <span>Contact us for assistance</span>
              </li>

              <li className="flex items-start gap-3 text-sm text-[#78716C]">
                <MapPin size={17} className="mt-0.5 shrink-0 text-[#D97985]" />
                <span>Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E9DED2] pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-[#78716C]">
           &copy; 2026 WedPlan. All rights reserved.
          </p>

          <p className="font-heading text-sm italic text-[#A17B69]">
            Making every love story beautiful.
          </p>
        </div>
      </div>
    </footer>
  );
}
