import { FormBaby } from "@/types/form";
import { Baby } from "@/types/resource";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

export function useBabyAction(baby?: Baby) {

  const { data, setData, reset, errors, clearErrors, post, put, delete: destory, processing } = useForm<FormBaby>({
    which_child: baby?.which_child || 0,
    date_of_birth: baby?.date_of_birth || '',
    baby_condition: baby?.baby_condition || '',
    typeof_delivery: baby?.typeof_delivery || '',
    gender: baby?.gender || 'male',
    mother_id: baby?.mother.id || ''
  });

  const [processingId, setProcessingId] = useState<string | null>(null);

  const createBaby = () => {
    post(route('baby.store'), {
      onSuccess: () => reset("which_child", "date_of_birth", "baby_condition", "typeof_delivery", "gender", "mother_id"),
      onError: (err) => {
        console.log(err);
      }
    });
  };

  const updateBaby = (id?: string) => {

    if (!id) return;

    put(route('baby.update', id), {
      onSuccess: () => reset("which_child", "date_of_birth", "baby_condition", "typeof_delivery", "gender", "mother_id"),
      onError: (err) => {
        console.log(err);
      }
    });
  }


  const deleteBaby = (id: string) => {

    setProcessingId(id);

    destory(route('baby.destroy', id), {
      preserveScroll: true,
      onFinish: () => setProcessingId(null)
    });
  }


  const handleInputChange = (field: keyof FormBaby, value: string | number | null) => {
    setData((prev: FormBaby) => {

      const updatingValue = {
        ...prev,
        [field as keyof FormBaby]: value
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
    deleteBaby,
    createBaby,
    updateBaby
  }
}

