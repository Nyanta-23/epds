import FollowUpCreate from '@/pages/followup/action/followup-create';
import FollowUpEdit from '@/pages/followup/action/followup-edit';
import { Enums } from '@/types';
import { PostpartumVisit } from '@/types/resource';
import { useState } from 'react';
import FormDialog from './form-dialog-version-two';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ClipboardList, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

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
    const [initialType, setInitialType] = useState<number | null>(null);
    const [initialStatus, setInitialStatus] = useState<number | null>(null);

    const rujukOptions = (enums.followup_status || []).filter(
        (option) => Number(option.value) !== 0 && Number(option.value) !== 5,
    );
    const rujukanTypeOption = enums.followup_types?.find(e => e.label.toLowerCase().includes('rujuk'));
    const defaultTypeOption = enums.followup_types?.find(e => !e.label.toLowerCase().includes('rujuk'));

    return (
        <Card className="border-l-4 border-l-primary shadow-sm  flex flex-col min-h-[19rem]">
            <CardHeader className="pb-3 px-4 pt-4 md:px-6 md:pt-6">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-primary" />
                    Tindak Lanjut
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 md:px-6 pb-4 md:pb-6 flex-1 flex flex-col">
                
                <div className="flex-1 flex flex-col justify-center mb-6">
                    {!postpartum.followup ? (
                        <div className="bg-muted rounded-md p-4 text-center border">
                            <p className="text-sm text-muted-foreground">Belum ada tindak lanjut</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wider">Tipe</p>
                                <p className="text-sm font-medium">
                                    {postpartum.followup.type.label_id ?? '-'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wider">Catatan</p>
                                <p className="text-sm leading-relaxed">
                                    {postpartum.followup.notes ?? '-'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wider">Tanggal diisi</p>
                                <p className="text-sm">
                                    {postpartum.followup.date_filled ?? '-'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-auto">
                    {!postpartum.followup && rujukOptions.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {postpartum.result && postpartum.result.total_score > 12 && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full h-auto min-h-10 px-4 py-2 text-sm font-medium border-primary text-primary hover:bg-primary/5"
                                        >
                                            <span className="text-left font-semibold">
                                                Rujuk Pasien
                                            </span>
                                            <ChevronDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56"
                                        align="start"
                                    >
                                        {rujukOptions.map((option) => (
                                            <DropdownMenuItem
                                                key={option.value}
                                                onSelect={() => {
                                                    setInitialType(
                                                        rujukanTypeOption
                                                            ? Number(
                                                                  rujukanTypeOption.value,
                                                              )
                                                            : 1,
                                                    );
                                                    setInitialStatus(
                                                        Number(option.value),
                                                    );
                                                    setResult(postpartum);
                                                    setOpenDialog(true);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                {option.label}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            <Button
                                className="w-full h-auto min-h-10 px-4 py-2 text-sm font-semibold bg-primary hover:bg-teal-700 text-white shadow-sm leading-tight"
                                onClick={() => {
                                    setInitialType(
                                        defaultTypeOption
                                            ? Number(defaultTypeOption.value)
                                            : null,
                                    );
                                    setInitialStatus(
                                        postpartum.result &&
                                            postpartum.result.total_score <= 12
                                            ? 5
                                            : null,
                                    );
                                    setResult(postpartum);
                                    setOpenDialog(true);
                                }}
                            >
                                Simpan Rekam Data
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={() => {
                                setInitialType(null);
                                setInitialStatus(null);
                                setResult(postpartum);
                                setOpenDialog(true);
                            }}
                            className="w-full bg-primary hover:bg-teal-700 text-white shadow-sm text-xs sm:text-sm"
                        >
                            {postpartum.followup ? 'Edit Tindak Lanjut' : 'Tambah Tindak Lanjut +'}
                        </Button>
                    )}
                </div>
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
                        initialType={initialType}
                        initialStatus={initialStatus}
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
