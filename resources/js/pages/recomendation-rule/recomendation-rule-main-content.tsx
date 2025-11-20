import { PageProp } from "@/types";
import MainPagination from "@/components/main/main-pagination";
import { RecomendationRuleData } from "@/types/data";
import RecomendationRuleAction from "./recomendation-rule-action";
import RecomendationRuleTrashAction from "./recomendation-rule-trash-action";
import RecomendationRuleTable from "./recomendation-rule-table";


export interface RecomendationRuleMainContentProps {
  recomendation_rule: RecomendationRuleData;
  page_prop: PageProp;
}

export default function RecomendationRuleMainContent({ recomendation_rule, page_prop }: RecomendationRuleMainContentProps) {


  const { filter } = page_prop;
  const { meta, data } = recomendation_rule;  


  return (
    <>
      <RecomendationRuleAction filter={filter} meta={meta} />

      <section className="grid auto-rows-min gap-4">
        <section className="w-full">

          {/* <RecomendationRuleTrashAction filter={filter} link={meta.path} /> */}

          <RecomendationRuleTable data={data} filter={filter} />

          <MainPagination meta={meta} filter={filter} />

        </section>
      </section>
    </>
  )
}