import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormRecomendationRule} from "@/types/form";
import { Textarea } from "@/components/ui/textarea";
import RecomendationRuleFormAction from "./recomendation-rule-form-action";

type Errors = Partial<Record<keyof FormRecomendationRule, string>>;


interface RecomendationRuleFormInformationProps {
  data: FormRecomendationRule;
  errors: Errors;
  process: boolean;
  handleInputChange: (field: keyof FormRecomendationRule, value: string | number | null) => void;
  action: () => void;
  withoutAuth?: boolean;
}

export default function RecomendationRuleFormInformation({ data, errors, process, handleInputChange, action }: RecomendationRuleFormInformationProps) {

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
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          placeholder="Enter Description"
          value={data.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={identityErrorClassName('description')} />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>



      <div className="flex justify-end">
        <RecomendationRuleFormAction process={process} action={action} />
      </div>
    </div>
  )
}