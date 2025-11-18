

import { Pencil, Trash2, Undo2 } from "lucide-react";
import { Baby } from "@/types/resource";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ButtonConfirmation } from "@/components/button-confirmation";
import { Filter } from "@/types";
import { Link } from "@inertiajs/react";
import { Spinner } from "@/components/ui/spinner";
import { useBabyAction } from "@/hooks/use-baby-action";


interface UserTableProps {
  data: Baby[];
  filter: Filter;
}

export default function BabyTable({ data, filter }: UserTableProps) {

  const { deleteBaby, processingId } = useBabyAction();
  const { only_trash } = filter;


  console.log(data);

  return (
    <section className='rounded-b-md border-t-0 border overflow-hidden'>
      <Table>
        <TableHeader className='bg-accent'>
          <TableRow>
            <TableHead>Mother Name</TableHead>
            <TableHead className="text-center">Which Child</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Baby Condition</TableHead>
            <TableHead>Typeof Delivery</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((baby) => (
            <TableRow key={baby.id}>
              <TableCell className="font-medium">{baby.mother.name}</TableCell>
              <TableCell className="text-center">{baby.which_child}</TableCell>
              <TableCell>{baby.date_of_birth}</TableCell>
              <TableCell>{baby.baby_condition_label}</TableCell>
              <TableCell>{baby.typeof_delivery_label}</TableCell>
              <TableCell>{baby.gender}</TableCell>

              <TableCell className="flex justify-end gap-2">

                {!only_trash ? (
                  <>
                    <Link href={route('baby.edit', baby.id)}>
                      <Button className="cursor-pointer">
                        <Pencil />
                      </Button>
                    </Link>

                    <ButtonConfirmation
                      content={{
                        title: 'Are you sure?',
                        description: 'Deleting this baby.'
                      }}
                      onConfirm={() => deleteBaby(baby.id)}
                    >
                      <Button
                        disabled={processingId === baby.id}
                        className="cursor-pointer">
                        {processingId === baby.id ? <Spinner /> : <Trash2 />}
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


              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </section>
  );
}