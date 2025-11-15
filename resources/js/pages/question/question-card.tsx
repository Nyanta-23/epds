import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptionQuestion, Question } from "@/types/resource";
import FormDialog from "@/components/form-dialog";
import { DialogClose } from "@/components/ui/dialog";
import QuestionEdit from "./action/question-edit";
import { useQuestionAction } from "@/hooks/use-question-action";
import QuestionOptionCard from "../question-option/question-option-card";

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({
  question,
}: QuestionCardProps) {


  return (
    <section className="w-full flex justify-center">

      <div className="w-[80%] border border-border rounded-l-lg p-8 bg-card text-card-foreground shadow-sm">

        <div className="flex items-center gap-5 mb-6">
          <h2 className="text-3xl font-semibold">{question.number_question}</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">{question.question}</p>
        </div>

        <div className="flex justify-between px-1 pb-2 border-b border-border text-sm font-medium text-muted-foreground">
          <span>Option</span>
          <div className="flex items-center gap-10">
            <span className="text-center w-10">Value</span>
            <span className="text-right w-12">Action</span>
          </div>
        </div>

        <div className="mt-4 space-y-3">

          {question.options.map((opt) => (
            <QuestionOptionCard key={opt.id} question_id={question.id} question_option={opt} />
          ))}

        </div>
      </div>

      <div className="w-[10%] border border-border rounded-r-lg overflow-hidden border-l-0 flex flex-col justify-center items-center p-0">
        <QuestionEdit question={question} />
      </div>

    </section>
  );
}
