import { redirect } from "react-router";

export function loader() {
  return redirect("/dashboard/settings/profile");
}

export default function DashboardSettingsHomePage() {
  return null;
}
