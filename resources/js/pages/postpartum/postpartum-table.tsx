

import { Clipboard, ClipboardPenLine, Eye, Pencil } from "lucide-react";
import { FollowUp, PostpartumVisit } from "@/types/resource";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Enums } from "@/types";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import FormDialog from "@/components/form-dialog-version-two";
import FollowUpCreate from "../followup/action/followup-create";
import FollowUpEdit from "../followup/action/followup-edit";
import { useFollowUpAction } from "@/hooks/use-followup-action";


interface PostpartumTableProps {
  data: PostpartumVisit[];
  enums: Enums;
}

export default function PostpartumTable({ data, enums }: PostpartumTableProps) {

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [followup, setFollowup] = useState<FollowUp>();

  return (
    <section className='rounded-b-md border-t-0 border overflow-hidden'>
      <Table>
        <TableHeader className='bg-accent'>
          <TableRow>
            <TableHead>Number Patient</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Visiting</TableHead>
            <TableHead>Result Status</TableHead>
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

                <Button className="cursor-pointer" onClick={() => {
                  setOpenDialog(true);
                  setFollowup(postpartum.result.follow_up);
                }} >
                  {!postpartum.result.follow_up ? (
                    <Clipboard />
                  ) : (
                    <ClipboardPenLine />
                  )}
                </Button>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>


      <FormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title="Form Checkup"
        description={!followup ? 'Fill data postpartum checkup.' : 'Edit data postpartum checkup.'}
      >
        {!followup ? (
          <FollowUpCreate enums={enums} follow_up={followup} />
        ) : (
          <FollowUpEdit enums={enums} follow_up={followup} />
        )}
      </FormDialog>

    </section>
  );
}