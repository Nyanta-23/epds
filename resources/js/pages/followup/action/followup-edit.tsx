import { FollowUp } from "@/types/resource";
import FollowupFormInformation from "../form/followup-form-information";
import { useFollowUpAction } from "@/hooks/use-followup-action";
import { Enums } from "@/types";

interface FollowUpEditProps {
  follow_up: FollowUp | undefined;
  enums: Enums;
}

export default function FollowUpEdit({ follow_up, enums }: FollowUpEditProps) {

  const {
    data,
    errors,
    handleInputChange,
    updateFollowUp,
    processing
  } = useFollowUpAction(follow_up);


  return (
    <section className="mx-5">
      <FollowupFormInformation processing={processing} action={() => updateFollowUp(follow_up?.id)} data={data} errors={errors} handleInputChange={handleInputChange} enums={enums} />
    </section>
  );
}