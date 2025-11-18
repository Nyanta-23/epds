import { FormOptionQuestion } from "@/types/form";
import { OptionQuestion } from "@/types/resource";
import { useForm } from "@inertiajs/react";

export function useOptionQuestion(question_option?: OptionQuestion) {

  const { data, setData, reset, errors, clearErrors, put, processing } = useForm<FormOptionQuestion>({
    option: question_option?.option || "",
    option_text: question_option?.option_text || "",
    value: question_option?.value || 0
  });


  const updateOptionQuestion = (id?: string) => {

    if (!id) return;

    put(route('question.option.update', id), {
      onSuccess: () => reset("option_text", 'value'),
      onError: (err) => {
        console.log(err);
      }
    });
  }

  const handleInputChange = (field: keyof FormOptionQuestion, value: string | number | null) => {
    setData((prev: FormOptionQuestion) => {

      const updatingValue = {
        ...prev,
        [field as keyof FormOptionQuestion]: value
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
    updateOptionQuestion,
  }
}

