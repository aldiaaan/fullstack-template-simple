import { CircleOff, User, UserCheck, UserSearch } from "lucide-react";
import type { HTMLAttributes } from "react";
import type React from "react";
import { useUser } from "~/hooks/use-user";
import { cn } from "~/utils/react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useTRPC } from "~/libs/trpc/clients/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router";

export type ImpersonateToolbarProps = {
  children?: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export function ImpersonateToolbar(props: ImpersonateToolbarProps) {
  const { children, className, ...rest } = props;

  const trpc = useTRPC();

  const { mutateAsync: quitImpersonating, isPending: isQuittingImpersonation } =
    useMutation(trpc.user.hq.quitImpersonating.mutationOptions());

  const navigate = useNavigate();

  const location = useLocation();

  const queryClient = useQueryClient();

  const user = useUser();

  return (
    <div
      className={cn(
        className,
        "py-2 px-2.5 flex gap-1 items-center rounded-full text-sm shadow-2xl z-50 bg-black"
      )}
      {...rest}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className="h-8 w-8 dark text-gray-200 rounded-full">
            <AvatarImage alt={user.email} />
            <AvatarFallback className="rounded-lg">
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>
          Currently impersonating as{" "}
          <span className="font-medium">{user.email}</span>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => {
              quitImpersonating().then(() => {
                navigate(location.pathname, { viewTransition: true });
                queryClient.invalidateQueries();
              });
            }}
            className="cursor-pointer hover:text-red-100 text-red-300 hover:bg-white/10 transition-all px-1 py-1 rounded-full"
          >
            <CircleOff className="w-5 h-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>Stop impersonating</TooltipContent>
      </Tooltip>
    </div>
  );
}
