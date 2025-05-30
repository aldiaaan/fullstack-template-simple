import { Outlet } from "react-router";
import { DashboardSidebar } from "~/components/dashboard/sidebar/sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <DashboardSidebar variant="inset" />
      <Outlet />
    </SidebarProvider>
  );
}
