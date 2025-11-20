

import { Trash2, Undo2 } from "lucide-react";
import { RecomendationVariation } from "@/types/resource";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ButtonConfirmation } from "@/components/button-confirmation";
import { Filter } from "@/types";
import { Spinner } from "@/components/ui/spinner";
import { useRecomendationVariationAction } from "@/hooks/use-recomendation-variation-action";


interface RecomendationVariationTableProps {
  data: RecomendationVariation[];
  filter: Filter;
}

export default function RecomendationVariationTable({ data, filter }: RecomendationVariationTableProps) {

  const { deleteRecomendationVariation, processingId } = useRecomendationVariationAction();

  const { only_trash } = filter;

  return (
    <section className='rounded-b-md border-t-0 border overflow-hidden'>
      <Table>
        <TableHeader className='bg-accent'>
          <TableRow>
            <TableHead>Generated At</TableHead>
            <TableHead>Text Recomendation</TableHead>
            {/* <TableHead className="text-right">Action</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((variation) => (
            <TableRow key={variation.id}>
              <TableCell className="font-medium">{variation.generated_at}</TableCell>
              <TableCell className="font-medium">{variation.recomendation_text}</TableCell>

              {/* <TableCell className="flex justify-end gap-2">
                
                {!only_trash ? (
                  <>

                    <ButtonConfirmation
                      content={{
                        title: 'Are you sure?',
                        description: 'Deleting this recomendation rule.'
                      }}
                      onConfirm={() => deleteRecomendationVariation(variation.id)}
                    >
                      <Button
                        disabled={processingId === variation.id}
                        className="cursor-pointer">
                        {processingId == variation.id ? <Spinner /> : <Trash2 />}
                      </Button>
                    </ButtonConfirmation>
                  </>
                ) : (
                  <>
                    <Button className="cursor-pointer">
                      <Undo2 />
                    </Button>
                  </>
                )}


              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}