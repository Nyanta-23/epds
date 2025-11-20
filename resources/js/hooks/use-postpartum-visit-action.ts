import { FormPostpartumVisit } from "@/types/form";
import { PostpartumVisit } from "@/types/resource";
import { useForm } from "@inertiajs/react";

export function usePostpartumVisitAction(postpartum?: PostpartumVisit) {

  const {
    data,
    setData,
    reset,
    errors,
    clearErrors,
    put,
    processing,
  } = useForm<FormPostpartumVisit>({
    visit_number: postpartum?.visit_number || 1,
    date_filled: postpartum?.date_filled || "",
    sleep_quality: postpartum?.sleep_quality.value.toString() || "",
    partner_support: postpartum?.partner_support.value.toString() || "",
    live_with_partner: postpartum?.live_with_partner ?? false,
    family_economy: postpartum?.family_economy.value.toString() || "",
    psych_history: postpartum?.psych_history ?? false,
    psych_treatment: postpartum?.psych_treatment ?? false,
    psych_trauma: postpartum?.psych_trauma ?? false,
    parity_count: postpartum?.parity_count || "",
    preg_comp_history: postpartum?.preg_comp_history ?? false,
    last_comp: postpartum?.last_comp ?? false,
    last_comp_note: postpartum?.last_comp_note || "",
    baby_healthy: postpartum?.baby_healthy ?? false,
    baby_caregiver: postpartum?.baby_caregiver.value.toString() || "",
    feed_type: postpartum?.feed_type.value.toString() || "",
  });


  const updatePostpartumVisit = (id?: string) => {
    if (!id) return;

    put(route('postpartum.update', id), {
      onSuccess: () => reset(
        "visit_number",
        "date_filled",

        "sleep_quality",
        "partner_support",
        "live_with_partner",
        "family_economy",

        "psych_history",
        "psych_treatment",
        "psych_trauma",

        "parity_count",
        "preg_comp_history",

        "last_comp",
        "last_comp_note",

        "baby_healthy",
        "baby_caregiver",

        "feed_type"
      ),
      onError: (err) => {
        console.log(err);
      }
    });
  }


  const handleInputChange = (field: keyof FormPostpartumVisit, value: string | number | boolean | null) => {
    setData((prev: FormPostpartumVisit) => {

      const updatingValue = {
        ...prev,
        [field as keyof FormPostpartumVisit]: value
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
    updatePostpartumVisit,
  }
}

