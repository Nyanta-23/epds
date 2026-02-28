import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableEmpty,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useRecomendationRuleAction } from '@/hooks/use-recomendation-rule-action';
import { Filter } from '@/types';
import { RecomendationRule } from '@/types/resource';
import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

interface RecomendationRuleTableProps {
    data: RecomendationRule[];
    filter: Filter;
}

export default function RecomendationRuleTable({
    data,
    filter,
}: RecomendationRuleTableProps) {
    const { deleteRecomendationRule, processingId } =
        useRecomendationRuleAction();

    const { only_trash } = filter;

    return (
        <TableContainer>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="pl-4">Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-center">
                            Minimal Score
                        </TableHead>
                        <TableHead className="text-center">
                            Maximal Score
                        </TableHead>
                        <TableHead className="pr-4 text-right">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableEmpty colSpan={5} />
                    ) : (
                    data.map((rule) => (
                        <TableRow key={rule.id}>
                            <TableCell className="pl-4 font-medium">
                                {rule.name}
                            </TableCell>
                            <TableCell>
                                {!rule.description ? '-' : rule.description}
                            </TableCell>
                            <TableCell className="text-center">
                                {!rule.min_score ? '-' : rule.min_score}
                            </TableCell>
                            <TableCell className="text-center">
                                {!rule.max_score ? '-' : rule.max_score}
                            </TableCell>

                            <TableCell className="flex justify-end gap-2 pr-4">
                                <Link href={route('rule.edit', rule.id)}>
                                    <Button className="cursor-pointer">
                                        <Pencil />
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
