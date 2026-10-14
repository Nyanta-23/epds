import MainHeader from "@/components/main/main-header";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import RecapitulationContent from "./recapitulation/recapitulation-content";
import { Recapitulation as RecapitulationType } from "@/types/resource";

interface RecapitulationProps {
  facilities: RecapitulationType[];
}

const Recapitulation = ({ facilities }: RecapitulationProps) => {

  const title: string = 'Rekapitulasi';
  const link: string = '/recapitulation';

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
        <MainHeader subtitle={title} desc="Halaman rekapitulasi data anak faskes." />
        <RecapitulationContent facilities={facilities} />
      </section>
    </AppLayout>
  );

}
export default Recapitulation;