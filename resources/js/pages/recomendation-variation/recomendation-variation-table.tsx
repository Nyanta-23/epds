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
import { useRecomendationVariationAction } from '@/hooks/use-recomendation-variation-action';
import { Filter } from '@/types';
import { RecomendationVariation } from '@/types/resource';

interface RecomendationVariationTableProps {
    data: RecomendationVariation[];
    filter: Filter;
}

export default function RecomendationVariationTable({
    data,
    filter,
}: RecomendationVariationTableProps) {
    const { deleteRecomendationVariation, processingId } =
        useRecomendationVariationAction();

    const { only_trash } = filter;

    return (
        <TableContainer>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="pl-4">Generated At</TableHead>
                        <TableHead>Text Rekomendasi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableEmpty colSpan={2} />
                    ) : (
                    data.map((variation) => (
                        <TableRow key={variation.id}>
                            <TableCell className="pl-4 font-medium whitespace-nowrap">
                                {variation.generated_at}
                            </TableCell>
                            <TableCell className="max-w-[600px] font-medium break-words whitespace-normal">
                                {variation.recomendation_text}
                            </TableCell>
                        </TableRow>
                    ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
