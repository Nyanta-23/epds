import { Extra, PageProp } from "@/types";
import { BabyData } from "@/types/data";
import MainPagination from "@/components/main/main-pagination";
import BabyAction from "./baby-action";
import BabyTrashAction from "./baby-trash-action";
import BabyTable from "./baby-table";

export interface BabyMainContentProps {
  baby: BabyData;
  // extra: Extra;
  page_prop: PageProp;
}

export default function BabyMainContent({ baby, page_prop }: BabyMainContentProps) {

  const { filter } = page_prop;
  const { meta, data } = baby;


  // const { roles } = extra;
  

  return (
    <>
      <BabyAction filter={filter} meta={meta} />

      <section className="grid auto-rows-min gap-4">
        <section className="w-full">

          <BabyTrashAction link={meta.path} filter={filter} />

          <BabyTable data={data} filter={filter} />

          <MainPagination meta={meta} filter={filter} />

        </section>
      </section>
    </>
  )
}