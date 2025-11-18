import QuestionCard from "./question-card";
import { Question } from "@/types/resource";

export interface QuestionMainContentProps {
  question: Question[];
}

export default function QuestionMainContent({ question }: QuestionMainContentProps) {

  // console.log(question);

  return (
    <section className="grid auto-rows-min gap-4 border rounded">
      <section className="w-full flex flex-col justify-center gap-2 my-5">

        {question.map(quest => (
          <QuestionCard key={quest.id} question={quest} />
        ))}

      </section>
    </section>
  )
}