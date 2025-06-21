import {
  IconBrandAndroid,
  IconBrandApple,
  IconBrandWindows,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  CircleHelp,
  Pencil,
  RotateCcwKey,
  UserLock,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, type HTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { AnimatedSkeletonList } from "~/components/animated/skeleton-list";
import { DeleteSessionAlert } from "~/components/delete-session-alert";
import { EmptyState } from "~/components/empty-state";
import { PasswordChangeDialog } from "~/components/password-change-dialog";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useUser } from "~/hooks/use-user";
import { useTRPC } from "~/libs/trpc/clients/react";
import { cn } from "~/utils/react";

export type SessionListItemProps = {
  os?: string;
  browserName?: string;
  browserVersion?: string;
  id: string;
} & HTMLAttributes<HTMLDivElement>;

export function SessionListItem(props: SessionListItemProps) {
  const { className, os, id, browserName, browserVersion, ...rest } = props;

  const icon = useMemo(() => {
    switch (os) {
      case "Android":
        return (
          <div className="p-3 rounded-full bg-green-50">
            <IconBrandAndroid className="text-green-600" />
          </div>
        );
      case "Windows":
        return (
          <div className="p-3 rounded-full bg-cyan-50">
            <IconBrandWindows className="text-cyan-600" />
          </div>
        );
      case "macOS":
        return (
          <div className="p-3 rounded-full bg-gray-50">
            <IconBrandApple className="text-gray-600" />
          </div>
        );

      default:
        return (
          <div className="p-3 rounded-full bg-gray-50">
            <CircleHelp className="text-gray-600" />
          </div>
        );
    }
  }, [os]);

  return (
    <div className={cn(className, "flex items-center")} {...rest}>
      {icon}
      <div className="grow ml-3">
        <p className="font-semibold tracking-tight">{browserName}</p>
        <p className="text-muted-foreground text-xs">v.{browserVersion}</p>
      </div>
      <div>
        <Tooltip>
          <DeleteSessionAlert id={id}>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">
                Deactivate
              </Button>
            </TooltipTrigger>
          </DeleteSessionAlert>
          <TooltipContent side="right">Logout from this device</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

const AnimatedSessionListItem = motion.create(SessionListItem);

function PasswordField() {}

export default function DashboardSettingsSecurityPage() {
  const form = useForm();

  const trpc = useTRPC();

  const user = useUser();

  const { data: sessions, isFetching } = useQuery(
    trpc.user.me.sessions.queryOptions()
  );

  return (
    <>
      <div>
        <div className="flex  mb-6 items-center">
          <span className="p-3 rounded-md bg-gray-100">
            <UserLock size={20} className="text-gray-900" />
          </span>
          <div className="ml-4">
            <p className="mb-0.5 font-semibold tracking-tight">Security</p>
            <p className="text-muted-foreground text-xs">
              Manage your account credentials and security settings
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Form {...form}>
              <FormItem className="flex-1">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input disabled defaultValue="why????" type="password" />
                    <Tooltip delayDuration={0}>
                      <PasswordChangeDialog>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="outline">
                            <RotateCcwKey size={24} />
                          </Button>
                        </TooltipTrigger>
                      </PasswordChangeDialog>
                      <TooltipContent>
                        Ask password request change
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem className="flex-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input disabled defaultValue={user?.email} />
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="outline">
                          <Pencil size={24} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Change email (TBA)</TooltipContent>
                    </Tooltip>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
      <Separator className="my-2" />
      <div>
        <div className="flex mb-6 items-center">
          <span className="p-3 rounded-md bg-gray-100">
            <Activity size={20} className="text-gray-900" />
          </span>
          <div className="ml-4 flex-1">
            <p className="mb-0.5 font-semibold tracking-tight">Sessions</p>
            <p className="text-muted-foreground text-xs">
              See devices currently logged into your account and manage their
              access
            </p>
          </div>
        </div>
        <div>
          <div className="space-y-3">
            {sessions && sessions.length === 0 && (
              <EmptyState
                title="Crickets... (No Sessions Here!)"
                subtitle="Once you log in, your authenticated sessions will pop up right here."
              />
            )}
            {sessions && !isFetching ? (
              // TODO: refactor this
              sessions?.map((session, index) => {
                const MAX_STAGGER_DELAY_TOTAL = 0.5;
                const ITEM_ANIMATION_DURATION = 0.25;

                const normalizedIndex =
                  sessions.length > 1 ? index / (sessions.length - 1) : 0;

                const easedDelay =
                  Math.pow(normalizedIndex, 3) * MAX_STAGGER_DELAY_TOTAL;

                return (
                  <AnimatePresence key={session.id}>
                    <AnimatedSessionListItem
                      layout
                      id={session.id}
                      key={session.id}
                      browserName={session.deviceInfo.browser.name}
                      browserVersion={session.deviceInfo.browser.version}
                      os={session.deviceInfo.os.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        ease: "easeIn", // This ease applies to the opacity animation itself
                        duration: ITEM_ANIMATION_DURATION,
                        delay: easedDelay, // This is the dynamically calculated ease-in delay for the start of the animation
                      }}
                    />
                  </AnimatePresence>
                );
              })
            ) : (
              <AnimatedSkeletonList n={5} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
