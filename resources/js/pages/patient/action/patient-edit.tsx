import MainFormHeader from "@/components/main/main-form-header";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Extra } from "@/types";
import { Head } from "@inertiajs/react";
import { PatientSingleData } from "@/types/data";
import PatientFormEdit from "../form/patient-form-edit";


interface PatientEditProps {
  patient: PatientSingleData;
  // extra: Extra;
}

export default function PatientEdit({ patient }: PatientEditProps) {

  const title: string = 'Patient';
  const link: string = '/patient';

  const subtitle = `Edit ${title}`;
  const desc = `Add your ${title}`

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title,
      href: link,
    },
    {
      title: `Edit`,
      href: `${link}/${patient.data.id}/edit`
    }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={title} />

      <section className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <MainFormHeader subtitle={subtitle} desc={desc} />
        <PatientFormEdit patient={patient.data} />
      </section>
    </AppLayout>
  );
}