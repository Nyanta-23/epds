import MainHeader from '@/components/main/main-header';
import AppLayout from '@/layouts/app-layout';
import { Extra, PageProp, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type User } from '@/types/resource';
import { UserData } from '@/types/data';
import UserMainContent from './user/user-main-content';

interface UserProps {
    users: UserData;
    extra: Extra;
    page_prop: PageProp;
}

export default function User({ users, extra, page_prop }: UserProps) {

    const title: string = 'User';
    const link: string = '/user';

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
                <UserMainContent user={users} page_prop={page_prop} extra={extra} />

            </section>
        </AppLayout>
    );
}
