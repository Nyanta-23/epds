import { useRecomendationRuleAction } from "@/hooks/use-recomendation-rule-action";
import RecomendationRuleFormInformation from "./recomendation-rule-form-information";



export default function RecomendationRuleFormCreate() {

  const {
    data,
    errors,
    handleInputChange,
    processing,
    createRecomendationRule
  } = useRecomendationRuleAction();

  return (

    <section className="px-6 py-6">
      <div className="mx-auto">
        <form>
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border">
              <div className="border-b px-6 py-4">
                <h3 className="text-lg font-medium">Create a Recomendation Rule</h3>
                <p className="mt-1 text-sm">Details about Recomendation Rule</p>
              </div>

              <div className="space-y-4 p-6">
                <RecomendationRuleFormInformation data={data} errors={errors} process={processing} handleInputChange={handleInputChange} action={() => createRecomendationRule()} />
              </div>
            </div>


          </div>
        </form>
      </div>
    </section>

  );
}
