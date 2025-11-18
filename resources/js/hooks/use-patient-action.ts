import { FormPatient } from "@/types/form";
import { Patient } from "@/types/resource";
import { useForm } from "@inertiajs/react";
import { useState } from "react";

export function usePatientAction(patient?: Patient) {

  const { data, setData, reset, errors, clearErrors, put, patch, processing } = useForm<FormPatient>({
    name: patient?.name || '',
    phone_number: patient?.phone_number || '',
    birthplace: patient?.birthplace || '',
    date_of_birth: patient?.date_of_birth || '',
    job: patient?.job || '',
    married_status: patient?.married_status || '',
    highest_education: patient?.highest_education || '',
    province: patient?.province || '',
    city_or_district: patient?.city_or_district || '',
    subdistrict: patient?.subdistrict || '',
    village: patient?.village || '',

    province_id: patient?.province_id || '',
    city_or_district_id: patient?.city_or_district_id || '',
    subdistrict_id: patient?.subdistrict_id || '',
    village_id: patient?.village_id || '',

    address: patient?.address || '',
    is_verified: patient?.is_verified || false,
    is_can_visit: patient?.is_can_visit || false
  });


  const [visitingId, setVisitingId] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  const updatePatient = (id?: string) => {
    if (!id) return;

    put(route('patient.update', id), {
      onSuccess: () => reset(
        "name",
        "phone_number",
        "birthplace",
        "date_of_birth",
        "job",
        "married_status",
        "highest_education",
        "province",
        "city_or_district",
        "subdistrict",
        "village",

        "province_id",
        "city_or_district_id",
        "subdistrict_id",
        "village_id",

        "address",
        "is_verified",
        "is_can_visit"
      ),
      onError: (err) => {
        console.log(err);
      }
    });
  }


  const handleInputChange = (field: keyof FormPatient, value: string | number | null) => {
    setData((prev: FormPatient) => {

      const updatingValue = {
        ...prev,
        [field as keyof FormPatient]: value
      };

      Object.entries(updatingValue)
        .forEach(([key, val]) => {
          if (val && val.toString().length > 0) clearErrors(key);
        });

      return updatingValue;
    });
  }

  const updateStatusVerified = (id?: string) => {

    if (!id) return;

    setVerificationId(id);

    patch(route('patient.verification', id), {
      preserveScroll: true,
      onSuccess: () => reset("is_verified"),
      onError: (err) => {
        console.log(err);
      },
      onFinish: () => setVerificationId(null),
    });
  }

  const updateStatusCanVisit = (id?: string) => {
    if (!id) return;

    setVisitingId(id);

    patch(route('patient.visit', id), {
      preserveScroll: true,
      onSuccess: () => reset("is_can_visit"),
      onError: (err) => {
        console.log(err);
      },
      onFinish: () => setVisitingId(null),
    });
  }


  return {
    data,
    setData,
    errors,
    clearErrors,
    reset,
    handleInputChange,
    processing,
    visitingId,
    verificationId,
    updatePatient,
    updateStatusCanVisit,
    updateStatusVerified
  }
}

