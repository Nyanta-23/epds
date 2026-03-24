import FollowupFormInformation from "../form/followup-form-information";
import { Enums } from "@/types";
import { useFollowUpAction } from "@/hooks/use-followup-action";
import { PostpartumVisit, Result } from "@/types/resource";
import { usePage } from "@inertiajs/react";

interface FollowUpCreateProps {
  result: PostpartumVisit | undefined;
  enums: Enums;
  onSuccess: () => void;
  initialType?: number | null;
  initialStatus?: number | null;
}

export default function FollowUpCreate({ enums, result, onSuccess, initialType, initialStatus }: FollowUpCreateProps) {
  const { ziggy } = usePage().props;

    const id = route().params.postpartum;

  const {
    data,
    errors,
    handleInputChange,
    storeFollowUp,
    processing
  } = useFollowUpAction(result, onSuccess, initialType, initialStatus);

  return (
    <section className="px-2">
      <FollowupFormInformation processing={processing} action={() => storeFollowUp(id)} data={data} errors={errors} handleInputChange={handleInputChange} enums={enums} />
    </section>
  )
}