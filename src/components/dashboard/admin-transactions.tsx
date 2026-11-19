
"use client";

import { useEffect, useState } from "react";

interface Vendor {
  name?: string;
  email?: string;
  image?: string;
  businessName?: string;
}

interface Transaction {
  _id: string;
  vendorId: string;
  vendor?: Vendor;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface TransactionsResponse {
  success: boolean;
  totalTransactions: number;
  transactions: Transaction[];
  message?: string;
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const tokenResponse = await fetch("/api/auth/token");
        const tokenData: { token?: string } = await tokenResponse.json();

        if (!tokenResponse.ok || !tokenData.token) {
          throw new Error("Authentication failed. Please login again.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_SERVER_URL}/admin/transactions`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
            cache: "no-store",
          },
        );

        const data: TransactionsResponse = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch transactions.");
        }

        setTransactions(data.transactions);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while fetching transactions.",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchTransactions();
  }, []);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Transactions
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View all vendor subscription payments and transaction records.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Total Transactions
        </p>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          {loading ? "..." : transactions.length}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            All Transactions
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <p className="text-sm text-gray-500">
              Loading transactions...
            </p>
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-medium text-gray-700">
              No transactions found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Transaction records will appear here when payments are completed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="whitespace-nowrap px-5 py-4 font-semibold">
                    Vendor Information
                  </th>
                  <th className="whitespace-nowrap px-5 py-4 font-semibold">
                    Subscription Plan
                  </th>
                  <th className="whitespace-nowrap px-5 py-4 font-semibold">
                    Payment Amount
                  </th>
                  <th className="whitespace-nowrap px-5 py-4 font-semibold">
                    Payment Status
                  </th>
                  <th className="whitespace-nowrap px-5 py-4 font-semibold">
                    Transaction Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="min-w-40">
                        <p className="font-medium text-gray-900">
                          {transaction.vendor?.businessName ||
                            transaction.vendor?.name ||
                            "Unknown Vendor"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {transaction.vendor?.email || "No email available"}
                        </p>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold capitalize text-purple-700">
                        {transaction.plan}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-900">
                      {formatAmount(transaction.amount, transaction.currency)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          transaction.status.toLowerCase() === "paid"
                            ? "bg-green-50 text-green-700"
                            : transaction.status.toLowerCase() === "pending"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-600">
                      {formatDate(transaction.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
