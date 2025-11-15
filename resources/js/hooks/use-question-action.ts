import { FormQuestion } from "@/types/form";
import { Question } from "@/types/resource";
import { useForm } from "@inertiajs/react";

export function useQuestionAction(question?: Question) {

  const { data, setData, reset, errors, clearErrors, put, processing } = useForm<FormQuestion>({
    number_question: question?.number_question || '',
    question: question?.question || ''
  });


  const updateQuestion = (id?: string) => {

    if (!id) return;

    put(route('question.update', id), {
      onSuccess: () => reset("number_question", "question"),
      onError: (err) => {
        console.log(err);
      }
    });
  }

  const handleInputChange = (field: keyof FormQuestion, value: string | number | null) => {
    setData((prev: FormQuestion) => {

      const updatingValue = {
        ...prev,
        [field as keyof FormQuestion]: value
      };

      Object.entries(updatingValue)
        .forEach(([key, val]) => {
          if (val && val.toString().length > 0) clearErrors(key);
        });

      return updatingValue;
    });
  }

  return {
    data,
    setData,
    errors,
    clearErrors,
    reset,
    handleInputChange,
    processing,
    updateQuestion,
  }
}

