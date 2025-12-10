import { Enum, PostpartumVisit, Result } from "@/types/resource";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import Postpartum from "@/pages/postpartum";
import { useState } from "react";
import FormDialog from "./form-dialog-version-two";
import FollowUpCreate from "@/pages/followup/action/followup-create";
import FollowUpEdit from "@/pages/followup/action/followup-edit";
import { Enums } from "@/types";

interface CardPostpartumFollowUpProps {
  postpartum: PostpartumVisit;
  enums: Enums
}

export default function CardPostpartumFollowUp({postpartum, enums}:CardPostpartumFollowUpProps) {

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [result, setResult] = useState<Result>();

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg">Follow Up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">

        <div className="space-y-2">
          <p className="font-medium">Type</p>
          <p className="text-muted-foreground">{postpartum.followup?.type.label_id ?? '-'}</p>
        </div>

        <div className="space-y-2">
          <p className="font-medium">Notes</p>
          <p className="text-muted-foreground">
            {postpartum.followup?.notes ?? '-'}
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-medium">Date Filled</p>
          <p className="text-muted-foreground">{postpartum.followup?.date_filled ?? '-'}</p>
        </div>

        <Separator />

        <Button onClick={() => {
                  setOpenDialog(true);
                  setResult(postpartum.result);
                }} className="w-full">Add Follow Up</Button>

      </CardContent>
      <FormDialog
              open={openDialog}
              onOpenChange={setOpenDialog}
              title="Form Checkup"
              description={!result?.follow_up ? 'Fill data postpartum checkup.' : 'Edit data postpartum checkup.'}
            >
              {!result?.follow_up ? (
                <FollowUpCreate enums={enums} result={result} onSuccess={() => setOpenDialog(false)} />
              ) : (
                <FollowUpEdit enums={enums} result={result} onSuccess={() => setOpenDialog(false)} />
              )}
            </FormDialog>
      
    </Card>
  )
}