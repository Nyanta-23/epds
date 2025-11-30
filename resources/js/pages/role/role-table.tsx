

import { Pencil, Trash2, Undo2 } from "lucide-react";
import { Role } from "@/types/resource";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ButtonConfirmation } from "@/components/button-confirmation";
import { useUserAction } from "@/hooks/use-user-action";
import { Filter } from "@/types";
import { Link } from "@inertiajs/react";
import { Spinner } from "@/components/ui/spinner";


interface RoleTableProps {
  data: Role[];
}

export default function RoleTable({ data }: RoleTableProps) {

  const { deleteUser, processingId } = useUserAction();
  // const { only_trash } = filter;

  return (
    <section className='rounded-b-md border-t-0 border overflow-hidden'>
      <Table>
        <TableHeader className='bg-accent'>
          <TableRow>
            <TableHead>Name</TableHead>
            {/* <TableHead>Email</TableHead> */}
            {/* <TableHead>Role</TableHead> */}
            {/* <TableHead className="text-right">Action</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{role.name}</TableCell>

              {/* <TableCell className="flex justify-end gap-2">

                {!only_trash ? (
                  <>
                    <Link href={route('user.edit', user.id)}>
                      <Button className="cursor-pointer">
                        <Pencil />
                      </Button>
                    </Link>

                    <ButtonConfirmation
                      content={{
                        title: 'Are you sure?',
                        description: 'Deleting this user'
                      }}
                      onConfirm={() => deleteUser(user.id)}
                    >
                      <Button
                        disabled={processingId === user.id}
                        className="cursor-pointer">
                        {processingId == user.id ? <Spinner /> : <Trash2 />}
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