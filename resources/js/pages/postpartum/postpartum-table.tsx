import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Enums } from '@/types';
import { PostpartumVisit } from '@/types/resource';
import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { useState } from 'react';

interface PostpartumTableProps {
    data: PostpartumVisit[];
    enums: Enums;
}

export default function PostpartumTable({ data, enums }: PostpartumTableProps) {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const [result, setResult] = useState<PostpartumVisit>();

    return (
        <section className="overflow-hidden rounded-b-md border border-t-0">
            {/* Desktop Table + Mobile horizontal scroll */}
            <div className="overflow-x-auto">
                <Table className="min-w-full text-sm">
                    <TableHeader className="bg-accent">
                        <TableRow>
                            <TableHead className="whitespace-nowrap">
                                Nomor Pasien
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                                Nama
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                                Kunjungan Nifas
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                                Status Hasil
                            </TableHead>
                            <TableHead className="sticky right-0 bg-accent text-right whitespace-nowrap shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.08)]">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((postpartum) => (
                            <TableRow key={postpartum.id}>
                                <TableCell className="font-medium whitespace-nowrap">
                                    {postpartum.mother.number_patient}
                                </TableCell>
                                <TableCell className="font-medium whitespace-nowrap">
                                    {postpartum.mother.name}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    KF-{postpartum.visit_number}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {postpartum.result.followup_status.label_id}
                                </TableCell>
                                <TableCell className="sticky right-0 bg-background shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.08)]">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={route(
                                                'postpartum.show',
                                                postpartum.id,
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
