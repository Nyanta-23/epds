import { RecomendationRule } from "@/types/resource";
import { useRecomendationRuleAction } from "@/hooks/use-recomendation-rule-action";
import RecomendationRuleFormInformation from "./recomendation-rule-form-information";

interface ToneCategoryFormEditProps {
  recomendation_rule: RecomendationRule;
}

export default function ToneCategoryFormEdit({ recomendation_rule }: ToneCategoryFormEditProps) {


  const {
    data,
    errors,
    handleInputChange,
    updateRecomendationRule,
    processing
  } = useRecomendationRuleAction(recomendation_rule);



  return (

    <section className="px-6 py-6">
      <div className="mx-auto">
        <form>
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border">
              <div className="border-b px-6 py-4">
                <h3 className="text-lg font-medium">Edit a Tone Category</h3>
                <p className="mt-1 text-sm">Details about Tone Category</p>
              </div>

              <div className="space-y-4 p-6">
                <RecomendationRuleFormInformation data={data} errors={errors} process={processing} handleInputChange={handleInputChange} action={() => updateRecomendationRule(recomendation_rule.id)} />
              </div>
            </div>


          </div>
        </form>
      </div>
    </section>

  );
}
