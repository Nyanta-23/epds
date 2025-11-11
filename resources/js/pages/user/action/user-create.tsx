import MainFormHeader from "@/components/main/main-form-header";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Extra } from "@/types";
import { Head } from "@inertiajs/react";
import UserFormCreate from "../form/user-form-create";


interface UserCreateProps {
  extra: Extra;
}

export default function UserCreate({ extra }: UserCreateProps) {

  const title: string = 'User';
  const link: string = '/user';

  const subtitle = `Create ${title}`;
  const desc = `Add your ${title}`

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title,
      href: link,
    },
    {
      title: `Create`,
      href: `${link}/create`
    }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={title} />

      <section className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <MainFormHeader subtitle={subtitle} desc={desc} />
        <UserFormCreate extra={extra} />
      </section>
    </AppLayout>
  );
}