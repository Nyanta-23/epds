import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormPatient } from "@/types/form";
import { ChevronDown } from "lucide-react";
import PatientActionForm from "./patient-action-form";
import { DatePicker } from "@/components/utils/date-picker";
import { SelectMarriedStatusInput } from "@/components/utils/select-married-status-input";
import { SelectHighestEducationInput } from "@/components/utils/select-highest-education-input";
import SelectLocationApi from "@/components/utils/select-location-api";
import { Textarea } from "@/components/ui/textarea";

type Errors = Partial<Record<keyof FormPatient, string>>;


interface PatientFormInformationProps {
  data: FormPatient;
  errors: Errors;
  process: boolean;
  handleInputChange: (field: keyof FormPatient, value: string | number | null) => void;
  action: () => void;
}

export default function PatientFormInformation({ data, errors, process, handleInputChange, action }: PatientFormInformationProps) {

  const identityErrorClassName = (field: keyof Errors) => {
    return errors[field] ? 'border-red-500 focus:ring-red-500' : '';
  }


  return (
    <div className="space-y-4 p-6">

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Name <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          value={data.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={identityErrorClassName('name')}
          placeholder="Enter Full Name"
          required
          maxLength={200}
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          value={data.phone_number}
          onChange={(e) => handleInputChange('phone_number', e.target.value)}
          className={identityErrorClassName('phone_number')}
          placeholder="Enter Phone Number"
          required
          maxLength={200}
        />
        {errors.phone_number && <p className="mt-1 text-sm text-red-500">{errors.phone_number}</p>}
      </div>

      <div className="flex gap-2">

        <div className="w-[60%]">
          <Label className="mb-2 block text-sm font-medium">
            Birthplace <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            value={data.birthplace}
            onChange={(e) => handleInputChange('birthplace', e.target.value)}
            className={identityErrorClassName('birthplace')}
            placeholder="Birthplace"
            required
            maxLength={200}
          />
          {errors.birthplace && <p className="mt-1 text-sm text-red-500">{errors.birthplace}</p>}
        </div>

        <div className="w-[40%]">
          <Label className="mb-2 block text-sm font-medium">
            Date of Birth <span className="text-red-500">*</span>
          </Label>
          <DatePicker
            value={data.date_of_birth ? new Date(data.date_of_birth) : undefined}
            onChange={(date) => handleInputChange('date_of_birth', date ? date.toISOString().split('T')[0] : null)}
          />

          {errors.date_of_birth && <p className="mt-1 text-sm text-red-500">{errors.date_of_birth}</p>}
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Job <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          value={data.job}
          onChange={(e) => handleInputChange('job', e.target.value)}
          className={identityErrorClassName('job')}
          placeholder="Enter your Job"
          required
          maxLength={200}
        />
        {errors.job && <p className="mt-1 text-sm text-red-500">{errors.job}</p>}
      </div>

      <div className="flex gap-5">

        <div className="w-[50%]">
          <Label className="mb-2 block text-sm font-medium">
            Married Status <span className="text-red-500">*</span>
          </Label>
          <SelectMarriedStatusInput
            value={data.married_status}
            onChange={(val) => handleInputChange('married_status', val)}
            className={identityErrorClassName('married_status')}
          />
          {errors.married_status && <p className="mt-1 text-sm text-red-500">{errors.married_status}</p>}
        </div>

        <div className="w-[50%]">
          <Label className="mb-2 block text-sm font-medium">
            Highest Education <span className="text-red-500">*</span>
          </Label>
          <SelectHighestEducationInput
            value={data.highest_education}
            onChange={(val) => handleInputChange('highest_education', val)}
            className={identityErrorClassName('highest_education')}
          />
          {errors.highest_education && <p className="mt-1 text-sm text-red-500">{errors.highest_education}</p>}
        </div>


      </div>

      <div>
        <SelectLocationApi
          value={{
            province: data.province,
            province_id: data.province_id,
            city_or_district: data.city_or_district,
            city_or_district_id: data.city_or_district_id,
            subdistrict: data.subdistrict,
            subdistrict_id: data.subdistrict_id,
            village: data.village,
            village_id: data.village_id,
          }}
          onChange={(val) => {
            handleInputChange("province", val.province)
            handleInputChange("province_id" as any, val.province_id || "")
            handleInputChange("city_or_district", val.city_or_district)
            handleInputChange("city_or_district_id" as any, val.city_or_district_id || "")
            handleInputChange("subdistrict", val.subdistrict)
            handleInputChange("subdistrict_id" as any, val.subdistrict_id || "")
            handleInputChange("village", val.village)
            handleInputChange("village_id" as any, val.village_id || "")
          }}
          errors={errors}
          identityErrorClassName={identityErrorClassName}
        />
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Address <span className="text-red-500">*</span>
        </Label>
        <Textarea placeholder="Address"
          value={data.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className={identityErrorClassName('address')}
        />
        {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
      </div>


      <div className="flex justify-end">
        <PatientActionForm process={process} action={action} />
      </div>
    </div>
  )
}