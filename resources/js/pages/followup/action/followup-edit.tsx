import { Result } from "@/types/resource";
import FollowupFormInformation from "../form/followup-form-information";
import { useFollowUpAction } from "@/hooks/use-followup-action";
import { Enums } from "@/types";

interface FollowUpEditProps {
  result: Result | undefined;
  enums: Enums;
  onSuccess: () => void;
}

export default function FollowUpEdit({ result, enums, onSuccess }: FollowUpEditProps) {

  const {
    data,
    errors,
    handleInputChange,
    updateFollowUp,
    processing
  } = useFollowUpAction(result, onSuccess);


  return (
    <section className="mx-5">
      <FollowupFormInformation processing={processing} action={() => updateFollowUp(result?.follow_up.id)} data={data} errors={errors} handleInputChange={handleInputChange} enums={enums} />
    </section>
  );
}