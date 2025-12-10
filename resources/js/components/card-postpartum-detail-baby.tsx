import { PostpartumVisit } from '@/types/resource';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table';

interface CardPostpartumDetailBabyProps {
    postpartum: PostpartumVisit;
}

export default function CardPostpartumDetailBaby({
    postpartum,
}: CardPostpartumDetailBabyProps) {
    console.log(postpartum);
    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">
                    Detail Baby
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <section>
                    <Table>
                        <TableHeader className="bg-accent">
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead className="text-center">
                                    Anak ke{' '}
                                </TableHead>
                                <TableHead>Tanggal Lahir</TableHead>
                                <TableHead>Kondisi Bayi</TableHead>
                                <TableHead>Cara memberi makan</TableHead>
                                <TableHead>Tipe Persalinan</TableHead>
                                <TableHead>Jenis Kelamin</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {postpartum.mother.babies.map((baby, index) => (
                                <TableRow>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{baby.which_child}</TableCell>
                                    <TableCell>{baby.date_of_birth}</TableCell>
                                    <TableCell>
                                        {baby.baby_condition_label}
                                    </TableCell>
                                    <TableCell>
                                        {baby.baby_feeding_method_label}
                                    </TableCell>
                                    <TableCell>
                                        {baby.typeof_delivery_label}
                                    </TableCell>
                                    <TableCell>{baby.gender}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </section>
            </CardContent>
        </Card>
    );
}

function CardBaby() {
    return <section></section>;
}
