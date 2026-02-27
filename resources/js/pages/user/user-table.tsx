import { ButtonConfirmation } from '@/components/button-confirmation';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import roleIdentifier from '@/components/utils/role-identifier';
import { useUserAction } from '@/hooks/use-user-action';
import { Filter } from '@/types';
import { User } from '@/types/resource';
import { Link } from '@inertiajs/react';
import { Pencil, Trash2, Undo2 } from 'lucide-react';

interface UserTableProps {
    data: User[];
    filter: Filter;
}

export default function UserTable({ data, filter }: UserTableProps) {
    const { deleteUser, processingId } = useUserAction();
    const { only_trash } = filter;

    return (
        <section className="overflow-hidden rounded-b-md border border-t-0">
            <div className="overflow-x-auto">
                <Table className="min-w-full text-sm">
                    <TableHeader className="bg-accent">
                        <TableRow>
                            <TableHead className="whitespace-nowrap">
                                Nama
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                                Email
                            </TableHead>
                            <TableHead className="whitespace-nowrap">
                                Peran
                            </TableHead>
                            <TableHead className="sticky right-0 bg-accent text-right whitespace-nowrap shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.08)]">
                                Aksi
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium whitespace-nowrap">
                                    {user.name}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {user.email}
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    {roleIdentifier(user.role.name)}
                                </TableCell>

                                <TableCell className="sticky right-0 bg-background shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.08)]">
                                    <div className="flex justify-end gap-2">
                                        {!only_trash ? (
                                            <>
                                                <Link
                                                    href={route(
                                                        'user.edit',
                                                        user.id,
                                                    )}
                                                >
                                                    <Button
                                                        size="sm"
                                                        className="cursor-pointer"
                                                    >
                                                        <Pencil />
                                                    </Button>
                                                </Link>

                                                <ButtonConfirmation
                                                    content={{
                                                        title: 'Apa kamu yakin?',
                                                        description:
                                                            'Menghapus pengguna ini?',
                                                    }}
                                                    onConfirm={() =>
                                                        deleteUser(user.id)
                                                    }
                                                >
                                                    <Button
                                                        size="sm"
                                                        disabled={
                                                            processingId ===
                                                            user.id
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        {processingId ==
                                                        user.id ? (
                                                            <Spinner />
                                                        ) : (
                                                            <Trash2 />
                                                        )}
                                                    </Button>
                                                </ButtonConfirmation>
                                            </>
                                        ) : (
                                            <Button
                                                size="sm"
                                                className="cursor-pointer"
                                            >
                                                <Undo2 />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}
