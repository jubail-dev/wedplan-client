
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Search,
  RefreshCw,
  Eye,
  Check,
  X,
  Trash2,
  Power,
  MapPin,
  CalendarDays,
  User,
  BriefcaseBusiness,
  Loader2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface VendorInfo {
  name?: string;
  email?: string;
  image?: string;
  businessName?: string;
  subscriptionPlan?: string;
}

interface AdminService {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  image?: string;
  images?: string[];
  status: "Pending" | "Approved" | "Rejected";
  isAvailable: boolean;
  createdAt: string;
  updatedAt?: string;
  vendorId: string;
  vendor?: VendorInfo;
}

type ServiceStatus = "All" | "Pending" | "Approved" | "Rejected";
type AvailabilityFilter = "All" | "true" | "false";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_SERVER_URL;

export default function AdminServices() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<ServiceStatus>("All");
  const [availability, setAvailability] =
    useState<AvailabilityFilter>("All");

  const [selectedService, setSelectedService] =
    useState<AdminService | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<AdminService | null>(null);

  const getToken = async (): Promise<string> => {
    const response = await fetch("/api/auth/token");

    if (!response.ok) {
      throw new Error("Authentication token পাওয়া যায়নি!");
    }

    const data: { token?: string } = await response.json();

    if (!data.token) {
      throw new Error("Authentication token পাওয়া যায়নি!");
    }

    return data.token;
  };

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);

      const token = await getToken();
      const params = new URLSearchParams();

      if (search.trim()) params.set("search", search.trim());
      if (category !== "All") params.set("category", category);
      if (location.trim()) params.set("location", location.trim());
      if (status !== "All") params.set("status", status);

      if (availability !== "All") {
        params.set("isAvailable", availability);
      }

      const response = await fetch(
        `${BASE_URL}/admin/services?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );

      const data: {
        success: boolean;
        services?: AdminService[];
        message?: string;
      } = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Services load করা যায়নি!");
      }

      setServices(data.services || []);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong!";

      toast.error(message);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, location, status, availability]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchServices();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchServices]);

  const updateServiceStatus = async (
    service: AdminService,
    newStatus: "Approved" | "Rejected",
  ) => {
    try {
      setActionLoading(service._id);

      const token = await getToken();

      const response = await fetch(
        `${BASE_URL}/admin/services/${service._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      const data: { success: boolean; message?: string } =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Status update করা যায়নি!");
      }

      toast.success(data.message || `Service ${newStatus}!`);
      await fetchServices();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Status update failed!",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const toggleAvailability = async (service: AdminService) => {
    try {
      setActionLoading(service._id);

      const token = await getToken();
      const isAvailable = !service.isAvailable;

      const response = await fetch(
        `${BASE_URL}/admin/services/${service._id}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isAvailable }),
        },
      );

      const data: { success: boolean; message?: string } =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Availability update failed!");
      }

      toast.success(data.message || "Availability updated!");
      await fetchServices();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Availability update failed!",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const deleteService = async () => {
    if (!deleteTarget) return;

    try {
      setActionLoading(deleteTarget._id);

      const token = await getToken();

      const response = await fetch(
        `${BASE_URL}/admin/services/${deleteTarget._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data: { success: boolean; message?: string } =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Service delete করা যায়নি!");
      }

      toast.success(data.message || "Service deleted successfully!");

      if (selectedService?._id === deleteTarget._id) {
        setSelectedService(null);
      }

      setDeleteTarget(null);
      await fetchServices();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Service delete failed!",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statusStyle = (value: string) => {
    switch (value) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const categories = Array.from(
    new Set(services.map((service) => service.category).filter(Boolean)),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#3D302E] sm:text-3xl">
            Manage Services
          </h1>
          <p className="mt-1 text-sm text-[#8A7772]">
            Review, manage and monitor all submitted services.
          </p>
        </div>

        <button
          onClick={() => void fetchServices()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E9DED2] bg-white px-4 py-2.5 text-sm font-semibold text-[#6B514B] transition hover:bg-[#FAF7F2] disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Total Services",
            value: services.length,
            color: "text-[#D97985]",
          },
          {
            label: "Pending",
            value: services.filter((item) => item.status === "Pending").length,
            color: "text-amber-600",
          },
          {
            label: "Approved",
            value: services.filter((item) => item.status === "Approved").length,
            color: "text-green-600",
          },
          {
            label: "Rejected",
            value: services.filter((item) => item.status === "Rejected").length,
            color: "text-red-600",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[#E9DED2] bg-white p-4"
          >
            <p className="text-sm text-[#8A7772]">{item.label}</p>
            <p className={`mt-2 text-2xl font-bold ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-[#E9DED2] bg-white p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A18D87]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search services..."
              className="w-full rounded-xl border border-[#E9DED2] py-2.5 pl-10 pr-3 text-sm text-[#3D302E] outline-none transition focus:border-[#D97985]"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-[#E9DED2] bg-white px-3 py-2.5 text-sm text-[#6B514B] outline-none focus:border-[#D97985]"
          >
            <option value="All">All Categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Filter by location..."
            className="rounded-xl border border-[#E9DED2] px-3 py-2.5 text-sm text-[#3D302E] outline-none focus:border-[#D97985]"
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ServiceStatus)
            }
            className="rounded-xl border border-[#E9DED2] bg-white px-3 py-2.5 text-sm text-[#6B514B] outline-none focus:border-[#D97985]"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-[#8A7772]">
            <Power size={15} />
            Availability:
            <select
              value={availability}
              onChange={(event) =>
                setAvailability(event.target.value as AvailabilityFilter)
              }
              className="rounded-lg border border-[#E9DED2] bg-white px-2 py-1.5 text-sm text-[#6B514B] outline-none"
            >
              <option value="All">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
              setLocation("");
              setStatus("All");
              setAvailability("All");
            }}
            className="text-sm font-semibold text-[#D97985] transition hover:text-[#BD6571]"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Services Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E9DED2] bg-white">
        <div className="flex items-center justify-between border-b border-[#F0E8E1] px-4 py-4 sm:px-5">
          <h2 className="font-semibold text-[#3D302E]">
            All Services
          </h2>
          <span className="text-sm text-[#8A7772]">
            {services.length} services
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-[#8A7772]">
            <Loader2 size={22} className="animate-spin text-[#D97985]" />
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
            <BriefcaseBusiness size={38} className="text-[#D8C8BE]" />
            <h3 className="mt-3 font-semibold text-[#3D302E]">
              No services found
            </h3>
            <p className="mt-1 text-sm text-[#8A7772]">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-[#FAF7F2] text-xs uppercase tracking-wide text-[#8A7772]">
                <tr>
                  <th className="px-5 py-4 font-semibold">Service</th>
                  <th className="px-5 py-4 font-semibold">Vendor</th>
                  <th className="px-5 py-4 font-semibold">Price</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Availability</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0E8E1]">
                {services.map((service) => (
                  <tr key={service._id} className="transition hover:bg-[#FFFCF9]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#FAF7F2]">
                          {service.image ? (
                            <Image
                              src={service.image}
                              alt={service.serviceName}
                              fill
                              sizes="48px"
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[#B9A49A]">
                              <BriefcaseBusiness size={20} />
                            </div>
                          )}
                        </div>
                        <div className="max-w-[220px]">
                          <p className="truncate font-semibold text-[#3D302E]">
                            {service.serviceName}
                          </p>
                          <p className="mt-1 text-xs text-[#9A8580]">
                            {service.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-[#51413D]">
                        {service.vendor?.businessName ||
                          service.vendor?.name ||
                          "Unknown Vendor"}
                      </p>
                      <p className="mt-1 text-xs text-[#9A8580]">
                        {service.vendor?.email || "No email"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[#51413D]">
                      ৳{Number(service.price || 0).toLocaleString("en-BD")}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle(service.status)}`}
                      >
                        {service.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {service.status === "Approved" ? (
                        <span
                          className={`text-xs font-semibold ${
                            service.isAvailable
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {service.isAvailable ? "Active" : "Inactive"}
                        </span>
                      ) : (
                        <span className="text-xs text-[#A18D87]">—</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          title="View details"
                          onClick={() => setSelectedService(service)}
                          className="rounded-lg p-2 text-[#8A7772] transition hover:bg-[#FAF0F0] hover:text-[#D97985]"
                        >
                          <Eye size={17} />
                        </button>

                        {service.status === "Pending" && (
                          <>
                            <button
                              title="Approve service"
                              disabled={actionLoading === service._id}
                              onClick={() =>
                                void updateServiceStatus(service, "Approved")
                              }
                              className="rounded-lg p-2 text-green-600 transition hover:bg-green-50 disabled:opacity-50"
                            >
                              <Check size={17} />
                            </button>

                            <button
                              title="Reject service"
                              disabled={actionLoading === service._id}
                              onClick={() =>
                                void updateServiceStatus(service, "Rejected")
                              }
                              className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              <X size={17} />
                            </button>
                          </>
                        )}

                        {service.status === "Approved" && (
                          <button
                            title={
                              service.isAvailable
                                ? "Deactivate service"
                                : "Activate service"
                            }
                            disabled={actionLoading === service._id}
                            onClick={() => void toggleAvailability(service)}
                            className={`rounded-lg p-2 transition disabled:opacity-50 ${
                              service.isAvailable
                                ? "text-amber-600 hover:bg-amber-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                          >
                            <Power size={17} />
                          </button>
                        )}

                        <button
                          title="Delete service"
                          disabled={actionLoading === service._id}
                          onClick={() => setDeleteTarget(service)}
                          className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#3D302E]">
                Service Details
              </h2>
              <button
                onClick={() => setSelectedService(null)}
                className="rounded-full p-2 text-[#8A7772] hover:bg-[#FAF7F2]"
              >
                <X size={20} />
              </button>
            </div>

            {selectedService.image && (
              <div className="relative mb-5 h-52 w-full overflow-hidden rounded-xl bg-[#FAF7F2]">
                <Image
                  src={selectedService.image}
                  alt={selectedService.serviceName}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            <h3 className="text-xl font-bold text-[#3D302E]">
              {selectedService.serviceName}
            </h3>

            <p className="mt-1 text-sm text-[#D97985]">
              {selectedService.category}
            </p>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#74635E]">
              {selectedService.description || "No description provided."}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 rounded-xl bg-[#FAF7F2] p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-[#9A8580]">Price</p>
                <p className="mt-1 font-semibold text-[#3D302E]">
                  ৳{Number(selectedService.price || 0).toLocaleString("en-BD")}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#9A8580]">Location</p>
                <p className="mt-1 flex items-center gap-1 font-semibold text-[#3D302E]">
                  <MapPin size={15} />
                  {selectedService.location || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#9A8580]">Vendor</p>
                <p className="mt-1 flex items-center gap-1 font-semibold text-[#3D302E]">
                  <User size={15} />
                  {selectedService.vendor?.businessName ||
                    selectedService.vendor?.name ||
                    "Unknown Vendor"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#9A8580]">Vendor Email</p>
                <p className="mt-1 break-all font-semibold text-[#3D302E]">
                  {selectedService.vendor?.email || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#9A8580]">Submitted</p>
                <p className="mt-1 flex items-center gap-1 font-semibold text-[#3D302E]">
                  <CalendarDays size={15} />
                  {formatDate(selectedService.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#9A8580]">Status</p>
                <span
                  className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(selectedService.status)}`}
                >
                  {selectedService.status}
                </span>
              </div>
            </div>

            {selectedService.status === "Pending" && (
              <div className="mt-5 flex flex-wrap justify-end gap-3">
                <button
                  disabled={actionLoading === selectedService._id}
                  onClick={() => {
                    void updateServiceStatus(selectedService, "Rejected");
                    setSelectedService(null);
                  }}
                  className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Reject
                </button>

                <button
                  disabled={actionLoading === selectedService._id}
                  onClick={() => {
                    void updateServiceStatus(selectedService, "Approved");
                    setSelectedService(null);
                  }}
                  className="rounded-xl bg-[#D97985] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#C56A77] disabled:opacity-50"
                >
                  Approve Service
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <XCircle size={25} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-[#3D302E]">
              Delete Service?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#8A7772]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#3D302E]">
                {deleteTarget.serviceName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={actionLoading === deleteTarget._id}
                className="rounded-xl border border-[#E9DED2] px-4 py-2.5 text-sm font-semibold text-[#6B514B] hover:bg-[#FAF7F2] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={() => void deleteService()}
                disabled={actionLoading === deleteTarget._id}
                className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {actionLoading === deleteTarget._id && (
                  <Loader2 size={15} className="animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
