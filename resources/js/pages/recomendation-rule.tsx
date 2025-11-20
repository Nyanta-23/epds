import MainHeader from '@/components/main/main-header';
import AppLayout from '@/layouts/app-layout';
import { PageProp, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { RecomendationRuleData } from '@/types/data';
import RecomendationRuleMainContent from './recomendation-rule/recomendation-rule-main-content';

interface RecomendationRuleProps {
    recomendation_rules: RecomendationRuleData;
    page_prop: PageProp;
}

export default function RecomendationRule({ recomendation_rules, page_prop }: RecomendationRuleProps) {

    const title: string = 'Recomendation Rule';
    const link: string = '/recomendation/rule';

    const subtitle = `${title} Management`;
    const desc = `Manage your ${title}`;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title,
            href: link,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />

            <section className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                <MainHeader subtitle={subtitle} desc={desc} />

                <RecomendationRuleMainContent recomendation_rule={recomendation_rules} page_prop={page_prop} />

            </section>
        </AppLayout>
    );
}