
"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PlusCircle,
  UploadCloud,
  ImageIcon,
  MapPin,
  Wallet,
  Sparkles,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  X,
  LoaderCircle,
  Crown,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface UploadResponse {
  success?: boolean;
  imageUrl?: string;
  message?: string;
}

interface ServiceResponse {
  success?: boolean;
  message?: string;
}

interface VendorStats {
  activeServices?: number;
  pendingServices?: number;
  serviceSlotsUsed?: number;
  subscriptionPlan?: "free" | "premium";
}

interface VendorStatsResponse {
  success?: boolean;
  stats?: VendorStats;
  activeServices?: number;
  pendingServices?: number;
  serviceSlotsUsed?: number;
  subscriptionPlan?: "free" | "premium";
  message?: string;
}

const FREE_PLAN_LIMIT = 3;
const SUBSCRIPTION_URL = "/dashboard/vendor/subscription";

export default function AddServicePage() {
  const router = useRouter();

  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState("");

  const [subscriptionPlan, setSubscriptionPlan] = useState<
    "free" | "premium"
  >("free");

  const [activeServices, setActiveServices] = useState(0);
  const [pendingServices, setPendingServices] = useState(0);
  const [serviceSlotsUsed, setServiceSlotsUsed] = useState(0);

  const [isPlanLoading, setIsPlanLoading] = useState(true);
  const [planError, setPlanError] = useState("");

  const isPremium = subscriptionPlan === "premium";

  const hasReachedFreeLimit =
    !isPremium && serviceSlotsUsed >= FREE_PLAN_LIMIT;

  const progressPercentage = isPremium
    ? 100
    : Math.min((serviceSlotsUsed / FREE_PLAN_LIMIT) * 100, 100);

  // Fetch vendor subscription and service information
  const loadVendorStats = useCallback(async () => {
    const serverUrl = process.env.NEXT_PUBLIC_BASE_SERVER_URL;

    if (!serverUrl) {
      setPlanError("Server configuration is missing.");
      setIsPlanLoading(false);
      return;
    }

    try {
      setPlanError("");

      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        throw new Error("Unable to retrieve authentication token.");
      }

      const tokenData: { token?: string } = await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error("Please sign in again to continue.");
      }

      const response = await fetch(
        `${serverUrl}/vendor/dashboard/stats`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        },
      );

      const result: VendorStatsResponse = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Unable to load subscription information.",
        );
      }

      const stats = result.stats ?? result;

      setSubscriptionPlan(
        stats.subscriptionPlan === "premium" ? "premium" : "free",
      );

      setActiveServices(
        typeof stats.activeServices === "number" &&
          Number.isFinite(stats.activeServices)
          ? Math.max(0, stats.activeServices)
          : 0,
      );

      setPendingServices(
        typeof stats.pendingServices === "number" &&
          Number.isFinite(stats.pendingServices)
          ? Math.max(0, stats.pendingServices)
          : 0,
      );

      setServiceSlotsUsed(
        typeof stats.serviceSlotsUsed === "number" &&
          Number.isFinite(stats.serviceSlotsUsed)
          ? Math.max(0, stats.serviceSlotsUsed)
          : 0,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load subscription information.";

      setPlanError(message);
      toast.error(message);
    } finally {
      setIsPlanLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVendorStats();
  }, [loadVendorStats]);

  // Handle image selection
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setImageError("");

    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setImageError("Only JPG, PNG and WEBP images are allowed.");
      event.target.value = "";
      setImageFile(null);
      setImagePreview("");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size must be less than 5MB.");
      event.target.value = "";
      setImageFile(null);
      setImagePreview("");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageError("");

    const input = document.getElementById(
      "serviceImage",
    ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  };

  // Submit service
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (isPlanLoading) {
      toast.info("Please wait while your subscription is loading.");
      return;
    }

    // Free Plan limit check must happen before form validation or upload
    if (hasReachedFreeLimit) {
      toast.error(
        "You have reached the Free Plan limit. Please upgrade to Premium to add more services.",
      );

      // Keep the form visible briefly so the toast can be seen
      window.setTimeout(() => {
        router.push(SUBSCRIPTION_URL);
      }, 900);

      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const serviceName = formData.get("serviceName");
    const description = formData.get("description");
    const priceValue = formData.get("price");
    const location = formData.get("location");

    const price = Number(priceValue);

    if (
      typeof serviceName !== "string" ||
      !serviceName.trim() ||
      !category ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof location !== "string" ||
      !location.trim() ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !imageFile
    ) {
      toast.error("Please complete all required fields.");
      return;
    }

    const serverUrl = process.env.NEXT_PUBLIC_BASE_SERVER_URL;

    if (!serverUrl) {
      toast.error("Server configuration is missing.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Get authentication token
      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        throw new Error("Unable to retrieve authentication token.");
      }

      const tokenData: { token?: string } = await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error("Please sign in again to continue.");
      }

      // Step 2: Upload image
      const uploadFormData = new FormData();
      uploadFormData.append("image", imageFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const uploadResult: UploadResponse = await uploadResponse.json();

      if (
        !uploadResponse.ok ||
        !uploadResult.success ||
        !uploadResult.imageUrl
      ) {
        throw new Error(uploadResult.message || "Image upload failed.");
      }

      // Step 3: Create service in Express backend
      const serviceResponse = await fetch(`${serverUrl}/vendor/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          serviceName: serviceName.trim(),
          category,
          description: description.trim(),
          price,
          location: location.trim(),
          imageUrl: uploadResult.imageUrl,
        }),
      });

      const serviceResult: ServiceResponse = await serviceResponse.json();

      if (!serviceResponse.ok || !serviceResult.success) {
        throw new Error(
          serviceResult.message || "Failed to create service.",
        );
      }

      // Step 4: Reset form
      form.reset();
      setCategory("");
      removeImage();

      toast.success(
        serviceResult.message || "Service submitted for admin approval!",
      );

      // Step 5: Refresh subscription and service usage
      setIsPlanLoading(true);
      await loadVendorStats();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-[#FAF7F2] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Page Heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#D97985]">
              <PlusCircle size={17} />
              <span>VENDOR DASHBOARD</span>
            </div>

            <h1 className="font-heading text-3xl font-bold text-stone-800 sm:text-4xl">
              Add New Service
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500">
              Showcase your wedding services and connect with couples
              planning their special day.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-[#F0D9DD] bg-white px-4 py-2 text-sm font-medium text-[#B95F6D]">
            <Sparkles size={16} />
            Share your talent
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_290px]">
          {/* Main Form */}
          <div className="overflow-hidden rounded-2xl border border-[#E9DED2] bg-white shadow-sm">
            <div className="border-b border-[#F0E9E1] px-6 py-6 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#FCECEF] text-[#D97985]">
                  <PlusCircle size={21} />
                </div>

                <div>
                  <h2 className="font-heading text-xl font-semibold text-stone-800">
                    Service Information
                  </h2>
                  <p className="mt-1 text-xs text-stone-500">
                    Complete the details below to submit your service.
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-7 p-6 sm:p-8"
            >
              {/* Basic Information */}
              <section className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-stone-800">
                    Basic Information
                  </h3>
                  <p className="mt-1 text-xs text-stone-400">
                    Tell customers about your wedding service.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="serviceName"
                    className="text-sm font-medium text-stone-700"
                  >
                    Service Name <span className="text-[#D97985]">*</span>
                  </label>

                  <Input
                    id="serviceName"
                    name="serviceName"
                    required
                    placeholder="e.g. Premium Wedding Photography"
                    className="h-11 border-[#E9DED2] bg-[#FFFEFC] focus-visible:ring-[#D97985]"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label
                    htmlFor="category"
                    className="text-sm font-medium text-stone-700"
                  >
                    Service Category <span className="text-[#D97985]">*</span>
                  </label>

                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger
                      id="category"
                      className="h-11 w-full border-[#E9DED2] bg-[#FFFEFC] focus:ring-[#D97985]"
                    >
                      <SelectValue placeholder="Choose your service category" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Photography & Videography">
                        Photography & Videography
                      </SelectItem>
                      <SelectItem value="Wedding Venues">
                        Wedding Venues
                      </SelectItem>
                      <SelectItem value="Decoration & Florist">
                        Decoration & Florist
                      </SelectItem>
                      <SelectItem value="Catering Services">
                        Catering Services
                      </SelectItem>
                      <SelectItem value="Makeup & Styling">
                        Makeup & Styling
                      </SelectItem>
                      <SelectItem value="Wedding Fashion">
                        Wedding Fashion
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-stone-700"
                  >
                    Description <span className="text-[#D97985]">*</span>
                  </label>

                  <Textarea
                    id="description"
                    name="description"
                    required
                    placeholder="Describe your service, experience, and what makes it special..."
                    rows={5}
                    className="resize-none border-[#E9DED2] bg-[#FFFEFC] focus-visible:ring-[#D97985]"
                  />

                  <p className="text-right text-xs text-stone-400">
                    Write a clear and attractive description.
                  </p>
                </div>
              </section>

              <div className="border-t border-dashed border-[#E9DED2]" />

              {/* Pricing & Location */}
              <section className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-stone-800">
                    Pricing & Location
                  </h3>
                  <p className="mt-1 text-xs text-stone-400">
                    Let customers know your price and service area.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="price"
                      className="flex items-center gap-2 text-sm font-medium text-stone-700"
                    >
                      <Wallet size={15} className="text-[#D97985]" />
                      Starting Price (BDT){" "}
                      <span className="text-[#D97985]">*</span>
                    </label>

                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="1"
                      step="1"
                      required
                      placeholder="e.g. 25000"
                      className="h-11 border-[#E9DED2] bg-[#FFFEFC] focus-visible:ring-[#D97985]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="location"
                      className="flex items-center gap-2 text-sm font-medium text-stone-700"
                    >
                      <MapPin size={15} className="text-[#D97985]" />
                      Service Location{" "}
                      <span className="text-[#D97985]">*</span>
                    </label>

                    <Input
                      id="location"
                      name="location"
                      required
                      placeholder="e.g. Dhaka, Bangladesh"
                      className="h-11 border-[#E9DED2] bg-[#FFFEFC] focus-visible:ring-[#D97985]"
                    />
                  </div>
                </div>
              </section>

              <div className="border-t border-dashed border-[#E9DED2]" />

              {/* Image Upload */}
              <section className="space-y-5">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-800">
                    <ImageIcon size={17} className="text-[#D97985]" />
                    Service Image
                    <span className="text-[#D97985]">*</span>
                  </h3>

                  <p className="mt-1 text-xs text-stone-400">
                    Upload a beautiful image that represents your service.
                  </p>
                </div>

                {!imagePreview ? (
                  <label
                    htmlFor="serviceImage"
                    className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E9C8CE] bg-[#FFFAFA] px-5 py-8 text-center transition hover:border-[#D97985] hover:bg-[#FFF4F5]"
                  >
                    <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#FCECEF] text-[#D97985]">
                      <UploadCloud size={27} />
                    </div>

                    <p className="text-sm font-semibold text-stone-700">
                      Click to upload your service image
                    </p>

                    <p className="mt-2 text-xs text-stone-400">
                      JPG, PNG or WEBP · Maximum 5MB
                    </p>

                    <span className="mt-4 rounded-lg bg-[#D97985] px-5 py-2.5 text-xs font-semibold text-white">
                      Choose Image
                    </span>
                  </label>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-[#E9DED2] bg-[#FFFAFA] p-3">
                    <div className="relative h-64 w-full overflow-hidden rounded-xl sm:h-80">
                      <Image
                        src={imagePreview}
                        alt="Selected service image preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 px-2 pt-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-stone-700">
                          {imageFile?.name}
                        </p>
                        <p className="text-xs text-stone-400">
                          {imageFile
                            ? `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`
                            : ""}
                        </p>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeImage}
                        className="shrink-0 border-[#E9DED2] text-stone-600 hover:bg-[#FCECEF] hover:text-[#B95F6D]"
                      >
                        <X size={15} />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}

                <Input
                  id="serviceImage"
                  name="serviceImage"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {imageError && (
                  <p className="text-sm text-red-600">{imageError}</p>
                )}
              </section>

              {/* Approval Notice */}
              <div className="flex gap-3 rounded-xl border border-[#F0D9DD] bg-[#FFFAFA] p-4">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-[#D97985]"
                />

                <div>
                  <p className="text-sm font-semibold text-stone-700">
                    Admin Approval Required
                  </p>
                  <p className="mt-1 text-xs leading-5 text-stone-500">
                    Your service will be submitted with Pending status.
                    It will become visible to customers only after admin
                    approval.
                  </p>
                </div>
              </div>

              {/* Submit Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#F0E9E1] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-stone-400">
                  <span className="text-[#D97985]">*</span> Required fields
                </p>

                <Button
                  type="submit"
                  disabled={isSubmitting || isPlanLoading}
                  className="h-12 w-full rounded-xl bg-[#D97985] px-7 text-sm font-semibold text-white shadow-md shadow-[#D97985]/20 hover:bg-[#C76B77] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="mr-2 animate-spin"
                      />
                      Submitting...
                    </>
                  ) : isPlanLoading ? (
                    <>
                      <LoaderCircle
                        size={17}
                        className="mr-2 animate-spin"
                      />
                      Loading Plan...
                    </>
                  ) : (
                    <>
                      Submit for Approval
                      <PlusCircle size={17} className="ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Side Information */}
          <aside className="space-y-5">
            {/* Submission Guide */}
            <div className="rounded-2xl border border-[#E9DED2] bg-white p-5 shadow-sm">
              <h3 className="font-heading text-lg font-semibold text-stone-800">
                Before You Submit
              </h3>

              <div className="mt-5 space-y-4">
                {[
                  "Provide accurate service information and pricing.",
                  "Choose the correct wedding service category.",
                  "Upload a clear and relevant service image.",
                  "Wait for admin approval before your service goes live.",
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-[#D97985]"
                    />
                    <p className="text-xs leading-5 text-stone-500">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Subscription Plan Card */}
            <div className="overflow-hidden rounded-2xl border border-[#E9DED2] bg-white shadow-sm">
              <div
                className={`p-5 ${
                  isPremium
                    ? "bg-gradient-to-br from-[#F1E3C8] to-[#FFF8E9]"
                    : "bg-[#FCECEF]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#B95F6D]">
                    CURRENT PLAN
                  </span>

                  {isPremium ? (
                    <Crown size={20} className="text-[#A17B3D]" />
                  ) : (
                    <Sparkles size={19} className="text-[#B95F6D]" />
                  )}
                </div>

                <h3 className="mt-4 font-heading text-2xl font-bold text-stone-800">
                  {isPlanLoading
                    ? "Loading..."
                    : isPremium
                      ? "Premium Plan"
                      : "Free Plan"}
                </h3>

                <p className="mt-1 text-xs text-stone-500">
                  {isPremium
                    ? "Enjoy unlimited service publishing."
                    : "Get started with your wedding business."}
                </p>
              </div>

              <div className="p-5">
                <p className="text-sm font-medium text-stone-700">
                  Your publishing usage
                </p>

                {isPlanLoading ? (
                  <div className="mt-4 flex items-center gap-2 text-sm text-stone-400">
                    <LoaderCircle size={16} className="animate-spin" />
                    Loading your plan details...
                  </div>
                ) : (
                  <>
                    <p className="mt-2 font-heading text-3xl font-bold text-[#D97985]">
                      {isPremium ? "Unlimited" : serviceSlotsUsed}
                      {!isPremium && (
                        <span className="text-sm font-medium text-stone-500">
                          {" "}
                          / {FREE_PLAN_LIMIT}
                        </span>
                      )}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      {isPremium
                        ? "Service Slots"
                        : "Service Slots Used"}
                    </p>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F5E9E7]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isPremium ? "bg-[#A17B3D]" : "bg-[#D97985]"
                        }`}
                        style={{
                          width: `${progressPercentage}%`,
                        }}
                      />
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-500">
                          Active Services
                        </span>
                        <span className="font-semibold text-stone-700">
                          {activeServices}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-500">
                          Pending Approval
                        </span>
                        <span className="font-semibold text-stone-700">
                          {pendingServices}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-stone-500">
                      {isPremium
                        ? "Your Premium Plan allows unlimited services."
                        : `${serviceSlotsUsed} of ${FREE_PLAN_LIMIT} service slots used. Pending and approved available services count toward your limit.`}
                    </p>

                    {planError && (
                      <div className="mt-3 rounded-lg bg-red-50 p-3">
                        <p className="text-xs leading-5 text-red-600">
                          {planError}
                        </p>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsPlanLoading(true);
                            void loadVendorStats();
                          }}
                          className="mt-2 h-8 border-red-200 text-red-600 hover:bg-red-100"
                        >
                          <RefreshCw size={13} className="mr-2" />
                          Retry
                        </Button>
                      </div>
                    )}

                    {!isPremium && (
                      <Button
                        asChild
                        className="mt-5 w-full rounded-xl bg-[#D97985] text-white hover:bg-[#C76B77]"
                      >
                        <Link href={SUBSCRIPTION_URL}>
                          <Crown size={16} className="mr-2" />
                          Upgrade to Premium
                          <ArrowUpRight size={16} className="ml-2" />
                        </Link>
                      </Button>
                    )}

                    {isPremium && (
                      <div className="mt-5 flex items-center gap-2 rounded-lg bg-[#F8F2E6] p-3 text-xs font-medium text-[#8B6B36]">
                        <CheckCircle2 size={16} />
                        Premium benefits are active
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Review Time */}
            <div className="flex gap-3 rounded-2xl border border-[#E9DED2] bg-white p-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F1E3C8] text-[#A17B3D]">
                <Clock3 size={19} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-stone-700">
                  Review Process
                </h3>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Our admin team will review your submitted service.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
