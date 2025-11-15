import { Button } from "@/components/ui/button";
import { OptionQuestion } from "@/types/resource";
import { Pencil } from "lucide-react";
import QuestionOptionEdit from "./action/question-option-edit";

interface QuestionOptionCardProps {
  question_id: string;
  question_option: OptionQuestion;
}

export default function QuestionOptionCard({
  question_option,
  question_id
}: QuestionOptionCardProps) {


  return (
    <section
      className="flex justify-between items-center py-3 border-b border-border/40"
    >
      <p className="flex items-center gap-4 text-base">
        <span className="text-xl font-semibold">{question_option.option}</span>
        <span className="text-muted-foreground">{question_option.option_text}</span>
      </p>

      <div className="flex items-center gap-10">

        <p className="text-center font-semibold text-lg w-10">
          {question_option.value}
        </p>

        <QuestionOptionEdit question_id={question_id} option_question={question_option} />

      </div>
    </section>
  );
}