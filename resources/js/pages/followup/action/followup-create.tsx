import { FollowUp } from "@/types/resource"
import FollowupFormInformation from "../form/followup-form-information";
import { Enums } from "@/types";
import { useFollowUpAction } from "@/hooks/use-followup-action";

interface FollowUpCreateProps {
  follow_up: FollowUp | undefined;
  enums: Enums;
}

export default function FollowUpCreate({ follow_up, enums }: FollowUpCreateProps) {

  const {
    data,
    errors,
    handleInputChange,
    storeFollowUp,
    processing
  } = useFollowUpAction(follow_up);

  return (
    <section className="px-2">
      <FollowupFormInformation processing={processing} action={() => storeFollowUp()} data={data} errors={errors} handleInputChange={handleInputChange} enums={enums} />
    </section>
  )
}