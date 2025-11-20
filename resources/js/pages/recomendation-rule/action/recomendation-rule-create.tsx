import MainFormHeader from "@/components/main/main-form-header";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import RecomendationRuleFormCreate from "../form/recomendation-rule-form-create";



export default function RecomendationRuleCreate() {

  const title: string = 'Recomendation Rule';
  const link: string = '/recomendation/rule';

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
        <RecomendationRuleFormCreate />
      </section>
    </AppLayout>
  );
}