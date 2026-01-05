import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
} from "@mui/material";
import Select, { type SelectProps } from "@mui/material/Select";
import {
    useController,
    type FieldValues,
    type UseControllerProps,
} from "react-hook-form";

// Props của component SelectInput
// - items: danh sách option cho Select
// - label: nhãn hiển thị cho Select
// - UseControllerProps<T>: name, control, rules... từ react-hook-form
// - Partial<SelectProps>: cho phép truyền thêm props của MUI Select (optional)
type Props<T extends FieldValues> = {
    items: { text: string; value: string }[]; // option hiển thị
    label: string; // label của Select
} & UseControllerProps<T> &
    Partial<SelectProps>;

// Component SelectInput generic
// T cho phép component dùng được với mọi form shape
export default function SelectInput<T extends FieldValues>(props: Props<T>) {
    // Kết nối field này với react-hook-form
    // field: value, onChange, onBlur, ref...
    // fieldState: error, invalid, touched...
    const { field, fieldState } = useController({ ...props });

    return (
        // FormControl giúp MUI xử lý layout + trạng thái error
        <FormControl fullWidth error={!!fieldState.error}>
            <InputLabel>{props.label}</InputLabel>
            {/* Label cho Select */}

            {/* Select được bind với react-hook-form */}
            <Select
                value={field.value || ""} // Giá trị từ RHF update sẽ có giá trị còn create là ""
                label={props.label} // Label hiển thị
                onChange={field.onChange} // Gọi RHF khi thay đổi value
            >
                {props.items.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                        {item.text}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
    );
}
