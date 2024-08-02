import { z } from "zod";
export const createEventFormSchema = z.object({
  title: z.string().min(1, { message: "Please Provide a title" }),
  description: z
    .string()
    .min(1, { message: "Please Provide Some Description" }),
  allDay: z.boolean().optional(),
  category: z.enum(["tournament", "league", "playgrounds"], {
    message: "Please Select a Category",
  }),
  categoryUrl: z.string().url().optional(),
  dateRange: z
    .object(
      {
        from: z.date(),
        to: z.date().optional(),
      },
      { required_error: "Date is required." }
    )
    .refine((dateRange) => {
      return !!dateRange.to;
    }, "End Date is required."),
  timeStart: z.string().optional(),
  timeEnd: z.string().optional(),
  thumbnail: z.instanceof(File).optional(),
});
export type EventType = z.infer<typeof createEventFormSchema>;
