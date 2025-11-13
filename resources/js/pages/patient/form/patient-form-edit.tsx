import { Patient } from "@/types/resource";
import PatientFormInformation from "./patient-form-information";
import { usePatientAction } from "@/hooks/use-patient-action";

interface PatientFormEditProps {
  // extra: Extra;
  patient: Patient;
}

export default function PatientFormEdit({ patient }: PatientFormEditProps) {

  // const { roles } = extra;

  const {
    data,
    errors,
    handleInputChange,
    updatePatient,
    processing
  } = usePatientAction(patient);

  return (

    <section className="px-6 py-6">
      <div className="mx-auto">
        <form>
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border">
              <div className="border-b px-6 py-4">
                <h3 className="text-lg font-medium">Edit a User</h3>
                <p className="mt-1 text-sm">Details about User</p>
              </div>

              <div className="space-y-4 p-6">
                <PatientFormInformation data={data} errors={errors} process={processing} handleInputChange={handleInputChange} action={() => updatePatient(patient.id)} />
              </div>
            </div>


          </div>
        </form>
      </div>
    </section>

  );
}
