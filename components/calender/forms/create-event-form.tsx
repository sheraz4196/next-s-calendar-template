"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEventFormSchema, EventType } from "@/types/zod-types";
import { useEventStore } from "@/stores/useEventsStore";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";
export default function CreateEventForm({
  setOpen,
  selectedEvent,
  update,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedEvent?: EventType;
  update?: boolean;
}) {
  const { addEvent, editEvent } = useEventStore();
  const form = useForm<z.infer<typeof createEventFormSchema>>({
    resolver: zodResolver(createEventFormSchema),
    defaultValues: {
      title: selectedEvent?.title || "",
      description: selectedEvent?.description || "",
      category: selectedEvent?.category || undefined,
      categoryUrl: selectedEvent?.categoryUrl || undefined,
      allDay: selectedEvent?.allDay || false,
      dateRange: {
        from: selectedEvent?.dateRange.from || undefined,
        to: selectedEvent?.dateRange.to || undefined,
      },
      timeStart: "",
      timeEnd: "",
      thumbnail: selectedEvent?.thumbnail || undefined,
    },
  });

  console.log(form.watch().category);

  async function onSubmit(values: z.infer<typeof createEventFormSchema>) {
    if (update && selectedEvent) {
      editEvent(selectedEvent?.title, {
        ...selectedEvent,
        title: values.title,
        allDay: values.allDay,
        category: values.category,
        categoryUrl: values.categoryUrl,
        dateRange: {
          from: values.dateRange.from,
          to: values.dateRange.to,
        },
        thumbnail: values.thumbnail,
        description: values.description,
        timeStart: undefined,
        timeEnd: undefined,
      });
      toast.success("Event Edited Successfully");
    }
    if (!update) {
      addEvent(values);
      toast.success("Event Added Successfully");
    }
    console.log(values);
    setOpen(false);
  }
  const CATEGORIES = ["tournament", "league", "playgrounds"];
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      const file = e.target.files[0] || undefined;
                      field.onChange(file);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Please Select A category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="capitalize"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch().category === "tournament" && (
          <FormField
            control={form.control}
            name="categoryUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Url to the{" "}
                  <span className="capitalize">
                    {form.getValues().category}
                  </span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {form.watch().category === "league" && (
          <FormField
            control={form.control}
            name="categoryUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Url to the{" "}
                  <span className="capitalize">
                    {form.getValues().category}
                  </span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex flex-col gap-4">
          <FormLabel>Date and Time</FormLabel>
          <div className="flex items-center justify-between gap-6">
            <FormField
              control={form.control}
              name="allDay"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">All Day</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "LLL dd, y")} -{" "}
                                {format(field.value.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(field.value.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value.from}
                          selected={{
                            from: field.value.from!,
                            to: field.value.to,
                          }}
                          onSelect={field.onChange}
                          numberOfMonths={1}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormLabel>Time Range</FormLabel>
          <div className="flex items-center justify-between gap-6">
            <FormField
              control={form.control}
              name="timeStart"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormLabel></FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timeEnd"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormLabel></FormLabel>
                  <FormControl>
                    <Input {...field} type="time" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <DialogFooter className="p-2 border-t">
          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button variant={"secondary"}>Close</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </div>
        </DialogFooter>
      </form>
    </Form>
  );
}
