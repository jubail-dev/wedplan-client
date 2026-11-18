
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import CustomerSidebar from "@/components/dashboard/customer-sidebar";

export const instant = false;
export default async function CustomerDashboardLayout({
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

  if (session.user.role !== "customer") {
    redirect(
      session.user.role === "vendor"
        ? "/dashboard/vendor"
        : "/",
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-1 bg-[#FAF7F2]">
      <CustomerSidebar />

      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
}
