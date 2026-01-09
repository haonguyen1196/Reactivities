import { type DateArg, format } from "date-fns";
import z from "zod";

export function formatDate(data: DateArg<Date>) {
    return format(data, "dd MMM yyyy h:mm a");
}
// hàm tái sử dụng logic validate input phải required
export const requiredString = (fieldName: string) =>
    z
        .string({ required_error: `${fieldName} is required` })
        .min(1, { message: `${fieldName} is required` });
