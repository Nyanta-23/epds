import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Patient } from '@/types/resource';
import { Link } from '@inertiajs/react';
import { Eye, Pencil } from 'lucide-react';

interface PatientTableProps {
    data: Patient[];
}

export default function PatientTable({ data }: PatientTableProps) {
    return (
        <section className="overflow-hidden rounded-b-md border border-t-0">
            <div className="overflow-x-auto">
                <Table className="min-w-full text-sm">
                    <TableHeader className="bg-accent">
                        <TableRow>
                            <TableHead className="whitespace-nowrap">
                                Nama
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                                Nomor Telepon
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                                Tempat, Tanggal Lahir
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                                Pekerjaan
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                                Kota
                            </TableHead>
                            <TableHead className="sticky right-0 bg-accent text-right whitespace-nowrap shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.08)]">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((patient) => (
                            <TableRow key={patient.id}>
                                <TableCell
                                    className={`font-medium whitespace-nowrap ${patient?.name == null ? 'text-center' : ''}`}
                                >
                                    {patient?.name}
                                </TableCell>
                                <TableCell
                                    className={`font-medium whitespace-nowrap ${patient?.phone_number == null ? 'text-center' : ''}`}
                                >
                                    {patient?.phone_number ?? '-'}
                                </TableCell>
                                <TableCell
                                    className={`font-medium whitespace-nowrap ${patient?.birthplace == null ? 'text-center' : ''}`}
                                >{`${patient?.birthplace ?? '-'}, ${patient?.date_of_birth ?? '-'}`}</TableCell>
                                <TableCell
                                    className={`font-medium whitespace-nowrap ${patient?.job == null ? 'text-center' : ''}`}
                                >
                                    {patient?.job ?? '-'}
                                </TableCell>
                                <TableCell
                                    className={`font-medium whitespace-nowrap ${patient?.city_or_district == null ? 'text-center' : ''}`}
                                >
                                    {patient?.city_or_district ?? '-'}
                                </TableCell>

                                <TableCell className="sticky right-0 bg-background shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.08)]">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={route(
                                                'patient.edit',
                                                patient.id,
                                            )}
                                        >
                                            <Button
                                                size="sm"
                                                className="cursor-pointer"
                                            >
                                                <Pencil />
                                            </Button>
                                        </Link>
                                        <Link
                                            href={route(
                                                'patient.show',
                                                patient.id,
                                            )}
                                        >
                                            <Button
                                                size="sm"
                                                className="cursor-pointer"
                                            >
                                                <Eye />
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}
