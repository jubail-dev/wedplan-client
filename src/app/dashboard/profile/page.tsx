
"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import {
  Camera,
  Loader2,
  Save,
  UserRound,
  Mail,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_SERVER_URL;

interface Profile {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "customer" | "vendor" | "admin";
  businessName?: string;
  subscriptionPlan?: "free" | "premium";
}

export default function ProfilePage() {
  const session = authClient.useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const tokenResponse = await fetch("/api/auth/token");

        if (!tokenResponse.ok) {
          throw new Error("Authentication token পাওয়া যায়নি।");
        }

        const tokenData = await tokenResponse.json();
        const token = tokenData.token;

        if (!token) {
          throw new Error("Authentication token পাওয়া যায়নি।");
        }

        const response = await fetch(`${BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Profile load করা যায়নি।");
        }

        setProfile(result.user);
        setName(result.user.name || "");
        setImage(result.user.image || "");
        setBusinessName(result.user.businessName || "");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Image upload failed.");
      }

      setImage(result.imageUrl);
      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed.",
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setSaving(true);

    try {
      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        throw new Error("Authentication token পাওয়া যায়নি।");
      }

      const tokenData = await tokenResponse.json();
      const token = tokenData.token;

      if (!token) {
        throw new Error("Authentication token পাওয়া যায়নি।");
      }

      const payload: {
        name: string;
        image?: string;
        businessName?: string;
      } = {
        name: name.trim(),
        image,
      };

      if (profile?.role === "vendor") {
        payload.businessName = businessName.trim();
      }

      const response = await fetch(`${BASE_URL}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Profile update failed.");
      }

      setProfile(result.user);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Profile update failed.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading || session.isPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#B98B5F]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-[#E9DFD2] bg-white p-8 text-center">
        <p className="text-sm text-gray-600">
          Profile information could not be loaded.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 bg-[#B98B5F] text-white hover:bg-[#A4774F]"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 sm:px-6">
      <div>
        <p className="text-sm font-medium text-[#B98B5F]">
          ACCOUNT SETTINGS
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[#3D3029] sm:text-3xl">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage your personal information and profile details.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E9DFD2] bg-white shadow-sm">
        <div className="border-b border-[#F0E8DE] bg-[#FBF8F4] px-6 py-5">
          <h2 className="font-semibold text-[#3D3029]">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Keep your profile information up to date.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7 p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#F3E8DC] bg-[#FBF4EC]">
              {image ? (
                <Image
                  src={image}
                  alt="Profile picture"
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <UserRound className="h-10 w-10 text-[#B98B5F]" />
              )}

              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>

            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-[#3D3029]">
                Profile Picture
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                JPG, PNG or other image formats. Maximum 5MB.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 border-[#DCC9B5] text-[#8D6948] hover:bg-[#FBF4EC]"
              >
                <Camera className="mr-2 h-4 w-4" />
                {uploading ? "Uploading..." : "Change Photo"}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  maxLength={80}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  value={profile.email}
                  readOnly
                  className="bg-gray-50 pl-10 text-gray-500"
                />
              </div>
              <p className="text-xs text-gray-400">
                Email address cannot be changed here.
              </p>
            </div>

            {profile.role === "vendor" && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="businessName">Business Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    placeholder="Enter your business name"
                    maxLength={100}
                    className="pl-10"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-[#F0E8DE] bg-[#FBF8F4] p-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-[#B98B5F]" />
              <div>
                <p className="text-sm font-medium text-[#3D3029]">
                  Account Information
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Your account role and subscription plan are protected.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-3">
                <p className="text-xs text-gray-500">Account Role</p>
                <p className="mt-1 text-sm font-semibold capitalize text-[#3D3029]">
                  {profile.role}
                </p>
              </div>

              {profile.role === "vendor" && (
                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs text-gray-500">Subscription Plan</p>
                  <p className="mt-1 text-sm font-semibold capitalize text-[#3D3029]">
                    {profile.subscriptionPlan || "free"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end border-t border-[#F0E8DE] pt-5">
            <Button
              type="submit"
              disabled={saving || uploading}
              className="min-w-36 bg-[#B98B5F] text-white hover:bg-[#A4774F]"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
