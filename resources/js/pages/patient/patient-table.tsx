

import { Check, CircleCheck, CircleX, Eye, Pencil, X } from "lucide-react";
import { Patient } from "@/types/resource";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { ButtonConfirmation } from "@/components/button-confirmation";
import { usePatientAction } from "@/hooks/use-patient-action";
import { Spinner } from "@/components/ui/spinner";


interface PatientTableProps {
  data: Patient[];
}

export default function PatientTable({ data }: PatientTableProps) {

  const { visitingId, verificationId, updateStatusCanVisit, updateStatusVerified } = usePatientAction();

  console.log(data);

  return (
    <section className='rounded-b-md border-t-0 border overflow-hidden'>
      <Table>
        <TableHeader className='bg-accent'>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Place, Date of birth</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>City</TableHead>
            <TableHead className="text-center">Is Verified</TableHead>
            <TableHead className="text-center">Is Can Visit</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell className="font-medium">{patient.name}</TableCell>
              <TableCell>{patient.phone_number}</TableCell>
              <TableCell>{`${patient.birthplace}, ${patient.date_of_birth}`}</TableCell>
              <TableCell>{patient.job}</TableCell>
              <TableCell>{patient.city_or_district}</TableCell>
              <TableCell className="text-center">
                <ButtonConfirmation
                  content={{
                    title: "Are you sure?",
                    description: `This will make user ${!patient.is_verified ? 'verified' : 'unverified'}.`,
                  }}
                  onConfirm={() => updateStatusVerified(patient.id)}
                >
                  <Button disabled={verificationId === patient.id} className="cursor-pointer">
                    {verificationId == patient.id ?
                      <Spinner /> :
                      (patient.is_verified ? (<Check />) : (<X />))
                    }
                  </Button>
                </ButtonConfirmation>
              </TableCell>

              <TableCell className="text-center">
                <ButtonConfirmation
                  content={{
                    title: "Are you sure?",
                    description: `This will make user ${!patient.is_can_visit ? 'can visit' : 'cant\'t visit'}.`,
                  }}
                  onConfirm={() => updateStatusCanVisit(patient.id)}
                >
                  <Button disabled={visitingId === patient.id} className="cursor-pointer" variant={!patient.is_can_visit ? 'default' : 'ghost'}>
                    {visitingId == patient.id ?
                      <Spinner /> :
                      (patient.is_can_visit ? (<CircleCheck />) : (<CircleX />))
                    }
                  </Button>
                </ButtonConfirmation>
              </TableCell>

              <TableCell className="flex justify-end gap-2">
                <Link href={route('patient.edit', patient.id)}>
                  <Button className="cursor-pointer">
                    <Pencil />
                  </Button>
                </Link>

                <Link href={route('patient.show', patient.id)}>
                  <Button className="cursor-pointer">
                    <Eye />
                  </Button>
                </Link>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </section>
  );
}