import MainFormHeader from "@/components/main/main-form-header";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { ToneCategorySingleData } from "@/types/data";
import ToneCategoryFormEdit from "../form/tone-category-form-edit";


interface ToneCategoryEditProps {
  tone_category: ToneCategorySingleData;

}

export default function ToneCategoryEdit({ tone_category }: ToneCategoryEditProps) {

  const title: string = 'Tone Category';
  const link: string = '/tone';

  const subtitle = `Edit ${title}`;
  const desc = `Add your ${title}`;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title,
      href: link,
    },
    {
      title: `Edit`,
      href: `${link}/${tone_category.data.id}/edit`
    }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={title} />

      <section className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <MainFormHeader subtitle={subtitle} desc={desc} />
        <ToneCategoryFormEdit tone_category={tone_category.data} />
      </section>
    </AppLayout>
  );
}