
import { FormRecomendationRule } from "@/types/form";
import { RecomendationRule } from "@/types/resource";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

export function useRecomendationVariationAction(recomendation_rule?: RecomendationRule) {

  const { data, setData, reset, errors, clearErrors, delete: destory, processing } = useForm<FormRecomendationRule>({
    name: recomendation_rule?.name || '',
    description: recomendation_rule?.description || '',
    min_score: recomendation_rule?.min_score || 0,
    max_score: recomendation_rule?.max_score || 0
  });

  const [processingId, setProcessingId] = useState<string | null>(null);


  const deleteRecomendationVariation = (id: string) => {

    setProcessingId(id);

    destory(route('variation.destroy', id), {
      preserveScroll: true,
      onFinish: () => setProcessingId(null)
    });
  }


  return {
    data,
    setData,
    errors,
    clearErrors,
    reset,
    processing,
    processingId,
    deleteRecomendationVariation,
  }
}

