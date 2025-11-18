import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormQuestion } from "@/types/form";

type Errors = Partial<Record<keyof FormQuestion, string>>;

interface QuestionFormInformationProps {
  data: FormQuestion;
  errors: Errors;
  handleInputChange: (field: keyof FormQuestion, value: string | number | null) => void;
}

export default function QuestionFormInformation({
  data,
  errors,
  handleInputChange
}: QuestionFormInformationProps) {

  const identityErrorClassName = (field: keyof Errors) => {
    return errors[field] ? 'border-red-500 focus:ring-red-500' : '';
  }


  return (
    <section className="grid gap-4">
      <div className="grid gap-3">
        <Label className="mb-2 block text-sm font-medium">
          Question <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          value={data.question}
          onChange={(e) => handleInputChange('question', e.target.value)}
          className={identityErrorClassName('question')}
          placeholder="Enter Question"
          required
          maxLength={200}
        />
        {errors.question && <p className="mt-1 text-sm text-red-500">{errors.question}</p>}
      </div>
    </section>
  );
}