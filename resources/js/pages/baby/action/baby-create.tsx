import MainFormHeader from "@/components/main/main-form-header";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Extra, PageProp } from "@/types";
import { Head } from "@inertiajs/react";
import BabyFormCreate from "../form/baby-form-create";

interface BabyCreateProps {
  extra: Extra;
  page_prop: PageProp;
}

export default function BabyCreate({ extra, page_prop }: BabyCreateProps) {

  const title: string = 'Baby';
  const link: string = '/baby';

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
        <BabyFormCreate extra={extra} page_prop={page_prop}/>
      </section>
    </AppLayout>
  );
}