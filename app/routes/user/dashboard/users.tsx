import { DashboardSectionHeader } from "~/components/dashboard/section-header";
import { SidebarInset } from "~/components/ui/sidebar";

export default function DashboardUsersPage() {
  return (
    <SidebarInset>
      <DashboardSectionHeader title="Users" />
    </SidebarInset>
  );
}
