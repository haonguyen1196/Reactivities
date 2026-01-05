import { z } from "zod";

// hàm tái sử dụng logic validate input phải required
const requiredString = (fieldName: string) =>
    z
        .string()
        .optional()
        .refine((val) => val !== undefined && val.trim() !== "", {
            message: `${fieldName} is required`,
        });

export const activitySchema = z.object({
    title: requiredString("Title"),
    description: requiredString("Description"),
    category: requiredString("Category"),
    date: z.coerce.date({
        message: "Date is required",
    }),
    location: z.object({
        venue: requiredString("Venue"),
        city: z.string().optional(),
        latitude: z.coerce.number(),
        longitude: z.coerce.number(),
    }),
});

// chuyển thành type để useForm tiện làm việc với TypeScript
export type ActivitySchema = z.infer<typeof activitySchema>;
