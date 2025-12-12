import CardPostpartumAnswer from '@/components/card-postpartum-answer';
import CardPostpartumDetail from '@/components/card-postpartum-detail';
import CardPostpartumDetailBaby from '@/components/card-postpartum-detail-baby';
import CardPostpartumFollowUp from '@/components/card-postpartum-followup';
import CardPostpartumResult from '@/components/card-postpartum-result';
import { PageProp } from '@/types';
import { Baby, PostpartumVisit } from '@/types/resource';

interface PopstpartumDetailProps {
    postpartum: PostpartumVisit;
    page_prop: PageProp;
    baby: Baby
}

export default function PostpartumDetail({
    postpartum,
    page_prop,
    baby
}: PopstpartumDetailProps) {
    return (
        <section className="space-y-8 p-4 md:p-6">
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <CardPostpartumDetail baby={baby} postpartum={postpartum} />
                    <CardPostpartumDetailBaby baby={baby} postpartum={postpartum} />
                </div>

                <div className="sticky top-4 space-y-6 lg:col-span-1">
                    <CardPostpartumResult postpartum={postpartum} />

                    <CardPostpartumFollowUp
                        enums={page_prop.enums}
                        postpartum={postpartum}
                    />
                </div>
            </div>
            <div className="w-full">
                <CardPostpartumAnswer postpartum={postpartum} />
            </div>
        </section>
    );
}
