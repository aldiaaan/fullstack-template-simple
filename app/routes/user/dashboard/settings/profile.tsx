import { useUser } from "~/hooks/use-user";
import { Input } from "~/components/ui/input";
import { cn } from "~/utils/react";
import { User } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "~/libs/trpc/clients/react";

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
});

export default function DashboardSettingsProfilePage() {
  const user = useUser();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName,
    },
  });

  const trpc = useTRPC();

  const { mutateAsync: update, isPending } = useMutation(
    trpc.user.me.updateProfile.mutationOptions()
  );

  const onSubmit = (data: z.infer<typeof schema>) => {
    update(data).then(() => {
      form.reset(data);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex  items-center mb-6">
          <span className="p-3 rounded-md bg-gray-100">
            <User size={20} className="text-gray-900" />
          </span>
          <div className="ml-4">
            <p className="mb-0.5 font-semibold tracking-tight">
              Personal Information
            </p>
            <p className="text-muted-foreground text-xs">
              View and edit your personal information, including your name,
              profile picture, and role
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {form.formState.isDirty && (
            <div className="flex gap-2 justify-end mt-4">
              <Button
                onClick={() => {
                  form.reset();
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button isLoading={isPending}>Save Changes</Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
