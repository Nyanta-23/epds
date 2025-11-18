

import { Eye, Pencil, Trash2, Undo2 } from "lucide-react";
import { PostpartumVisit } from "@/types/resource";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ButtonConfirmation } from "@/components/button-confirmation";
import { useUserAction } from "@/hooks/use-user-action";
import { Filter } from "@/types";
import { Link } from "@inertiajs/react";
import { Spinner } from "@/components/ui/spinner";


interface PostpartumTableProps {
  data: PostpartumVisit[];
  filter: Filter;
}

export default function PostpartumTable({ data, filter }: PostpartumTableProps) {

  const { deleteUser, processingId } = useUserAction();
  const { only_trash } = filter;

  return (
    <section className='rounded-b-md border-t-0 border overflow-hidden'>
      <Table>
        <TableHeader className='bg-accent'>
          <TableRow>
            <TableHead>Number Patient</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Visiting</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((postpartum) => (
            <TableRow key={postpartum.id}>
              <TableCell className="font-medium">{postpartum.mother.id}</TableCell>
              <TableCell className="font-medium">{postpartum.mother.name}</TableCell>
              <TableCell>{postpartum.visit_number}</TableCell>
              <TableCell>{postpartum.result.followup_status.label}</TableCell>

              <TableCell className="flex justify-end gap-2">
                    <Link href={route('postpartum.edit', postpartum.id)}>
                      <Button className="cursor-pointer">
                        <Pencil />
                      </Button>
                    </Link>
                    <Link href={route('postpartum.show', postpartum.id)}>
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