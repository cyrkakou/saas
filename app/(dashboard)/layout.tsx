"use client";

import { ReactNode } from "react";
import { AppLayout } from "@/presentation/components/shared/app-layout";
import { DashboardSidebar } from "@/presentation/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AppLayout
      sidebar={<DashboardSidebar collapsed={false} onToggle={() => {}} />}
      title="Dashboard"
    >
      {children}
    </AppLayout>
  );
}
