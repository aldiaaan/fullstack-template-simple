import { DashboardSectionHeader } from "~/components/dashboard/section-header";
import { SidebarInset } from "~/components/ui/sidebar";

export default function DashboardDashboardPage() {
  return (
    <SidebarInset>
      <DashboardSectionHeader title="Dashboard" />
    </SidebarInset>
  );
}
