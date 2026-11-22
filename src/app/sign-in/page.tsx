"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        toast.error(result.error.message || "Sign in failed.");
        return;
      }

      const role = result.data?.user?.role;

      const callbackURL = new URLSearchParams(window.location.search).get(
        "callbackURL",
      );

      const safeCallbackURL =
        callbackURL &&
        callbackURL.startsWith("/") &&
        !callbackURL.startsWith("//") &&
        !callbackURL.includes("\\")
          ? callbackURL
          : null;

      const redirectURL =
        safeCallbackURL ||
        (role === "admin"
          ? "/dashboard/admin"
          : role === "vendor"
            ? "/dashboard/vendor"
            : "/dashboard/customer");

      toast.success("Welcome back to WedPlan!");

      router.push(redirectURL);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/customer",
      });

      if (result.error) {
        toast.error(result.error.message || "Google sign in failed.");
        setIsGoogleLoading(false);
      }
    } catch {
      toast.error("Unable to sign in with Google.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:py-14">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-[#E9DED2] bg-white shadow-[0_20px_70px_rgba(80,50,40,0.10)] lg:min-h-[680px] lg:grid-cols-2">
        {/* Left Visual Section */}
        <section
          className="relative hidden bg-cover bg-center lg:block"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(35,24,25,0.12), rgba(35,24,25,0.76)), url('https://i0.wp.com/royalluxuryevents.com/wp-content/uploads/2024/06/Serah-Seun_Romantic-Fairytale-Wedding_16.jpg?fit=1500%2C1000&ssl=1')",
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
                <Heart className="size-6 fill-[#F1C7C9] text-[#F1C7C9]" />
              </div>
              <span className="font-heading text-3xl font-semibold">
                WedPlan
              </span>
            </Link>

            <div className="max-w-md">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
                <Sparkles className="size-4 text-[#F1E3C8]" />
                Your beautiful journey continues
              </div>

              <h1 className="font-heading text-5xl leading-tight font-semibold">
                Every love story deserves a beautiful beginning.
              </h1>

              <p className="mt-5 text-base leading-7 text-white/85">
                Sign in to discover trusted wedding professionals and continue
                planning your perfect celebration.
              </p>
            </div>

            <p className="text-sm text-white/70">
              Make every wedding moment unforgettable.
            </p>
          </div>
        </section>

        {/* Right Login Form */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-14">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-9 flex items-center gap-2 lg:hidden">
              <Heart className="size-7 fill-[#D97985] text-[#D97985]" />
              <span className="font-heading text-2xl font-semibold text-[#292524]">
                WedPlan
              </span>
            </Link>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold tracking-[0.2em] text-[#D97985] uppercase">
                Welcome Back
              </p>

              <h2 className="font-heading text-4xl font-semibold text-[#292524]">
                Sign In
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#78716C]">
                Welcome back! Enter your details to access your WedPlan account.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#44403C]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#A8A29E]" />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 w-full rounded-xl border border-[#E9DED2] bg-[#FAF7F2]/60 pr-4 pl-12 text-sm text-[#292524] outline-none transition focus:border-[#D97985] focus:ring-2 focus:ring-[#D97985]/15"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#44403C]"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#A8A29E]" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 w-full rounded-xl border border-[#E9DED2] bg-[#FAF7F2]/60 pr-12 pl-12 text-sm text-[#292524] outline-none transition focus:border-[#D97985] focus:ring-2 focus:ring-[#D97985]/15"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-[#A8A29E] transition hover:text-[#D97985]"
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D97985] px-5 text-sm font-semibold text-white shadow-lg shadow-[#D97985]/20 transition hover:bg-[#C96573] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="size-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E9DED2]" />
              <span className="text-xs font-medium text-[#A8A29E]">
                OR CONTINUE WITH
              </span>
              <div className="h-px flex-1 bg-[#E9DED2]" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#E9DED2] bg-white text-sm font-semibold text-[#44403C] transition hover:bg-[#FAF7F2] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <LoaderCircle className="size-5 animate-spin" />
              ) : (
                <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
                    transform="translate(0 6)"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.73 6C44.45 37.91 46.98 31.81 46.98 24.55Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z"
                    transform="translate(0 0)"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.88 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                  />
                </svg>
              )}
              Continue with Google
            </button>

            <p className="mt-8 text-center text-sm text-[#78716C]">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-[#D97985] transition hover:text-[#C96573]"
              >
                Create Account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
