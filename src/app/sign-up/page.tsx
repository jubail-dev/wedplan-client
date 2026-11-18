"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Heart,
  ImagePlus,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Store,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type AccountRole = "customer" | "vendor";

type UploadResponse = {
  success: boolean;
  imageUrl?: string;
  message?: string;
};

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<AccountRole>("customer");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain an uppercase letter.");
      return false;
    }

    if (!/[a-z]/.test(password)) {
      toast.error("Password must contain a lowercase letter.");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }

    return true;
  };

  const uploadProfileImage = async (): Promise<string | undefined> => {
    if (!imageFile) return undefined;

    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result: UploadResponse = await response.json();

    if (!response.ok || !result.success || !result.imageUrl) {
      throw new Error(result.message || "Profile image upload failed.");
    }

    return result.imageUrl;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const imageUrl = await uploadProfileImage();

      const { data, error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        ...(imageUrl ? { image: imageUrl } : {}),
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      if (!data) {
        toast.error("Unable to create your account. Please try again.");
        return;
      }

      toast.success("Welcome to WedPlan! Your account is ready.");

      router.push(
        role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer",
      );
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/customer",
      });

      if (error) {
        toast.error(error.message || "Google authentication failed.");
        setIsGoogleLoading(false);
      }
    } catch {
      toast.error("Unable to continue with Google.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-[#FAF7F2] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[28px] border border-[#E9DED2] bg-white shadow-[0_25px_80px_-35px_rgba(75,45,45,0.25)] lg:grid-cols-2">
        {/* Left - Wedding Visual */}
        <section
          className="relative hidden min-h-[780px] flex-col justify-between overflow-hidden bg-cover bg-center p-10 text-white lg:flex xl:p-14"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(35,24,25,0.12), rgba(35,24,25,0.72)), url('https://i0.wp.com/royalluxuryevents.com/wp-content/uploads/2024/06/Serah-Seun_Romantic-Fairytale-Wedding_16.jpg?fit=1500%2C1000&ssl=1')",
          }}
        >
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur-md">
              <Heart size={21} />
            </div>
            <span className="font-heading text-3xl font-semibold tracking-tight">
              WedPlan
            </span>
          </div>

          <div className="relative z-10 max-w-md">
            <div className="mb-5 flex items-center gap-2 text-sm font-medium tracking-[0.2em] text-white/80">
              <Sparkles size={16} />
              YOUR JOURNEY STARTS HERE
            </div>

            <h1 className="font-heading text-5xl leading-[1.15] font-medium xl:text-6xl">
              Every love story deserves a beautiful beginning.
            </h1>

            <p className="mt-6 max-w-sm text-base leading-8 text-white/80">
              Discover trusted wedding professionals and bring your dream
              celebration to life, one beautiful detail at a time.
            </p>

            <div className="mt-9 flex items-center gap-3">
              <div className="flex -space-x-3">
                {[
                  "photo-1534528741775-53994a69daeb",
                  "photo-1500648767791-00dcc994a43e",
                  "photo-1531123897727-8f129e1688ce",
                ].map((photo) => (
                  <img
                    key={photo}
                    src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=80&h=80&q=80`}
                    alt="WedPlan community member"
                    className="h-10 w-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>

              <p className="text-sm text-white/85">
                <span className="font-semibold text-white">
                  Beautiful moments
                </span>
                <br />
                Begin with WedPlan
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-6 text-xs text-white/70">
            <span>Made for your forever moments.</span>
            <span>© WedPlan</span>
          </div>
        </section>

        {/* Right - Sign Up Form */}
        <section className="px-5 py-9 sm:px-10 sm:py-12 xl:px-14">
          <div className="mx-auto max-w-md">
            {/* Mobile Branding */}
            <div className="mb-8 flex items-center gap-2 lg:hidden">
              <Heart className="text-[#D97985]" size={25} />
              <span className="font-heading text-2xl font-semibold text-[#292524]">
                WedPlan
              </span>
            </div>

            <div className="mb-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FCECEF] px-3 py-1.5 text-xs font-semibold text-[#A85867]">
                <Sparkles size={14} />
                START YOUR JOURNEY
              </div>

              <h2 className="font-heading text-4xl font-semibold tracking-tight text-[#292524]">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#78716C]">
                Join WedPlan and make your wedding planning experience
                effortless and memorable.
              </p>
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading || isSubmitting}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#E9DED2] bg-white text-sm font-semibold text-[#44403C] transition-all hover:border-[#D6B477] hover:bg-[#FFFCF8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <svg viewBox="0 0 48 48" className="h-5 w-5">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.04 13.22l7.98 6.19C11.91 13.72 17.42 9.5 24 9.5z"
                    transform="translate(0 4)"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.2 5.59c4.2-3.87 6.56-9.57 6.56-17.24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.02 28.59A14.3 14.3 0 0 1 9.25 24c0-1.59.27-3.13.77-4.59l-7.98-6.19A23.8 23.8 0 0 0 0 24c0 3.87.93 7.53 2.04 10.78z"
                    transform="translate(0 0)"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.14 15.91-5.81l-7.2-5.59c-2 1.34-4.57 2.13-8.71 2.13-6.58 0-12.09-4.22-14.06-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
              )}
              Continue with Google
            </button>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E9DED2]" />
              <span className="text-xs font-medium text-[#A8A29E]">
                OR SIGN UP WITH EMAIL
              </span>
              <div className="h-px flex-1 bg-[#E9DED2]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold text-[#44403C]"
                >
                  Full Name
                </label>
                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-[#A8A29E]"
                  />
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-xl border border-[#E9DED2] bg-[#FFFCF9] pr-4 pl-11 text-sm text-[#292524] outline-none transition-all placeholder:text-[#A8A29E] focus:border-[#D97985] focus:ring-4 focus:ring-[#D97985]/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#44403C]"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-[#A8A29E]"
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-[#E9DED2] bg-[#FFFCF9] pr-4 pl-11 text-sm text-[#292524] outline-none transition-all placeholder:text-[#A8A29E] focus:border-[#D97985] focus:ring-4 focus:ring-[#D97985]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#44403C]"
                >
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-[#A8A29E]"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a strong password"
                    className="h-12 w-full rounded-xl border border-[#E9DED2] bg-[#FFFCF9] pr-12 pl-11 text-sm text-[#292524] outline-none transition-all placeholder:text-[#A8A29E] focus:border-[#D97985] focus:ring-4 focus:ring-[#D97985]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-[#A8A29E] hover:text-[#D97985]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-[#A8A29E]">
                  At least 6 characters, one uppercase and one lowercase letter.
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#44403C]"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-[#A8A29E]"
                  />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter your password"
                    className="h-12 w-full rounded-xl border border-[#E9DED2] bg-[#FFFCF9] pr-12 pl-11 text-sm text-[#292524] outline-none transition-all placeholder:text-[#A8A29E] focus:border-[#D97985] focus:ring-4 focus:ring-[#D97985]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-[#A8A29E] hover:text-[#D97985]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Profile Image */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#44403C]">
                  Profile Image{" "}
                  <span className="font-normal text-[#A8A29E]">(Optional)</span>
                </label>

                <label
                  htmlFor="profileImage"
                  className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-[#DCC9B9] bg-[#FFFCF9] p-4 transition-all hover:border-[#D97985] hover:bg-[#FCECEF]/30"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="h-14 w-14 rounded-full border border-[#E9DED2] object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FCECEF] text-[#D97985]">
                      <ImagePlus size={23} />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#57534E]">
                      {imageFile ? imageFile.name : "Upload your photo"}
                    </p>
                    <p className="mt-1 text-xs text-[#A8A29E]">
                      JPG, PNG or WEBP · Maximum 5MB
                    </p>
                  </div>

                  <span className="rounded-lg border border-[#E9DED2] bg-white px-3 py-2 text-xs font-semibold text-[#78716C]">
                    Browse
                  </span>
                </label>

                <input
                  id="profileImage"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="sr-only"
                />

                {imageFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                      const input = document.getElementById(
                        "profileImage",
                      ) as HTMLInputElement | null;
                      if (input) input.value = "";
                    }}
                    className="mt-2 text-xs font-medium text-[#B4535A] hover:underline"
                  >
                    Remove selected image
                  </button>
                )}
              </div>

              {/* Account Role */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-[#44403C]">
                  I want to join WedPlan as
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("customer")}
                    aria-pressed={role === "customer"}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      role === "customer"
                        ? "border-[#D97985] bg-[#FCECEF]/60 ring-2 ring-[#D97985]/10"
                        : "border-[#E9DED2] bg-white hover:border-[#D6B477]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <UserRound
                        size={21}
                        className={
                          role === "customer"
                            ? "text-[#C56573]"
                            : "text-[#A8A29E]"
                        }
                      />
                      {role === "customer" && (
                        <Check size={17} className="text-[#C56573]" />
                      )}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[#44403C]">
                      Customer
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#78716C]">
                      Plan your dream wedding
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("vendor")}
                    aria-pressed={role === "vendor"}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      role === "vendor"
                        ? "border-[#D97985] bg-[#FCECEF]/60 ring-2 ring-[#D97985]/10"
                        : "border-[#E9DED2] bg-white hover:border-[#D6B477]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Store
                        size={21}
                        className={
                          role === "vendor"
                            ? "text-[#C56573]"
                            : "text-[#A8A29E]"
                        }
                      />
                      {role === "vendor" && (
                        <Check size={17} className="text-[#C56573]" />
                      )}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[#44403C]">
                      Vendor
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#78716C]">
                      Grow your wedding business
                    </p>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || isGoogleLoading}
                className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#D97985] px-6 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(217,121,133,0.65)] transition-all hover:-translate-y-0.5 hover:bg-[#C56573] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Creating your account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Trust Note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#A8A29E]">
              <ShieldCheck size={15} className="text-[#A68A58]" />
              Your information is protected and secure.
            </div>

            {/* Sign In */}
            <p className="mt-7 text-center text-sm text-[#78716C]">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-semibold text-[#C56573] transition-colors hover:text-[#A94E5D]"
              >
                Sign In
              </Link>
            </p>

            <p className="mt-6 text-center text-xs leading-5 text-[#A8A29E]">
              By creating an account, you agree to use WedPlan responsibly and
              respectfully.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
