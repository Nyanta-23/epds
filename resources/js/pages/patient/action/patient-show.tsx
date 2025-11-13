import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { PatientSingleData } from "@/types/data";
import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { Check, CircleCheck, X, CircleX } from "lucide-react";
import PatientDetail from "../patient-detail";

interface PatientShowProps {
  patient: PatientSingleData;
}

export default function PatientShow({ patient }: PatientShowProps) {

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
      title: `Show`,
      href: `${link}/${patient.data.id}`
    }
  ];

  return (

    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={title} />

      <section className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <PatientDetail patient={patient.data} />
      </section>

    </AppLayout>

  );
}