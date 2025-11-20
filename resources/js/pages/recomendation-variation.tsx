import MainHeader from '@/components/main/main-header';
import AppLayout from '@/layouts/app-layout';
import { PageProp, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { RecomendationVariationData } from '@/types/data';
import RecomendationVariationMainContent from './recomendation-variation/recomendation-variation-main-content';

interface RecomendationVariationProps {
    recomendation_variations: RecomendationVariationData;
    page_prop: PageProp;
}

export default function RecomendationVariation({ recomendation_variations, page_prop }: RecomendationVariationProps) {

    const title: string = 'Recomendation Variation';
    const link: string = '/recomendation/variation';

    const subtitle = `${title} Management`;
    const desc = `Manage your ${title}`;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title,
            href: link,
        },
    ];

    console.log(recomendation_variations);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />

            <section className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                <MainHeader subtitle={subtitle} desc={desc} />

                <RecomendationVariationMainContent recomendation_variation={recomendation_variations} page_prop={page_prop} />  
            </section>
        </AppLayout>
    );
}