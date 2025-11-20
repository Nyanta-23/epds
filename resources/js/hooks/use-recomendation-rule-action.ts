
import { FormRecomendationRule } from "@/types/form";
import { RecomendationRule } from "@/types/resource";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

export function useRecomendationRuleAction(recomendation_rule?: RecomendationRule) {

  const { data, setData, reset, errors, clearErrors, post, put, delete: destory, processing } = useForm<FormRecomendationRule>({
    name: recomendation_rule?.name || '',
    description: recomendation_rule?.description || '',
    min_score: recomendation_rule?.min_score || 0,
    max_score: recomendation_rule?.max_score || 0
  });

  const [processingId, setProcessingId] = useState<string | null>(null);

  const createRecomendationRule = () => {
    post(route('tone.store'), {
      onSuccess: () => reset("name", "description", "min_score", "max_score"),
      onError: (err) => {
        console.log(err);
      }
    });
  };

  const updateRecomendationRule = (id?: string) => {

    if (!id) return;

    put(route('tone.update', id), {
      onSuccess: () => reset("name", "description", "min_score", "max_score"),
      onError: (err) => {
        console.log(err);
      }
    });
  }


  const deleteRecomendationRule = (id: string) => {

    setProcessingId(id);

    destory(route('tone.destroy', id), {
      preserveScroll: true,
      onFinish: () => setProcessingId(null)
    });
  }


  const handleInputChange = (field: keyof FormRecomendationRule, value: string | number | null) => {
    setData((prev: FormRecomendationRule) => {

      const updatingValue = {
        ...prev,
        [field as keyof FormRecomendationRule]: value
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
    processingId,
    deleteRecomendationRule,
    createRecomendationRule,
    updateRecomendationRule,
  }
}

