import { type DateArg, format } from "date-fns";

export function formatDate(data: DateArg<Date>) {
    return format(data, "dd MMM yyyy h:mm a");
}
