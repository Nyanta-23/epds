import FollowUpCreate from '@/pages/followup/action/followup-create';
import FollowUpEdit from '@/pages/followup/action/followup-edit';
import { Enums } from '@/types';
import { PostpartumVisit, Result } from '@/types/resource';
import { useState } from 'react';
import FormDialog from './form-dialog-version-two';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

interface CardPostpartumFollowUpProps {
    postpartum: PostpartumVisit;
    enums: Enums;
}

export default function CardPostpartumFollowUp({
    postpartum,
    enums,
}: CardPostpartumFollowUpProps) {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [result, setResult] = useState<PostpartumVisit>();

    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle className="text-lg">Tindak Lanjut</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-2">
                    <p className="font-medium">Tipe</p>
                    <p className="text-muted-foreground">
                        {postpartum.followup?.type.label_id ?? '-'}
                    </p>
                </div>

                <div className="space-y-2">
                    <p className="font-medium">Catatan</p>
                    <p className="text-muted-foreground">
                        {postpartum.followup?.notes ?? '-'}
                    </p>
                </div>

                <div className="space-y-2">
                    <p className="font-medium">Tanggal diisi</p>
                    <p className="text-muted-foreground">
                        {postpartum.followup?.date_filled ?? '-'}
                    </p>
                </div>

                <Separator />

                <Button
                    onClick={() => {
                        setResult(postpartum);
                        setOpenDialog(true);
                    }}
                    className="w-full"
                >
                    Add Follow Up
                </Button>
            </CardContent>
            <FormDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                title="Form Checkup"
                description={
                    !result?.followup
                        ? 'Isi data postpartum checkup.'
                        : 'Ubah data postpartum checkup.'
                }
            >
                {!result?.followup ? (
                    <FollowUpCreate
                        enums={enums}
                        result={result}
                        onSuccess={() => setOpenDialog(false)}
                    />
                ) : (
                    <FollowUpEdit
                        enums={enums}
                        result={result}
                        onSuccess={() => setOpenDialog(false)}
                    />
                )}
            </FormDialog>
        </Card>
    );
}
