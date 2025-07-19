"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { DialogProps } from "@radix-ui/react-dialog";
import { useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useMediaQuery } from "~/hooks/use-media-query";
import type { BackgroundJobConfig } from "~/libs/background-jobs/constants";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { cn } from "~/utils/react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useTRPC } from "~/libs/trpc/clients/react";
import { useMutation } from "@tanstack/react-query";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDownIcon } from "lucide-react";

export type CreateJobDialogProps = {
  children?: React.ReactNode;
  config: BackgroundJobConfig;
  queue: string;
} & DialogProps;

const schema = z
  .object({
    name: z.string(),
    payload: z.any().default({}),
    run: z.enum(["immediately", "scheduled"]),
    repeat: z.string().optional(),
    repeatKey: z.string().optional(),
    schedule: z
      .object({
        date: z.coerce.date(),
        time: z.string(),
      })
      .optional(),
  })
  .refine(
    (data) => {
      if (data.run === "scheduled") {
        return !!data.schedule?.date;
      }
      return true;
    },
    {
      message: "Date is required when the run is scheduled",
      path: ["schedule", "date"],
    }
  );

export function CreateJobDialog(props: CreateJobDialogProps) {
  const { children, config, queue, ...rest } = props;

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const formId = useId();

  const trpc = useTRPC();

  const { mutateAsync: addJob, isPending: isAddingJob } = useMutation(
    trpc.backgroundJobs.jobs.add.mutationOptions({})
  );

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      name: "",
      payload: {},
      run: "immediately",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    let combinedDate: Date | undefined;

    if (data.schedule) {
      combinedDate = new Date(data.schedule.date);

      const [hours, minutes, seconds] = data.schedule.time
        .split(":")
        .map((v) => parseInt(v, 10));

      combinedDate.setHours(hours, minutes, seconds);
    }

    addJob({
      name: data.name,
      queue: queue,
      payload: data.payload,
      schedule: combinedDate,
      repeat: data.repeat,
      run: data.run,
    }).then(() => setOpen(false));
  };

  const jobs = useMemo(
    () => config.queues.find((q) => q.name === queue)?.jobs || [],
    [queue]
  );

  const configurables =
    jobs.find((job) => job.name === form.watch("name"))?.configurable || [];

  if (isDesktop) {
    return (
      <Form {...form}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Schedule a New Job</DialogTitle>
              <DialogDescription>
                Set up a new automated task to run in the background. You can
                monitor its progress after creation.
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-5"
              id={formId}
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Name</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a job" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {jobs.map((job) => (
                              <SelectItem value={job.name} key={job.name}>
                                {job.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("name") && (
                <div>
                  <FormField
                    control={form.control}
                    name="run"
                    defaultValue="immediately"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Run</FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.resetField("schedule");
                            }}
                            className="flex"
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="immediately" id="r1" />
                              <Label htmlFor="r1">Immediately</Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="scheduled" id="r2" />
                              <Label htmlFor="r2">Scheduled</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {form.watch("run") === "scheduled" && (
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="schedule.date"
                    render={({ field }) => (
                      <div>
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <div className="flex flex-col flex-1 gap-3">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="justify-between font-normal truncate"
                                  >
                                    {field.value
                                      ? field.value.toLocaleDateString()
                                      : "Select date"}
                                    <ChevronDownIcon />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto overflow-hidden p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    captionLayout="dropdown"
                                    onSelect={(date) => {
                                      console.log({ date });
                                      field.onChange(date);
                                    }}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="schedule.time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="time"
                            step="1"
                            className="bg-background w-auto appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              {form.watch("run") === "immediately" && form.watch("name") && (
                <FormField
                  control={form.control}
                  name="repeat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repeat</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter cron pattern e.g 0 15 3 * * * (optional)"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {form.watch("repeat") && (
                <FormField
                  control={form.control}
                  name="repeatKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repeat Key</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Describe your scheduler, e.g Cleaning Up Expired Session"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {form.watch("name") && (
                <div>
                  <Label className="mb-2">Payload</Label>
                  <div className="space-y-0  ">
                    {configurables.map((configurable, index) => {
                      switch (configurable.type) {
                        case "string": {
                          return (
                            <FormField
                              control={form.control}
                              name={`payload.[${configurable.field}]`}
                              render={({ field }) => (
                                <FormItem className="flex gap-0 first:[&>input]:rounded-b-none first:[&>input]:rounded-tr-md last:[&>input]:rounded-br-md last:[&>input]:border-b first:[&>input]:border-b-0  first:[&>label]:border-b-0 last:[&>label]:border-t-0 first:[&>label]:rounded-l-md first:[&>label]:rounded-b-none last:[&>label]:rounded-bl-md">
                                  <FormLabel className="bg-muted py-2.5 inline-block truncate min-w-0 w-48 border border-r-0  px-3 border-input">
                                    {configurable.name}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={`Enter ${configurable.name}`}
                                      className="rounded-none border-b-0 shadow-none"
                                      style={{
                                        zIndex:
                                          10 + configurables.length - index,
                                      }}
                                      {...field}
                                    />
                                  </FormControl>

                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          );
                        }
                      }
                    })}
                  </div>
                </div>
              )}
            </form>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button isLoading={isAddingJob} type="submit" form={formId}>
                Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Form>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DrawerDescription>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
