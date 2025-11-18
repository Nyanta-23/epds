import CardPostpartumAnswer from "@/components/card-postpartum-answer";
import CardPostpartumDetail from "@/components/card-postpartum-detail";
import CardPostpartumDetailBaby from "@/components/card-postpartum-detail-baby";
import CardPostpartumFollowUp from "@/components/card-postpartum-followup";
import CardPostpartumResult from "@/components/card-postpartum-result";
import { PostpartumVisit } from "@/types/resource";


interface PopstpartumDetailProps {
  postpartum: PostpartumVisit;
}

export default function PostpartumDetail({ postpartum }: PopstpartumDetailProps) {

  return (
    <section className="grid gap-10">

      <section className="flex gap-4 w-full">
        <section className="w-2/3 space-y-4">

          <CardPostpartumDetail postpartum={postpartum} />

          <CardPostpartumDetailBaby postpartum={postpartum} />

        </section>

        <section className="w-1/3 space-y-4">

          <CardPostpartumResult />

          <CardPostpartumFollowUp />

        </section>

      </section>

      <section className="w-full space-y-4">
        <CardPostpartumAnswer />
      </section>
    </section>
  );
}