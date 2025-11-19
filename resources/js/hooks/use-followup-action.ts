import { FormFollowUp } from "@/types/form";
import { FollowUp } from "@/types/resource";
import { useForm } from "@inertiajs/react";

export function useFollowUpAction(followup?: FollowUp) {

  const { data, setData, reset, errors, clearErrors, put, post, processing } = useForm<FormFollowUp>({
    type: followup?.type.value || 0,
    followup_status: followup?.result?.followup_status.value || 0,
    notes: followup?.notes || '',
    date_filled: followup?.date_filled || '',
  });

  const storeFollowUp = () => {
    post(route('followup.store', {
      onSuccess: () => reset(
        'type',
        'notes',
        'date_filled'
      ),

      onError: (err: Record<string, string[]>) => {
        console.log(err);
      }
    }));
  }


  const updateFollowUp = (id?: string) => {

    if (!id) return;

    put(route('followup.update', id), {
      onSuccess: () => reset(
        'type',
        'notes',
        'date_filled'
      ),

      onError: (err) => {
        console.log(err);
      }
    });
  }

  const handleInputChange = (field: keyof FormFollowUp, value: string | number | null) => {
    setData((prev: FormFollowUp) => {

      const updatingValue = {
        ...prev,
        [field as keyof FormFollowUp]: value
      };

      Object.entries(updatingValue)
        .forEach(([key, val]) => {
          if (val && val.toString().length > 0) clearErrors(key as keyof FormFollowUp);
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
    updateFollowUp,
    storeFollowUp
  }
}

