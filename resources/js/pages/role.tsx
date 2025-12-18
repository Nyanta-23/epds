import MainHeader from '@/components/main/main-header';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type User } from '@/types/resource';
import { RoleData } from '@/types/data';
import RoleMainContent from './role/role-main-content';

interface RoleProps {
  roles: RoleData;
}

export default function Role({ roles }: RoleProps) {

  const title: string = 'Role';
  const link: string = '/role';

  const subtitle = `Manajemen Peran`;
  const desc = `Atur ${title}`;

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
        {/* <UserMainContent user={users} page_prop={page_prop} extra={extra} /> */}

        <RoleMainContent role={roles} />


      </section>
    </AppLayout>
  );
}