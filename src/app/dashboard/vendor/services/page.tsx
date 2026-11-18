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
import {
  Plus,
  MapPin,
  Tag,
  Loader2,
  AlertCircle,
  RefreshCw,
  Package,
  CalendarDays,
  Pencil,
  Trash2,
  Eye,
  X,
  Upload,
  Save,
} from "lucide-react";
import { toast } from "sonner";

interface VendorService {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  image: string;
  images?: string[];
  status: "Pending" | "Approved" | "Rejected";
  isAvailable: boolean;
  createdAt: string;
}

interface ServicesApiResponse {
  success: boolean;
  services: VendorService[];
  message?: string;
}

interface ServiceFormData {
  serviceName: string;
  category: string;
  description: string;
  price: string;
  location: string;
}

const initialFormData: ServiceFormData = {
  serviceName: "",
  category: "",
  description: "",
  price: "",
  location: "",
};

export default function VendorServicesPage() {
  const [services, setServices] = useState<VendorService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedService, setSelectedService] = useState<VendorService | null>(
    null,
  );

  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  const [viewService, setViewService] = useState<VendorService | null>(null);

  const [deleteService, setDeleteService] = useState<VendorService | null>(
    null,
  );

  const [deleting, setDeleting] = useState(false);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const tokenResponse = await fetch("/api/auth/token", {
        cache: "no-store",
      });

      const tokenData: { token?: string } = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Authentication token not found!");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/vendor/services`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        },
      );

      const data: ServicesApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch services!");
      }

      setServices(data.services);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong!";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchServices();
  }, [fetchServices]);

  // Open Edit Modal
  const handleEdit = (service: VendorService) => {
    setSelectedService(service);

    setFormData({
      serviceName: service.serviceName,
      category: service.category,
      description: service.description,
      price: String(service.price),
      location: service.location,
    });

    setImageFile(null);
    setImagePreview(service.image || "");
  };

  // Handle Form Input
  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handle New Image
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please Select a Valid Image!");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image Size Must Be Less Than 5MB!");
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setSelectedService(null);
    setFormData(initialFormData);
    setImageFile(null);
    setImagePreview("");
  };

  // Update Service
  const handleUpdateService = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedService) return;

    const price = Number(formData.price);

    if (
      !formData.serviceName.trim() ||
      !formData.category.trim() ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      toast.error("Please Provide Valid Service Information!");
      return;
    }

    try {
      setSaving(true);

      // Step 1: Get Authentication Token
      const tokenResponse = await fetch("/api/auth/token", {
        cache: "no-store",
      });

      const tokenData: { token?: string } = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Authentication token not found!");
      }

      // Step 2: Upload New Image If Selected
      let imageUrl: string | undefined;

      if (imageFile) {
        const formDataToUpload = new FormData();
        formDataToUpload.append("image", imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataToUpload,
        });

        const uploadData: {
          success: boolean;
          imageUrl?: string;
          message?: string;
        } = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadData.success || !uploadData.imageUrl) {
          throw new Error(uploadData.message || "Failed to Upload New Image!");
        }

        imageUrl = uploadData.imageUrl;
      }

      // Step 3: Prepare Update Data
      const updateData = {
        serviceName: formData.serviceName.trim(),
        category: formData.category.trim(),
        description: formData.description.trim(),
        price,
        location: formData.location.trim(),
        ...(imageUrl ? { imageUrl } : {}),
      };

      // Step 4: Send Update Request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/vendor/services/${selectedService._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify(updateData),
        },
      );

      const data: {
        success: boolean;
        message?: string;
      } = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to Update Service!");
      }

      toast.success(data.message || "Service Updated Successfully!");

      closeEditModal();
      await fetchServices();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something Went Wrong!";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // Delete Service
  const handleDeleteService = async () => {
    if (!deleteService) return;

    try {
      setDeleting(true);

      // Step 1: Get Authentication Token
      const tokenResponse = await fetch("/api/auth/token", {
        cache: "no-store",
      });

      const tokenData: { token?: string } = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Authentication token not found!");
      }

      // Step 2: Send Delete Request
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/vendor/services/${deleteService._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        },
      );

      const data: {
        success: boolean;
        message?: string;
      } = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to Delete Service!");
      }

      toast.success(data.message || "Service Deleted Successfully!");

      setDeleteService(null);

      await fetchServices();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something Went Wrong!";

      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusStyle = (status: VendorService["status"]) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-3xl font-bold text-stone-800">
              My Services
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Manage your wedding services and track their approval status.
            </p>
          </div>

          <Link
            href="/dashboard/vendor/add-service"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D97985] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c56874]"
          >
            <Plus size={18} />
            Add New Service
          </Link>
        </div>

        {/* Service Summary */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total Services",
              value: services.length,
              color: "text-stone-800",
            },
            {
              label: "Approved",
              value: services.filter((service) => service.status === "Approved")
                .length,
              color: "text-green-600",
            },
            {
              label: "Pending",
              value: services.filter((service) => service.status === "Pending")
                .length,
              color: "text-amber-600",
            },
            {
              label: "Rejected",
              value: services.filter((service) => service.status === "Rejected")
                .length,
              color: "text-red-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#E9DED2] bg-white p-4 shadow-sm"
            >
              <p className="text-sm text-stone-500">{item.label}</p>

              <p className={`mt-2 text-2xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[#E9DED2] bg-white">
            <div className="text-center">
              <Loader2
                className="mx-auto animate-spin text-[#D97985]"
                size={36}
              />

              <p className="mt-3 text-sm text-stone-500">
                Loading your services...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <AlertCircle className="mx-auto text-red-500" size={40} />

            <h2 className="mt-3 text-lg font-semibold text-stone-800">
              Unable to Load Services
            </h2>

            <p className="mt-2 text-sm text-stone-500">{error}</p>

            <button
              onClick={() => void fetchServices()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#D97985] px-5 py-2.5 text-sm font-semibold text-white"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#DCCBC0] bg-white px-6 py-16 text-center">
            <Package className="mx-auto text-[#D97985]" size={48} />

            <h2 className="mt-4 font-heading text-2xl font-bold text-stone-800">
              No Services Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
              You haven't added any wedding services yet. Start by creating your
              first service.
            </p>

            <Link
              href="/dashboard/vendor/add-service"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D97985] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c56874]"
            >
              <Plus size={18} />
              Add Your First Service
            </Link>
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article
                key={service._id}
                className="overflow-hidden rounded-2xl border border-[#E9DED2] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Service Image */}
                <div className="relative h-52 w-full bg-[#F1E3C8]">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.serviceName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package size={48} className="text-stone-400" />
                    </div>
                  )}

                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(service.status)}`}
                  >
                    {service.status}
                  </span>
                </div>

                {/* Service Information */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-stone-800">
                        {service.serviceName}
                      </h2>

                      <p className="mt-1 flex items-center gap-1 text-sm text-stone-500">
                        <Tag size={14} />
                        {service.category}
                      </p>
                    </div>

                    <p className="shrink-0 font-bold text-[#D97985]">
                      ৳{service.price.toLocaleString("en-BD")}
                    </p>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-stone-500">
                    {service.description}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-[#F0E8E0] pt-4">
                    <p className="flex items-center gap-2 text-sm text-stone-600">
                      <MapPin size={16} className="text-[#D97985]" />
                      {service.location}
                    </p>

                    <p className="flex items-center gap-2 text-sm text-stone-600">
                      <CalendarDays size={16} className="text-[#D97985]" />
                      Added:{" "}
                      {new Date(service.createdAt).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Availability */}
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-[#FAF7F2] px-3 py-3">
                    <span className="text-sm font-medium text-stone-600">
                      Availability
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        service.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {service.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  {/* Service Actions */}
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setViewService(service)}
                      className="flex items-center justify-center gap-1 rounded-lg border border-[#E9DED2] py-2 text-xs font-semibold text-stone-600 transition hover:bg-[#FAF7F2]"
                    >
                      <Eye size={15} />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEdit(service)}
                      className="flex items-center justify-center gap-1 rounded-lg border border-[#E9DED2] py-2 text-xs font-semibold text-[#D97985] transition hover:bg-[#FCECEF]"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteService(service)}
                      className="flex items-center justify-center gap-1 rounded-lg border border-red-200 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Edit Service Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E9DED2] p-5 sm:p-6">
              <div>
                <h2 className="font-heading text-2xl font-bold text-stone-800">
                  Edit Service
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  Update your service information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                className="rounded-full p-2 text-stone-500 transition hover:bg-[#FAF7F2]"
                aria-label="Close edit modal"
              >
                <X size={22} />
              </button>
            </div>

            {/* Edit Form */}
            <form
              onSubmit={handleUpdateService}
              className="max-h-[75vh] space-y-5 overflow-y-auto p-5 sm:p-6"
            >
              {/* Service Name */}
              <div>
                <label
                  htmlFor="serviceName"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Service Name
                </label>

                <input
                  id="serviceName"
                  name="serviceName"
                  type="text"
                  value={formData.serviceName}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-[#E9DED2] px-4 py-3 text-sm outline-none transition focus:border-[#D97985] focus:ring-2 focus:ring-[#D97985]/20"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-[#E9DED2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D97985] focus:ring-2 focus:ring-[#D97985]/20"
                >
                  <option value="">Select a Category</option>
                  <option value="Photography & Videography">
                    Photography & Videography
                  </option>
                  <option value="Wedding Venues">Wedding Venues</option>
                  <option value="Decoration & Florist">
                    Decoration & Florist
                  </option>
                  <option value="Catering Services">Catering Services</option>
                  <option value="Makeup & Styling">Makeup & Styling</option>
                  <option value="Wedding Fashion">Wedding Fashion</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-stone-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full resize-y rounded-xl border border-[#E9DED2] px-4 py-3 text-sm outline-none transition focus:border-[#D97985] focus:ring-2 focus:ring-[#D97985]/20"
                />
              </div>

              {/* Price and Location */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="price"
                    className="mb-2 block text-sm font-semibold text-stone-700"
                  >
                    Price (৳)
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    step="any"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-[#E9DED2] px-4 py-3 text-sm outline-none transition focus:border-[#D97985] focus:ring-2 focus:ring-[#D97985]/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-semibold text-stone-700"
                  >
                    Location
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-[#E9DED2] px-4 py-3 text-sm outline-none transition focus:border-[#D97985] focus:ring-2 focus:ring-[#D97985]/20"
                  />
                </div>
              </div>

              {/* Service Image */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-stone-700">
                  Service Image
                </label>

                {imagePreview && (
                  <div className="relative mb-3 h-48 w-full overflow-hidden rounded-xl bg-[#FAF7F2]">
                    <Image
                      src={imagePreview}
                      alt="Service preview"
                      fill
                      unoptimized={imagePreview.startsWith("blob:")}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </div>
                )}

                <label
                  htmlFor="serviceImage"
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#DCCBC0] bg-[#FAF7F2] px-4 py-4 text-sm font-medium text-stone-600 transition hover:border-[#D97985] hover:text-[#D97985]"
                >
                  <Upload size={18} />
                  {imageFile ? imageFile.name : "Choose a New Image"}
                </label>

                <input
                  id="serviceImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <p className="mt-2 text-xs text-stone-400">
                  Optional. Leave unchanged to keep the current image. Maximum
                  5MB.
                </p>
              </div>

              {/* Approval Status Information */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-800">
                  Approval Status: {selectedService.status}
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700">
                  Only an Admin can change the approval status of a service.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#E9DED2] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="rounded-xl border border-[#E9DED2] px-5 py-3 text-sm font-semibold text-stone-600 transition hover:bg-[#FAF7F2] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D97985] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c56874] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteService && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <Trash2 size={26} className="text-red-600" />
            </div>

            <h2 className="mt-5 text-center font-heading text-2xl font-bold text-stone-800">
              Delete Service?
            </h2>

            <p className="mt-3 text-center text-sm leading-6 text-stone-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-stone-800">
                {deleteService.serviceName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setDeleteService(null)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-[#E9DED2] px-4 py-3 text-sm font-semibold text-stone-600 transition hover:bg-[#FAF7F2] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleDeleteService()}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Service Modal */}
      {viewService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E9DED2] p-5">
              <h2 className="font-heading text-xl font-bold text-stone-800">
                Service Details
              </h2>

              <button
                type="button"
                onClick={() => setViewService(null)}
                className="rounded-full p-2 text-stone-500 hover:bg-[#FAF7F2]"
                aria-label="Close details"
              >
                <X size={21} />
              </button>
            </div>

            {viewService.image && (
              <div className="relative h-52 w-full">
                <Image
                  src={viewService.image}
                  alt={viewService.serviceName}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="space-y-4 p-5">
              <div>
                <h3 className="text-xl font-bold text-stone-800">
                  {viewService.serviceName}
                </h3>

                <p className="mt-1 text-sm text-stone-500">
                  {viewService.category}
                </p>
              </div>

              <p className="text-sm leading-7 text-stone-600">
                {viewService.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-[#FAF7F2] p-3">
                  <p className="text-stone-500">Price</p>
                  <p className="mt-1 font-bold text-[#D97985]">
                    ৳{viewService.price.toLocaleString("en-BD")}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FAF7F2] p-3">
                  <p className="text-stone-500">Location</p>
                  <p className="mt-1 font-semibold text-stone-800">
                    {viewService.location}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FAF7F2] p-3">
                  <p className="text-stone-500">Approval Status</p>
                  <p className="mt-1 font-semibold text-stone-800">
                    {viewService.status}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FAF7F2] p-3">
                  <p className="text-stone-500">Availability</p>
                  <p className="mt-1 font-semibold text-stone-800">
                    {viewService.isAvailable ? "Available" : "Unavailable"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
