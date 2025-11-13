import { Patient } from "@/types/resource";
import { router } from "@inertiajs/react";
import { Check, CircleCheck, X, CircleX } from "lucide-react";

interface PatientDetailProps {
  patient: Patient;
}

export default function PatientDetail({ patient }: PatientDetailProps) {

  return (
    <div className="mx-auto p-6 bg-card text-card-foreground shadow rounded-lg">
      <h1 className="text-3xl font-semibold mb-6">Patient Details</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="font-medium">Name:</div>
        <div>{patient.name}</div>

        <div className="font-medium">Phone Number:</div>
        <div>{patient.phone_number || "-"}</div>

        <div className="font-medium">Birthplace:</div>
        <div>{patient.birthplace || "-"}</div>

        <div className="font-medium">Date of Birth:</div>
        <div>{patient.date_of_birth || "-"}</div>

        <div className="font-medium">Job:</div>
        <div>{patient.job || "-"}</div>

        <div className="font-medium">Married Status:</div>
        <div>{patient.married_status || "-"}</div>

        <div className="font-medium">Highest Education:</div>
        <div>{patient.highest_education || "-"}</div>

        <div className="font-medium">Province:</div>
        <div>{patient.province || "-"}</div>

        <div className="font-medium">City / District:</div>
        <div>{patient.city_or_district || "-"}</div>

        <div className="font-medium">Subdistrict:</div>
        <div>{patient.subdistrict || "-"}</div>

        <div className="font-medium">Village:</div>
        <div>{patient.village || "-"}</div>

        <div className="font-medium">Address:</div>
        <div>{patient.address || "-"}</div>

        <div className="font-medium">Is Verified:</div>
        <div>
          {patient.is_verified ? (
            <Check className="inline-block text-green-500" />
          ) : (
            <X className="inline-block text-red-500" />
          )}
        </div>

        <div className="font-medium">Is Can Visit:</div>
        <div>
          {patient.is_can_visit ? (
            <CircleCheck className="inline-block text-green-500" />
          ) : (
            <CircleX className="inline-block text-red-500" />
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.get(route("patient"))}
        className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary transition"
      >
        Back
      </button>
    </div>
  )
}