import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Undo2 } from "lucide-react";

interface SelectHighestEducationInput {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SelectHighestEducationInput({ value, onChange }: SelectHighestEducationInput) {

  const [isInputMode, setIsInputMode] = useState<boolean>(false);


  const dataEdu = ['SD', 'SMP', 'SMA', 'D3', 'D4/S1', 'S2', 'S3'];

  useEffect(() => {
    if (value && !dataEdu.includes(value)) {
      setIsInputMode(true);
    }
  }, [value]);


  const handleSelectInputChange = (val: string) => {
    if (val === "etc") {
      setIsInputMode(true);
      onChange("");
    } else {
      onChange(val);
    }
  }


  return (<>
    {isInputMode ? (
      <div className="flex items-center gap-2">
        <Input
          placeholder="Insert Highest Education"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button
          className="cursor-pointer"
          onClick={() => setIsInputMode(false)}
        >
          <Undo2 />
        </Button>
      </div>
    ) : (
      <Select value={value} onValueChange={handleSelectInputChange}>
        <SelectTrigger className={'cursor-pointer'}>
          <SelectValue placeholder="Select education" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="cursor-pointer" value={'etc'}>Input Education</SelectItem>
          {dataEdu.map((edu) => (
            <SelectItem className="cursor-pointer" value={edu}>{edu}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
  </>
  )
}
