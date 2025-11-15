import FormDialog from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useOptionQuestion } from "@/hooks/use-option-question-action";
import { FormOptionQuestion } from "@/types/form";
import { OptionQuestion } from "@/types/resource";
import { DialogClose } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";

type Errors = Partial<Record<keyof FormOptionQuestion, string>>;

interface QuestionOptionFormInformationProps {
  data: FormOptionQuestion;
  errors: Errors;
  handleInputChange: (field: keyof FormOptionQuestion, value: string | number | null) => void;
}

export default function QuestionOptionFormInformation({
  data,
  errors,
  handleInputChange
}: QuestionOptionFormInformationProps) {

  const identityErrorClassName = (field: keyof Errors) => {
    return errors[field] ? 'border-red-500 focus:ring-red-500' : '';
  }


  return (
    <section className="grid gap-4">
      <div className="grid gap-3">
        <Label className="mb-2 block text-sm font-medium">
          Option Question <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          value={data.option_text}
          onChange={(e) => handleInputChange('option_text', e.target.value)}
          className={identityErrorClassName('option_text')}
          placeholder="Enter Option Question"
          required
          maxLength={200}
        />
        {errors.option_text && <p className="mt-1 text-sm text-red-500">{errors.option_text}</p>}
      </div>
      <div className="grid gap-3">
        <Label className="mb-2 block text-sm font-medium">
          Value <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          value={data.value}
          onChange={(e) => handleInputChange('value', e.target.value)}
          className={identityErrorClassName('value')}
          placeholder="Enter Value"
          required
          maxLength={200}
        />
        {errors.value && <p className="mt-1 text-sm text-red-500">{errors.value}</p>}
      </div>
    </section>
  );
}