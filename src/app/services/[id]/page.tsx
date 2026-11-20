
import { Suspense } from "react";
import ServiceDetailsClient from "./ServiceDetailsClient";

function ServiceDetailsFallback() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-20">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mb-8 h-5 w-32 rounded bg-[#EDE3D8]" />

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="h-[400px] rounded-2xl bg-[#EDE3D8]" />

          <div className="space-y-5">
            <div className="h-5 w-32 rounded bg-[#EDE3D8]" />
            <div className="h-10 w-3/4 rounded bg-[#EDE3D8]" />
            <div className="h-24 rounded bg-[#EDE3D8]" />
            <div className="h-12 w-1/2 rounded bg-[#EDE3D8]" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ServiceDetailsPage() {
  return (
    <Suspense fallback={<ServiceDetailsFallback />}>
      <ServiceDetailsClient />
    </Suspense>
  );
}
