import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormBaby } from "@/types/form";
import { DatePicker } from "@/components/utils/date-picker";
import { ChevronDown } from "lucide-react";
import { Patient } from "@/types/resource";
import { Enums } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import BabyActionForm from "./baby-action-form";

type Errors = Partial<Record<keyof FormBaby, string>>;


interface BabyFormInformationProps {
  data: FormBaby;
  errors: Errors;
  process: boolean;
  handleInputChange: (field: keyof FormBaby, value: string | number | null) => void;
  action: () => void;
  patients: Patient[];
  enums: Enums;
}

export default function BabyFormInformation({ data, errors, process, handleInputChange, action, patients, enums }: BabyFormInformationProps) {

  const identityErrorClassName = (field: keyof Errors) => {
    return errors[field] ? 'border-red-500 focus:ring-red-500' : '';
  }

  const { baby_conditions, baby_typeof_deliveries } = enums;

  console.log(data);

  return (
    <div className="space-y-4 p-6">

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Mother Name <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Select value={data.mother_id}
            onValueChange={(value) => handleInputChange('mother_id', value)}
            required
          >
            <SelectTrigger id="mother-select" className={`w-full cursor-pointer ${identityErrorClassName('mother_id')}`}>
              <SelectValue placeholder="Select Mother" />
            </SelectTrigger>

            <SelectContent>
              {patients && patients.map((data) => (
                <SelectItem className="cursor-pointer" key={data.id} value={data.id}>
                  {data.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Which Child <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          value={data.which_child}
          onChange={(e) => handleInputChange('which_child', e.target.value === '' ? '' : Number(e.target.value))}
          className={identityErrorClassName('which_child')}
          placeholder="Enter Which Child"
          required
          maxLength={200}
        />
        {errors.which_child && <p className="mt-1 text-sm text-red-500">{errors.which_child}</p>}
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Date of Birth <span className="text-red-500">*</span>
        </Label>
        <DatePicker
          value={data.date_of_birth ? new Date(data.date_of_birth) : undefined}
          onChange={(date) => handleInputChange('date_of_birth', date ? date.toISOString().split('T')[0] : null)}
        />

        {errors.date_of_birth && <p className="mt-1 text-sm text-red-500">{errors.date_of_birth}</p>}
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Baby Condition <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Select
            value={data.baby_condition !== null ? String(data.baby_condition) : undefined}
            onValueChange={(value) => handleInputChange("baby_condition", Number(value))}
            required
          >
            <SelectTrigger
              id="baby-condition-select"
              className={`w-full cursor-pointer ${identityErrorClassName("baby_condition")}`}
            >
              <SelectValue placeholder="Select Baby Condition" />
            </SelectTrigger>

            <SelectContent>
              {baby_conditions?.map((item) => (
                <SelectItem className="cursor-pointer" key={item.value} value={String(item.value)}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
        </div>
        {errors.baby_condition && <p className="mt-1 text-sm text-red-500">{errors.baby_condition}</p>}
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Baby Type of Delivery <span className="text-red-500">*</span>
        </Label>

        <div className="relative">
          <Select
            value={String(data.typeof_delivery)}
            onValueChange={(value) => handleInputChange("typeof_delivery", Number(value))}
            required
          >
            <SelectTrigger
              id="typeof-delivery-select"
              className={`w-full cursor-pointer ${identityErrorClassName("typeof_delivery")}`}
            >
              <SelectValue placeholder="Select Type of Delivery" />
            </SelectTrigger>

            <SelectContent>
              {baby_typeof_deliveries &&
                baby_typeof_deliveries.map((d) => (
                  <SelectItem
                    className="cursor-pointer"
                    key={d.value}
                    value={String(d.value)}
                  >
                    {d.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
        </div>

        {errors.typeof_delivery && (
          <p className="mt-1 text-sm text-red-500">{errors.typeof_delivery}</p>
        )}
      </div>


      <div>
        <Label className="mb-2 block text-sm font-medium">
          Gender <span className="text-red-500">*</span>
        </Label>

        <div className="relative">
          <RadioGroup
            value={data.gender}
            onValueChange={(value) => handleInputChange('gender', value)}
            className={`flex ${identityErrorClassName("typeof_delivery")}`}
          >
            <div className={`flex items-center gap-3`}>
              <RadioGroupItem value="male" className="cursor-pointer" id="r1" />
              <Label htmlFor="r1" className="cursor-pointer">Male</Label>
            </div>

            <div className="flex items-center gap-3">
              <RadioGroupItem value="female" className="cursor-pointer" id="r2" />
              <Label htmlFor="r2" className="cursor-pointer">Female</Label>
            </div>
          </RadioGroup>
        </div>

        {errors.gender && (
          <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
        )}
      </div>


      <div className="flex justify-end">
        <BabyActionForm process={process} action={action} />
      </div>
    </div>
  )
}