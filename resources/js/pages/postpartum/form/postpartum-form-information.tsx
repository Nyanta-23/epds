import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormPostpartumVisit } from "@/types/form";
import { ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Enums } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import PostpartumActionForm from "./postpartum-action-form";

type Errors = Partial<Record<keyof FormPostpartumVisit, string>>;


interface PostpartumFormInformationProps {
  data: FormPostpartumVisit;
  enums: Enums;

  errors: Errors;
  process: boolean;
  handleInputChange: (field: keyof FormPostpartumVisit, value: string | number | null) => void;
  action: () => void;

}

export default function PostpartumFormInformation({ data, enums, errors, process, handleInputChange, action }: PostpartumFormInformationProps) {

  const identityErrorClassName = (field: keyof Errors) => {
    return errors[field] ? 'border-red-500 focus:ring-red-500' : '';
  }


  const { baby_caregivers, familiy_economies, feed_types, partner_supports, sleep_qualities } = enums;

  const parities = ['1x', '2x', '3x', '>3x'];


  const [liveWithPartner, setLiveWithPartner] = useState<boolean>(data.live_with_partner);

  return (
    <div className="space-y-4 p-6">

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Visit Number <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          value={data.visit_number}
          onChange={(e) => handleInputChange('visit_number', e.target.value)}
          className={identityErrorClassName('visit_number')}
          placeholder="Enter Visit Number"
          required
          maxLength={200}
        />
        {errors.visit_number && <p className="mt-1 text-sm text-red-500">{errors.visit_number}</p>}
      </div>


      <div className="w-[60%]">
        <Label className="mb-2 block text-sm font-medium">
          Sleep Quality <span className="text-red-500">*</span>
        </Label>

        <div className="relative">
          <Select
            value={data.sleep_quality !== null ? String(data.sleep_quality) : undefined}
            onValueChange={(value) => handleInputChange("sleep_quality", Number(value))}
            required
          >
            <SelectTrigger
              className={`w-full cursor-pointer ${identityErrorClassName("sleep_quality")}`}
            >
              <SelectValue placeholder="Select Sleep Quality" />
            </SelectTrigger>

            <SelectContent>
              {sleep_qualities?.map((item) => (
                <SelectItem className="cursor-pointer" key={item.value} value={String(item.value)}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
        </div>
        {errors.sleep_quality && <p className="mt-1 text-sm text-red-500">{errors.sleep_quality}</p>}
      </div>

      <div className="w-[40%]">
        <Label className="mb-2 block text-sm font-medium">
          Live with Partner <span className="text-red-500">*</span>
        </Label>

      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Partner Support <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Select
            value={data.partner_support !== null ? String(data.partner_support) : undefined}
            onValueChange={(value) => handleInputChange("partner_support", Number(value))}
            required
          >
            <SelectTrigger
              className={`w-full cursor-pointer ${identityErrorClassName("partner_support")}`}
            >
              <SelectValue placeholder="Select Partner Support" />
            </SelectTrigger>

            <SelectContent>
              {partner_supports?.map((item) => (
                <SelectItem className="cursor-pointer" key={item.value} value={String(item.value)}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
        </div>
        {errors.partner_support && <p className="mt-1 text-sm text-red-500">{errors.partner_support}</p>}
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Family Economy Status <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Select
            value={data.family_economy !== null ? String(data.family_economy) : undefined}
            onValueChange={(value) => handleInputChange("familiy_economy", Number(value))}
            required
          >
            <SelectTrigger
              className={`w-full cursor-pointer ${identityErrorClassName("familiy_economy")}`}
            >
              <SelectValue placeholder="Select Family Economy Status" />
            </SelectTrigger>

            <SelectContent>
              {familiy_economies?.map((item) => (
                <SelectItem className="cursor-pointer" key={item.value} value={String(item.value)}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
        </div>
        {errors.familiy_economy && <p className="mt-1 text-sm text-red-500">{errors.familiy_economy}</p>}
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Mental Health History <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <RadioGroup
            value={data.psych_history ? 'true' : 'false'}
            onValueChange={(value) => handleInputChange('psych_history', value == 'true')}
            className={`flex ${identityErrorClassName("psych_history")}`}
          >

            <div className={`flex items-center gap-3`}>
              <RadioGroupItem value="true" className="cursor-pointer" id="r1" />
              <Label htmlFor="r1" className="cursor-pointer">Yes</Label>
            </div>

            <div className="flex items-center gap-3">
              <RadioGroupItem value="false" className="cursor-pointer" id="r2" />
              <Label htmlFor="r2" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        {errors.psych_history && (
          <p className="mt-1 text-sm text-red-500">{errors.psych_history}</p>
        )}
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Past Treatment <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <RadioGroup
            value={data.psych_trauma ? 'true' : 'false'}
            onValueChange={(value) => handleInputChange('psych_trauma', value == 'true')}
            className={`flex ${identityErrorClassName("psych_trauma")}`}
          >

            <div className={`flex items-center gap-3`}>
              <RadioGroupItem value="true" className="cursor-pointer" id="r1" />
              <Label htmlFor="r1" className="cursor-pointer">Yes</Label>
            </div>

            <div className="flex items-center gap-3">
              <RadioGroupItem value="false" className="cursor-pointer" id="r2" />
              <Label htmlFor="r2" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        {errors.pscyh_treatment && (
          <p className="mt-1 text-sm text-red-500">{errors.pscyh_treatment}</p>
        )}
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Trauma History <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <RadioGroup
            value={data.psych_trauma ? 'true' : 'false'}
            onValueChange={(value) => handleInputChange('psych_trauma', value == 'true')}
            className={`flex ${identityErrorClassName("psych_trauma")}`}
          >

            <div className={`flex items-center gap-3`}>
              <RadioGroupItem value="true" className="cursor-pointer" id="r1" />
              <Label htmlFor="r1" className="cursor-pointer">Yes</Label>
            </div>

            <div className="flex items-center gap-3">
              <RadioGroupItem value="false" className="cursor-pointer" id="r2" />
              <Label htmlFor="r2" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>
        {errors.psych_trauma && (
          <p className="mt-1 text-sm text-red-500">{errors.psych_trauma}</p>
        )}
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Parity <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Select
            value={data.parity_count}
            onValueChange={(value) => handleInputChange("parity_count", value)}
            required
          >
            <SelectTrigger
              className={`w-full cursor-pointer ${identityErrorClassName("parity_count")}`}
            >
              <SelectValue placeholder="Select Feed Type" />
            </SelectTrigger>


            <SelectContent>
              {parities.map((item, index) => (
                <SelectItem className="cursor-pointer" key={index} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>

          </Select>

          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
        </div>
        {errors.feed_type && <p className="mt-1 text-sm text-red-500">{errors.feed_type}</p>}
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Pregnancy Complication History <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <RadioGroup
            value={data.preg_comp_history ? 'true' : 'false'}
            onValueChange={(value) => handleInputChange('preg_comp_history', value == 'true')}
            className={`flex ${identityErrorClassName("preg_comp_history")}`}
          >

            <div className={`flex items-center gap-3`}>
              <RadioGroupItem value="true" className="cursor-pointer" id="r1" />
              <Label htmlFor="r1" className="cursor-pointer">Yes</Label>
            </div>

            <div className="flex items-center gap-3">
              <RadioGroupItem value="false" className="cursor-pointer" id="r2" />
              <Label htmlFor="r2" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        {errors.preg_comp_history && (
          <p className="mt-1 text-sm text-red-500">{errors.preg_comp_history}</p>
        )}
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Last Delivery Complication <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <RadioGroup
            value={data.last_comp ? 'true' : 'false'}
            onValueChange={(value) => handleInputChange('last_comp', value == 'true')}
            className={`flex ${identityErrorClassName("last_comp")}`}
          >

            <div className={`flex items-center gap-3`}>
              <RadioGroupItem value="true" className="cursor-pointer" id="r1" />
              <Label htmlFor="r1" className="cursor-pointer">Yes</Label>
            </div>

            <div className="flex items-center gap-3">
              <RadioGroupItem value="false" className="cursor-pointer" id="r2" />
              <Label htmlFor="r2" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        {data.last_comp === true && (
          <div className="mt-3">

            <Textarea
              value={data.last_comp_desc || ""}
              onChange={(e) => handleInputChange('last_comp_desc', e.target.value)}
              placeholder="Describe the complication"
            />

            {errors.last_comp_desc && (
              <p className="mt-1 text-sm text-red-500">{errors.last_comp_desc}</p>
            )}
          </div>
        )}

        {errors.last_comp && (
          <p className="mt-1 text-sm text-red-500">{errors.last_comp}</p>
        )}
      </div>



      <div>
        <Label className="mb-2 block text-sm font-medium">
          Baby Healthy <span className="text-red-500">*</span>
        </Label>

        <div className="relative">
          <RadioGroup
            value={data.baby_healthy ? 'true' : 'false'}
            onValueChange={(value) => handleInputChange('BAB.baby_healthy', value == 'true')}
            className={`flex ${identityErrorClassName("BAB.baby_healthy")}`}
          >

            <div className={`flex items-center gap-3`}>
              <RadioGroupItem value="true" className="cursor-pointer" id="r1" />
              <Label htmlFor="r1" className="cursor-pointer">Yes</Label>
            </div>

            <div className="flex items-center gap-3">
              <RadioGroupItem value="false" className="cursor-pointer" id="r2" />
              <Label htmlFor="r2" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        {errors.baby_healthy && (
          <p className="mt-1 text-sm text-red-500">{errors.baby_healthy}</p>
        )}

      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Baby Caregiver <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Select
            value={data.baby_caregiver !== null ? String(data.baby_caregiver) : undefined}
            onValueChange={(value) => handleInputChange("baby_caregiver", Number(value))}
            required
          >
            <SelectTrigger
              className={`w-full cursor-pointer ${identityErrorClassName("baby_caregiver")}`}
            >
              <SelectValue placeholder="Select Partner Support" />
            </SelectTrigger>

            <SelectContent>
              {baby_caregivers?.map((item) => (
                <SelectItem className="cursor-pointer" key={item.value} value={String(item.value)}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
        </div>
        {errors.partner_support && <p className="mt-1 text-sm text-red-500">{errors.partner_support}</p>}
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Feeding type <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Select
            value={data.feed_type !== null ? String(data.feed_type) : undefined}
            onValueChange={(value) => handleInputChange("feed_type", Number(value))}
            required
          >
            <SelectTrigger
              className={`w-full cursor-pointer ${identityErrorClassName("feed_type")}`}
            >
              <SelectValue placeholder="Select Feed Type" />
            </SelectTrigger>

            <SelectContent>
              {feed_types?.map((item) => (
                <SelectItem className="cursor-pointer" key={item.value} value={String(item.value)}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
        </div>
        {errors.feed_type && <p className="mt-1 text-sm text-red-500">{errors.feed_type}</p>}
      </div>


      <div className="flex justify-end">
        <PostpartumActionForm process={process} action={action} />
      </div>
    </div>
  )
}