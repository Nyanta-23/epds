import MainHeader from '@/components/main/main-header';
import AppLayout from '@/layouts/app-layout';
import { PageProp, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BabyData } from '@/types/data';
import BabyMainContent from './baby/baby-main-content';

interface BabyProps {
    babies: BabyData;
    // extra: Extra;
    page_prop: PageProp;
}

export default function Baby({ babies, page_prop }: BabyProps) {

    const title: string = 'Baby';
    const link: string = '/baby';

    const subtitle = `${title} Management`;
    const desc = `Manage your ${title}`;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title,
            href: link,
        },
    ];

    console.log(babies);
    

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />

            <section className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                <MainHeader subtitle={subtitle} desc={desc} />
                <BabyMainContent baby={babies} page_prop={page_prop} />
                    
            </section>
        </AppLayout>
    );
}