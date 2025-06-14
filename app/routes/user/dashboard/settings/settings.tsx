import { DashboardSectionHeader } from "~/components/dashboard/section-header";
import { SidebarInset } from "~/components/ui/sidebar";
import { DashboardSectionMain } from "~/components/dashboard/section-main";
import { useUser } from "~/hooks/use-user";
import { Input } from "~/components/ui/input";
import { cn } from "~/utils/react";
import { Activity, RotateCcwKey, User, UserLock } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Outlet } from "react-router";

export type SettingsInputFieldProps = React.ComponentProps<typeof Input> & {
  label?: string;
  description?: string;
};

export function SettingsInputField(props: SettingsInputFieldProps) {
  const { className, description, label, ...rest } = props;

  return (
    <div className={cn(className, "flex items-center")}>
      <div className="flex-1">
        <p className="text-sm mb-0.5 font-medium tracking-tight text-primary">
          {label}
        </p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div>
        <Input {...rest} />
      </div>
    </div>
  );
}

const schema = z.object({
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
});

export default function DashboardSettingsPage() {
  return (
    <SidebarInset>
      <DashboardSectionHeader
        tabs={[
          {
            href: "/dashboard/settings/profile",
            key: "profile",
            label: "Profile",
          },
          {
            href: "/dashboard/settings/security",
            key: "security",
            label: "Security",
          },
        ]}
        title="Settings"
      />
      <DashboardSectionMain className="max-w-[772px]">
        <Outlet />
      </DashboardSectionMain>
    </SidebarInset>
  );
}
