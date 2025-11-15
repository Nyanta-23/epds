import FormDialog from "@/components/form-dialog";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import QuestionFormInformation from "../form/question-form-information";
import { useQuestionAction } from "@/hooks/use-question-action";
import { Question } from "@/types/resource";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";


interface QuestionEditProps {
  question: Question;
}

export default function QuestionEdit({ question }: QuestionEditProps) {

  const [open, setOpen] = useState(false);

  const {
    data,
    errors,
    handleInputChange,
    updateQuestion,
    processing
  } = useQuestionAction(question);

  useEffect(() => {
    if (!processing) {
      setOpen(false);
    }
  }, [processing]);

  return (
    <FormDialog
      trigger={
        <Button className="w-full h-full cursor-pointer rounded-r" variant="secondary">
          <Pencil className="h-5 w-5" />
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
              onClick={() => updateQuestion(question.id)}
              className="cursor-pointer"
            >
              Save
            </Button>
          )}
        </>
      }
    >
      <QuestionFormInformation
        data={data}
        errors={errors}
        handleInputChange={handleInputChange}
      />
    </FormDialog>
  );
}