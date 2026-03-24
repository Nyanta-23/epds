import CardPostpartumAnswer from '@/components/card-postpartum-answer';
import CardPostpartumDetail from '@/components/card-postpartum-detail';
import CardPostpartumDetailBaby from '@/components/card-postpartum-detail-baby';
import CardPostpartumFollowUp from '@/components/card-postpartum-followup';
import CardPostpartumResult from '@/components/card-postpartum-result';
import CardRencanaTindakan from '@/components/card-rencana-tindakan';
import HeaderPostpartumDetail from '@/components/header-postpartum-detail';
import { PageProp } from '@/types';
import { Baby, PostpartumVisit } from '@/types/resource';

interface PopstpartumDetailProps {
    postpartum: PostpartumVisit;
    page_prop: PageProp;
    baby: Baby;
}

export default function PostpartumDetail({
    postpartum,
    page_prop,
    baby,
}: PopstpartumDetailProps) {
    return (
        <section className="space-y-4 p-3 sm:space-y-6 sm:p-4 md:p-6 lg:max-w-7xl lg:mx-auto">
            {/* HEADER - Mobile & Desktop */}
            <HeaderPostpartumDetail postpartum={postpartum} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">

                
                {/* Right Column (2/3) */}
                <div className="lg:col-span-2 order-2 lg:order-none">
                    <CardPostpartumDetail baby={baby} postpartum={postpartum} />
                </div>
                {/* Left Column (1/3) */}
                <div className="flex flex-col gap-6 lg:col-span-1 order-1 lg:order-none">
                    <CardPostpartumResult postpartum={postpartum} />
                    <CardPostpartumFollowUp enums={page_prop.enums} postpartum={postpartum} />
                </div>
            </div>

            <CardRencanaTindakan totalScore={postpartum.result?.total_score} />
            <CardPostpartumDetailBaby baby={baby} postpartum={postpartum} />
            <CardPostpartumAnswer postpartum={postpartum} />
        </section>
    );
}
