import FormDialog from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useOptionQuestion } from "@/hooks/use-option-question-action";
import { OptionQuestion } from "@/types/resource";
import { DialogClose } from "@radix-ui/react-dialog";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import QuestionOptionFormInformation from "../form/question-option-form-information";

interface QuestionOptionEdit {
  question_id: string;
  option_question: OptionQuestion;
}

export default function QuestionOptionEdit({ option_question, question_id }: QuestionOptionEdit) {


  const [open, setOpen] = useState(false);


  const {
    data,
    errors,
    processing,
    handleInputChange,
    updateOptionQuestion
  } = useOptionQuestion(option_question);


  useEffect(() => {
    if (!processing) {
      setOpen(false);
    }
  }, [processing]);

  return (
    <FormDialog
      trigger={
        <Button
          size="icon"
          variant="secondary"
          className="cursor-pointer"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      }
      title="Edit Question"
      description="Changing question."
      open={open}
      onOpenChange={setOpen}
      footer={
        <>
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">Cancel</Button>
          </DialogClose>

          {processing ? (
            <Button variant="ghost"><Spinner /></Button>
          ) : (
            <Button
              onClick={() => updateOptionQuestion(option_question.id, question_id)}
              className="cursor-pointer"
            >
              Save
            </Button>
          )}
        </>
      }
    >
      <QuestionOptionFormInformation data={data} errors={errors} handleInputChange={handleInputChange} />
    </FormDialog>
  )
}