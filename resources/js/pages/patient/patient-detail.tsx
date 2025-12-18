import marriedStatus from '@/components/utils/married_status';
import { Patient } from '@/types/resource';
import { router } from '@inertiajs/react';

interface PatientDetailProps {
    patient: Patient;
}

export default function PatientDetail({ patient }: PatientDetailProps) {
    return (
        <div className="mx-auto rounded-lg bg-card p-6 text-card-foreground shadow">
            <h1 className="mb-6 text-3xl font-semibold">Detail Pasien</h1>

            <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="font-medium">Nama:</div>
                <div>{patient.name}</div>

                <div className="font-medium">Nomor Telepon:</div>
                <div>{patient.phone_number || '-'}</div>

                <div className="font-medium">Tempat Lahir:</div>
                <div>{patient.birthplace || '-'}</div>

                <div className="font-medium">Tanggal Lahir:</div>
                <div>{patient.date_of_birth || '-'}</div>

                <div className="font-medium">Pekerjaan:</div>
                <div>{patient.job || '-'}</div>

                <div className="font-medium">Status Pernikahan:</div>
                <div>{marriedStatus(patient?.married_status ?? '-')}</div>

                <div className="font-medium">Pendidikan Terakhir:</div>
                <div>{patient.highest_education || '-'}</div>

                <div className="font-medium">Provinsi:</div>
                <div>{patient.province || '-'}</div>

                <div className="font-medium">Kota / Kabupaten:</div>
                <div>{patient.city_or_district || '-'}</div>

                <div className="font-medium">Kecamatan:</div>
                <div>{patient.subdistrict || '-'}</div>

                <div className="font-medium">Desa:</div>
                <div>{patient.village || '-'}</div>

                <div className="font-medium">Alamat Lengkap:</div>
                <div>{patient.address || '-'}</div>
            </div>

            <button
                type="button"
                onClick={() => router.get(route('patient'))}
                className="rounded-md bg-secondary px-4 py-2 text-secondary-foreground transition hover:bg-secondary-foreground hover:text-secondary"
            >
                Back
            </button>
        </div>
    );
}
