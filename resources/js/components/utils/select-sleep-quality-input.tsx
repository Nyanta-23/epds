import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Enum } from "@/types/resource";

interface SelectSleepQualityInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  enums: Enum[];
}

export function SelectSleepQualityInput({ value, enums, onChange, className }: SelectSleepQualityInputProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`${className} cursor-pointer`}>
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>

        {enums.map((e) => (
          <SelectItem key={e.value} value={e.value.toString()}>
            {e.label}
          </SelectItem>
        ))}


      </SelectContent>
    </Select>
  )
}
