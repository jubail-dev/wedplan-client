
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Eye,
  Loader2,
  Search,
  ShieldBan,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
}

interface UserDetails extends AdminUser {
  businessName?: string;
  subscriptionPlan?: string;
  subscriptionExpiresAt?: string;
}

interface UsersResponse {
  success: boolean;
  totalUsers: number;
  users: AdminUser[];
  message?: string;
}

interface UserDetailsResponse {
  success: boolean;
  user: UserDetails;
  message?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_SERVER_URL;

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [totalUsers, setTotalUsers] = useState(0);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] =
    useState<UserDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const tokenResponse = await fetch("/api/auth/token");
      const tokenData: { token?: string } = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token) {
        throw new Error("Authentication failed. Please sign in again.");
      }

      if (!BASE_URL) {
        throw new Error("Server URL is not configured.");
      }

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (role !== "all") {
        params.set("role", role);
      }

      const response = await fetch(
        `${BASE_URL}/admin/users?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        },
      );

      const data: UsersResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load users.");
      }

      setUsers(data.users);
      setTotalUsers(data.totalUsers);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [search, role]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchUsers();
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [fetchUsers]);

  const handleViewDetails = async (userId: string) => {
    try {
      setDetailsLoading(true);
      setSelectedUser(null);

      const tokenResponse = await fetch("/api/auth/token");
      const tokenData: { token?: string } = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token || !BASE_URL) {
        throw new Error("Unable to authenticate.");
      }

      const response = await fetch(
        `${BASE_URL}/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        },
      );

      const data: UserDetailsResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load user details.");
      }

      setSelectedUser(data.user);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      toast.error(message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleToggleBlock = async (user: AdminUser | UserDetails) => {
    try {
      setUpdatingId(user._id);

      const tokenResponse = await fetch("/api/auth/token");
      const tokenData: { token?: string } = await tokenResponse.json();

      if (!tokenResponse.ok || !tokenData.token || !BASE_URL) {
        throw new Error("Unable to authenticate.");
      }

      const response = await fetch(
        `${BASE_URL}/admin/users/${user._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({
            isBlocked: !user.isBlocked,
          }),
        },
      );

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update user status.");
      }

      const updatedStatus = !user.isBlocked;

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item._id === user._id
            ? { ...item, isBlocked: updatedStatus }
            : item,
        ),
      );

      setSelectedUser((currentUser) =>
        currentUser?._id === user._id
          ? { ...currentUser, isBlocked: updatedStatus }
          : currentUser,
      );

      toast.success(data.message);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  };

  return (
    <section className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#D97985]">
            <Users size={16} />
            USER MANAGEMENT
          </div>

          <h2 className="font-heading text-2xl font-bold text-[#292524]">
            Manage Users
          </h2>

          <p className="mt-1 text-sm text-[#78716C]">
            View, search and manage registered platform users.
          </p>
        </div>

        <div className="rounded-xl border border-[#E9DDD2] bg-white px-4 py-3">
          <p className="text-xs text-[#78716C]">Registered Users</p>
          <p className="mt-1 text-2xl font-bold text-[#292524]">
            {totalUsers}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E9DDD2] bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[#A8A29E]"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email..."
            className="h-11 w-full rounded-xl border border-[#E7E5E4] bg-[#FAF9F7] pr-4 pl-10 text-sm text-[#292524] outline-none transition focus:border-[#D97985]"
          />
        </div>

        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="h-11 rounded-xl border border-[#E7E5E4] bg-[#FAF9F7] px-4 text-sm text-[#292524] outline-none focus:border-[#D97985]"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E9DDD2] bg-white">
        <div className="flex items-center justify-between border-b border-[#F0E9E2] px-5 py-4">
          <h3 className="font-semibold text-[#292524]">
            Registered Users
          </h3>

          <span className="text-xs text-[#78716C]">
            {users.length} users shown
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-[#78716C]">
            <Loader2 className="animate-spin" size={20} />
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
            <Users size={35} className="mb-3 text-[#C4B5A5]" />
            <h4 className="font-semibold text-[#292524]">
              No users found
            </h4>
            <p className="mt-1 text-sm text-[#78716C]">
              Try changing your search or role filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-[#FAF7F2] text-xs text-[#78716C]">
                <tr>
                  <th className="px-5 py-4 font-semibold">USER</th>
                  <th className="px-5 py-4 font-semibold">ROLE</th>
                  <th className="px-5 py-4 font-semibold">JOINED</th>
                  <th className="px-5 py-4 font-semibold">STATUS</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    ACTIONS
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0E9E2]">
                {users.map((user) => (
                  <tr key={user._id} className="transition hover:bg-[#FCFAF8]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F8E5E7] text-sm font-semibold text-[#B85D6A]">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            getInitials(user.name)
                          )}
                        </div>

                        <div>
                          <p className="font-medium text-[#292524]">
                            {user.name}
                          </p>
                          <p className="text-xs text-[#78716C]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#F5F0EA] px-3 py-1 text-xs font-medium capitalize text-[#57534E]">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#78716C]">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.isBlocked
                            ? "bg-red-50 text-red-600"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => void handleViewDetails(user._id)}
                          title="View user details"
                          className="flex size-9 items-center justify-center rounded-lg border border-[#E7E5E4] text-[#78716C] transition hover:border-[#D97985] hover:text-[#D97985]"
                        >
                          <Eye size={17} />
                        </button>

                        {user.role !== "admin" && (
                          <button
                            type="button"
                            onClick={() => void handleToggleBlock(user)}
                            disabled={updatingId === user._id}
                            title={user.isBlocked ? "Unblock user" : "Block user"}
                            className={`flex size-9 items-center justify-center rounded-lg transition disabled:opacity-50 ${
                              user.isBlocked
                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                          >
                            {updatingId === user._id ? (
                              <Loader2 size={17} className="animate-spin" />
                            ) : user.isBlocked ? (
                              <ShieldCheck size={17} />
                            ) : (
                              <ShieldBan size={17} />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {(detailsLoading || selectedUser) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            if (!detailsLoading) setSelectedUser(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-details-title"
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h3
                id="user-details-title"
                className="text-xl font-bold text-[#292524]"
              >
                User Details
              </h3>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                disabled={detailsLoading}
                className="flex size-9 items-center justify-center rounded-lg text-[#78716C] hover:bg-[#F5F0EA]"
              >
                <X size={20} />
              </button>
            </div>

            {detailsLoading ? (
              <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-[#78716C]">
                <Loader2 size={20} className="animate-spin" />
                Loading user details...
              </div>
            ) : selectedUser ? (
              <>
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#F8E5E7] text-lg font-bold text-[#B85D6A]">
                    {selectedUser.image ? (
                      <img
                        src={selectedUser.image}
                        alt={selectedUser.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      getInitials(selectedUser.name)
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-[#292524]">
                      {selectedUser.name}
                    </h4>
                    <p className="text-sm text-[#78716C]">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    ["Role", selectedUser.role],
                    ["Status", selectedUser.isBlocked ? "Blocked" : "Active"],
                    ["Business Name", selectedUser.businessName || "N/A"],
                    ["Subscription Plan", selectedUser.subscriptionPlan || "N/A"],
                    [
                      "Subscription Expires",
                      selectedUser.subscriptionExpiresAt
                        ? formatDate(selectedUser.subscriptionExpiresAt)
                        : "N/A",
                    ],
                    ["Joined", formatDate(selectedUser.createdAt)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 border-b border-[#F0E9E2] pb-3"
                    >
                      <span className="text-sm text-[#78716C]">{label}</span>
                      <span className="text-right text-sm font-medium capitalize text-[#292524]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {selectedUser.role !== "admin" && (
                  <button
                    type="button"
                    onClick={() => void handleToggleBlock(selectedUser)}
                    disabled={updatingId === selectedUser._id}
                    className={`mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${
                      selectedUser.isBlocked
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {updatingId === selectedUser._id ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : selectedUser.isBlocked ? (
                      <ShieldCheck size={17} />
                    ) : (
                      <ShieldBan size={17} />
                    )}

                    {selectedUser.isBlocked ? "Unblock User" : "Block User"}
                  </button>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}
