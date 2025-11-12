import MainFormHeader from "@/components/main/main-form-header";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Extra } from "@/types";
import { Head } from "@inertiajs/react";
import UserFormEdit from "../form/user-form-edit";
import { UserSingleData } from "@/types/data";


interface UserEditProps {
  user: UserSingleData;
  extra: Extra;
}

export default function UserEdit({ extra, user }: UserEditProps) {

  const title: string = 'User';
  const link: string = '/user';

  const subtitle = `Edit ${title}`;
  const desc = `Add your ${title}`

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title,
      href: link,
    },
    {
      title: `Edit`,
      href: `${link}/edit`
    }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={title} />

      <section className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <MainFormHeader subtitle={subtitle} desc={desc} />
        <UserFormEdit extra={extra} user={user.data} />
      </section>
    </AppLayout>
  );
}