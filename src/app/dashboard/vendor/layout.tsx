
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import VendorSidebar from "@/components/dashboard/vendor-sidebar";

export const instant = false;

export default async function VendorDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "vendor") {
    redirect(
      session.user.role === "customer"
        ? "/dashboard/customer"
        : "/",
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-1 flex-col bg-[#FAF7F2] lg:flex-row">
      <VendorSidebar />

      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
}
