import MainFormHeader from "@/components/main/main-form-header";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Extra, PageProp } from "@/types";
import { Head } from "@inertiajs/react";
import { BabySingleData } from "@/types/data";
import BabyFormEdit from "../form/baby-form-edit";


interface BabyEditProps {
  baby: BabySingleData;
  extra: Extra;
  page_prop: PageProp;
}

export default function BabyEdit({ extra, baby, page_prop }: BabyEditProps) {

  const title: string = 'Baby';
  const link: string = '/baby';

  const subtitle = `Edit ${title}`;
  const desc = `Add your ${title}`;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title,
      href: link,
    },
    {
      title: `Edit`,
      href: `${link}/${baby.data.id}/edit`
    }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={title} />

      <section className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <MainFormHeader subtitle={subtitle} desc={desc} />
        <BabyFormEdit baby={baby.data} page_prop={page_prop} extra={extra} />
      </section>
    </AppLayout>
  );
}