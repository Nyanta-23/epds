import MainHeader from "@/components/main/main-header";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Extra, PageProp } from "@/types";
import { PostpartumVisitData } from "@/types/data";
import { Head } from "@inertiajs/react";
import PostpartumMainContent from "./postpartum/postpartum-main-content";


interface PostpartumProps {
    postpartums: PostpartumVisitData;
    extra: Extra;
    page_prop: PageProp;
}

export default function Postpartum({ postpartums, extra, page_prop }: PostpartumProps) {

    const title: string = 'Postpartum';
    const link: string = '/postpartum';

    const subtitle = `${title} Management`;
    const desc = `Manage your ${title}`;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title,
            href: link,
        },
    ];

    console.log(postpartums);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />

            <section className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                <MainHeader subtitle={subtitle} desc={desc} />
                <PostpartumMainContent postpartum={postpartums} extra={extra} page_prop={page_prop} />
            </section>
        </AppLayout>
    );
}