import MainHeader from '@/components/main/main-header';
import AppLayout from '@/layouts/app-layout';
import { Extra, PageProp, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { PatientData } from '@/types/data';
import PatientMainContent from './patient/patient-main-content';

interface UserProps {
    patients: PatientData;
    extra: Extra;
    page_prop: PageProp;
}

export default function Patient({ patients, extra, page_prop }: UserProps) {

    const title: string = 'Patient';
    const link: string = '/patient';

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
                <PatientMainContent patient={patients} page_prop={page_prop} extra={extra} />

            </section>
        </AppLayout>
    );
}
