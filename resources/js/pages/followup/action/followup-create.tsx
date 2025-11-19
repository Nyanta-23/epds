import FollowupFormInformation from "../form/followup-form-information";
import { Enums } from "@/types";
import { useFollowUpAction } from "@/hooks/use-followup-action";
import { Result } from "@/types/resource";

interface FollowUpCreateProps {
  result: Result | undefined;
  enums: Enums;
  onSuccess: () => void;
}

export default function FollowUpCreate({ enums, result, onSuccess }: FollowUpCreateProps) {

  const {
    data,
    errors,
    handleInputChange,
    storeFollowUp,
    processing
  } = useFollowUpAction(result, onSuccess);

  return (
    <section className="px-2">
      <FollowupFormInformation processing={processing} action={() => storeFollowUp()} data={data} errors={errors} handleInputChange={handleInputChange} enums={enums} />
    </section>
  )
}