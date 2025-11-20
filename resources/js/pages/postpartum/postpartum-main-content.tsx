import { Extra, PageProp } from "@/types";
import { PostpartumVisitData } from "@/types/data";
import MainPagination from "@/components/main/main-pagination";
import PostpartumAction from "./postpartum-action";
import PostpartumTable from "./postpartum-table";
import PostpartumFollowedAction from "./postpartum-followed-action";

export interface PostpartumMainContentProps {
  postpartum: PostpartumVisitData;
  extra: Extra;
  page_prop: PageProp;
}

export default function PostpartumMainContent({ postpartum, extra, page_prop }: PostpartumMainContentProps) {

  const { filter, enums } = page_prop;
  const { meta, data } = postpartum;


  return (
    <>
      <PostpartumAction filter={filter} meta={meta} />

      <section className="grid auto-rows-min gap-4">
        <section className="w-full">
          <PostpartumFollowedAction filter={filter} link={"postpartum"} />
          <PostpartumTable data={data} enums={enums} />

          <MainPagination meta={meta} filter={filter} />
        </section>
      </section>
    </>
  )
}