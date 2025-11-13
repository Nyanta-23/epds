import { Extra, PageProp } from "@/types";
import { PatientData, UserData } from "@/types/data";
import MainPagination from "@/components/main/main-pagination";
import PatientAction from "./patient-action";
import PatientTable from "./patient-table";

export interface PatientMainContentProps {
  patient: PatientData;
  extra?: Extra;
  page_prop: PageProp;
}

export default function PatientMainContent({ patient, extra, page_prop }: PatientMainContentProps) {

  const { filter } = page_prop;
  const { meta, data } = patient;

  return (
    <>
      <PatientAction filter={filter} meta={meta} />

      <section className="grid auto-rows-min gap-4">
        <section className="w-full">

          <PatientTable data={data} />

          <MainPagination meta={meta} filter={filter} />

        </section>
      </section>
    </>
  )
}