import type React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "./ui/button";
import { useCallback, useId, useState } from "react";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "~/libs/trpc/clients/react";
import { useMutation } from "@tanstack/react-query";

export type PasswordChangeDialogProps = {
  children?: React.ReactNode;
} & DialogProps;

const schema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
    repeatPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.repeatPassword, {
    message: "New passwords do not match.",
    path: ["repeatPassword"],
  });

export function PasswordChangeDialog(props: PasswordChangeDialogProps) {
  const { children } = props;
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      repeatPassword: "",
    },
    resolver: zodResolver(schema),
  });

  const trpc = useTRPC();

  const { mutateAsync: update, isPending } = useMutation(
    trpc.user.me.updatePassword.mutationOptions()
  );

  const id = useId();

  const onSubmit = (data: z.infer<typeof schema>) => {
    update(data).then(() => {
      setIsOpen(false);
    });
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <Form {...form}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update your password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password
            </DialogDescription>
          </DialogHeader>

          <form
            id={id}
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4"
          >
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        autoFocus
                        placeholder="Enter your current password"
                        type="password"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your new password"
                        type="password"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="repeatPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Repeat your new password"
                          type="password"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button isLoading={isPending} form={id} type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
