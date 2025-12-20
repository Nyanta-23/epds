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
            <Table>
                <TableHeader className="bg-accent">
                    <TableRow>
                        <TableHead>Nomor Pasien</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Kunjungan Nifas</TableHead>
                        <TableHead>Status Hasil</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((postpartum) => (
                        <TableRow key={postpartum.id}>
                            <TableCell className="font-medium">
                                {postpartum.mother.number_patient}
                            </TableCell>
                            <TableCell className="font-medium">
                                {postpartum.mother.name}
                            </TableCell>
                            <TableCell>KF-{postpartum.visit_number}</TableCell>
                            <TableCell>
                                {postpartum.result.followup_status.label_id}
                            </TableCell>

                            <TableCell className="flex justify-end gap-2">
                                {/* <Link href={route('postpartum.edit', postpartum.id)}>
                  <Button className="cursor-pointer">
                    <Pencil />
                  </Button>
                </Link> */}
                                <Link
                                    href={route(
                                        'postpartum.show',
                                        postpartum.id,
                                    )}
                                >
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
