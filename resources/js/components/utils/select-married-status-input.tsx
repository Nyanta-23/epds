import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectMarriedStatusInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export function SelectMarriedStatusInput({ value, onChange, className }: SelectMarriedStatusInputProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`${className} cursor-pointer`}>
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className="cursor-pointer" value="married">Married</SelectItem>
        <SelectItem className="cursor-pointer" value="not_married">Belum menikah</SelectItem>
        <SelectItem className="cursor-pointer" value="divorced">Duda / Janda</SelectItem>
      </SelectContent>
    </Select>
  )
}
