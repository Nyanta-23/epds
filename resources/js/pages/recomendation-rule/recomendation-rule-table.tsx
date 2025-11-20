

import { Pencil, Trash2, Undo2 } from "lucide-react";
import { RecomendationRule } from "@/types/resource";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ButtonConfirmation } from "@/components/button-confirmation";
import { Filter } from "@/types";
import { Link } from "@inertiajs/react";
import { Spinner } from "@/components/ui/spinner";
import { useRecomendationRuleAction } from "@/hooks/use-recomendation-rule-action";


interface RecomendationRuleTableProps {
  data: RecomendationRule[];
  filter: Filter;
}

export default function RecomendationRuleTable({ data, filter }: RecomendationRuleTableProps) {

  const { deleteRecomendationRule, processingId } = useRecomendationRuleAction();

  const { only_trash } = filter;

  return (
    <section className='rounded-b-md border-t-0 border overflow-hidden'>
      <Table>
        <TableHeader className='bg-accent'>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-center">Minimal Score</TableHead>
            <TableHead className="text-center">Maximal Score</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">{rule.name}</TableCell>
              <TableCell>{!rule.description ? '-' : rule.description}</TableCell>
              <TableCell className="text-center">{!rule.min_score ? '-' : rule.min_score}</TableCell>
              <TableCell className="text-center">{!rule.max_score ? '-' : rule.max_score}</TableCell>

              <TableCell className="flex justify-end gap-2">


                <Link href={route('rule.edit', rule.id)}>
                  <Button className="cursor-pointer">
                    <Pencil />
                  </Button>
                </Link>

                {/* {!only_trash ? (
                  <>
                    <Link href={route('rule.edit', rule.id)}>
                      <Button className="cursor-pointer">
                        <Pencil />
                      </Button>
                    </Link>

                    <ButtonConfirmation
                      content={{
                        title: 'Are you sure?',
                        description: 'Deleting this recomendation rule.'
                      }}
                      onConfirm={() => deleteRecomendationRule(rule.id)}
                    >
                      <Button
                        disabled={processingId === rule.id}
                        className="cursor-pointer">
                        {processingId == rule.id ? <Spinner /> : <Trash2 />}
                      </Button>
                    </ButtonConfirmation>
                  </>
                ) : (
                  <>
                    <Button className="cursor-pointer">
                      <Undo2 />
                    </Button>
                  </>
                )} */}


              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}