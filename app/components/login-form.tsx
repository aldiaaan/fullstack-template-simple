import { cn } from "~/utils/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Link, useNavigate } from "react-router";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTRPC } from "~/libs/trpc/clients/react";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { OctagonX } from "lucide-react";

const schema = z.object({
  password: z.string().min(8),
  email: z.string().min(1).email("This is not a valid email"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const trpc = useTRPC();

  const {
    isPending,
    error,
    mutateAsync: login,
  } = useMutation(trpc.auth.login.mutationOptions());

  const navigate = useNavigate();

  const onSubmit = useCallback((data: z.infer<typeof schema>) => {
    login(data).then(() => navigate("/dashboard"));
  }, []);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col mb-6">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your account
                  </p>
                  {error && (
                    <div className="mt-4">
                      <Alert variant="destructive">
                        <OctagonX className="h-4 w-4" />
                        <AlertTitle>Oops! something went wrong</AlertTitle>
                        <AlertDescription>{error?.message}</AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            autoFocus
                            placeholder="john@gmail.com"
                            type="email"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="password" required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button isLoading={isPending} type="submit" className="w-full">
                  Login
                </Button>
                <div className="h-12"></div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
