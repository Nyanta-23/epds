import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Enums } from "@/types";
import { FormFollowUp } from "@/types/form";
import { ChevronDown } from "lucide-react";
import FollowUpActionForm from "../action/followup-action-form";
import { Spinner } from "@/components/ui/spinner";

type Errors = Partial<Record<keyof FormFollowUp, string>>;

interface FollowUpFormInformationProps {
  data: FormFollowUp;
  errors: Errors;
  handleInputChange: (field: keyof FormFollowUp, value: string | number | null) => void;
  enums: Enums;
  action: () => void;
  processing: boolean;
  totalScore?: number;
}

export default function FollowupFormInformation({ data, errors, handleInputChange, enums, action, processing, totalScore }: FollowUpFormInformationProps) {

  const identityErrorClassName = (field: keyof Errors) => {
    return errors[field] ? 'border-red-500 focus:ring-red-500' : '';
  }

  const { followup_types, followup_status } = enums;
  const isReferralDisabled = totalScore !== undefined && totalScore <= 12;


  return (
    <section className="grid gap-4">
      <div className="grid gap-3">
        <Label className="mb-2 block text-sm font-medium">
          Tipe Followup <span className="text-red-500">*</span>
        </Label>

        <div className="relative">
          <Select
            value={data.type !== null ? String(data.type) : undefined}
            onValueChange={(value) => handleInputChange("type", Number(value))}
            required
            disabled={isReferralDisabled}
          >
            <SelectTrigger
              className={`w-full cursor-pointer ${identityErrorClassName("type")}`}
            >
              <SelectValue placeholder="Select Feed Type" />
            </SelectTrigger>

            <SelectContent>
              {followup_types?.map((item) => (
                <SelectItem className="cursor-pointer" key={item.value} value={String(item.value)}>
                  {item.label}
                </SelectItem>
              ))}

            </SelectContent>
          </Select>

          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
        </div>
        {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
      </div>

      <div className="grid gap-3">
        <Label className="mb-2 block text-sm font-medium">
          Follow Up Status <span className="text-red-500">*</span>
        </Label>

        <div className="relative">
          <Select
            value={data.followup_status !== null ? String(data.followup_status) : undefined}
            onValueChange={(value) => handleInputChange("followup_status", Number(value))}
            required
            disabled={isReferralDisabled}
          >
            <SelectTrigger
              className={`w-full cursor-pointer ${identityErrorClassName("followup_status")}`}
            >
              <SelectValue placeholder="Select Feed Type" />
            </SelectTrigger>

            <SelectContent>
              {followup_status
                ?.filter(
                  (item) => Number(item.value) !== 0 && Number(item.value) !== 5,
                )
                .map((item) => (
                  <SelectItem
                    className="cursor-pointer"
                    key={item.value}
                    value={String(item.value)}
                  >
                    {item.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
        </div>
        {errors.followup_status && <p className="mt-1 text-sm text-red-500">{errors.followup_status}</p>}
      </div>

      <div className="grid gap-3">
        <Label className="mb-2 block text-sm font-medium">
          Notes <span className="text-red-500">*</span>
        </Label>
        <Textarea placeholder="Fill the Notes"
          value={data.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          className={identityErrorClassName('notes')}
        />
        {errors.notes && <p className="mt-1 text-sm text-red-500">{errors.notes}</p>}
      </div>



      <div className="flex justify-end mt-5">
        {processing ?
          <Spinner />
          :
          <FollowUpActionForm action={action} />
        }
      </div>

    </section>
  );
}