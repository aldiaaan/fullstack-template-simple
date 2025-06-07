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

export type DeleteUsersAlertProps = {
  children?: React.ReactNode;
  users?: {
    id: string;
    name: string;
    email: string;
  }[];
};

export function DeleteUsersAlert(props: DeleteUsersAlertProps) {
  const { children, users = [] } = props;

  const [isOpen, setIsOpen] = useState(false);

  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const { mutateAsync: deleteUsers, isPending } = useMutation(
    trpc.user.hq.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.user.hq.get.queryFilter());
        setIsOpen(false);
      },
    })
  );

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="break-all">
            This action cannot be undone. This will permanently delete this
            account from server. All users that will be deleted are: <br />
            <br />
            {users.map((user) => (
              <code className="bg-gray-200 mr-2 px-1 py-1">{user.email}</code>
            ))}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            onClick={() => {
              deleteUsers(users?.map((user) => user.id));
            }}
            variant="destructive"
            isLoading={isPending}
          >
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
