import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useTRPC } from "~/libs/trpc/clients/react";
import { useState } from "react";

export type DeleteSessionAlertProps = {
  children?: React.ReactNode;
  id: string;
};

export function DeleteSessionAlert(props: DeleteSessionAlertProps) {
  const { children, id } = props;

  const [isOpen, setIsOpen] = useState(false);

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const { mutateAsync: deleteSession, isPending } = useMutation(
    trpc.user.me.deleteSession.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.user.me.sessions.queryFilter());
        setIsOpen(false);
      },
    })
  );

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you want to deactivate this session?
          </AlertDialogTitle>
          <AlertDialogDescription className="break-all">
            User logged in with this session will be logged out
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => {
              deleteSession(id);
            }}
            isLoading={isPending}
          >
            Deactivate
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
