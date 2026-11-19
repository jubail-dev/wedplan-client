import AdminStats from "@/components/dashboard/admin-stats";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-full p-6 md:p-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-[#D97985]">
          ADMIN PANEL
        </p>

        <h1 className="font-heading text-3xl font-bold text-[#292524]">
          Dashboard Overview
        </h1>

        <p className="mt-2 text-sm text-[#78716C]">
          Welcome to your WedPlan administration panel.
        </p>
      </div>

      <AdminStats />
    </main>
  );
}