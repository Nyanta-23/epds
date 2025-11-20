import { PageProp } from "@/types";
import MainPagination from "@/components/main/main-pagination";
import { RecomendationRuleData, RecomendationVariationData } from "@/types/data";
import RecomendationVariationAction from "./recomendation-variation-action";
import RecomendationVariationTrashAction from "./recomendation-variation-trash-action";
import RecomendationVariationTable from "./recomendation-variation-table";


export interface RecomendationVariationMainContentProps {
  recomendation_variation: RecomendationVariationData;
  page_prop: PageProp;
}

export default function RecomendationVariationMainContent({ recomendation_variation, page_prop }: RecomendationVariationMainContentProps) {


  const { filter } = page_prop;
  const { meta, data } = recomendation_variation;


  return (
    <>

      {/* <RecomendationVariationAction filter={filter} meta={meta} /> */}


      <section className="grid auto-rows-min gap-4">
        <section className="w-full">
          {/* <RecomendationVariationTrashAction filter={filter} link={meta.path} /> */}

          <RecomendationVariationTable data={data} filter={filter} />

          <MainPagination meta={meta} filter={filter} />

        </section>
      </section>
    </>
  )
}