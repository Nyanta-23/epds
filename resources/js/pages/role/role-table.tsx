import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import roleIdentifier from '@/components/utils/role-identifier';
import { useUserAction } from '@/hooks/use-user-action';
import { Role } from '@/types/resource';

interface RoleTableProps {
    data: Role[];
}

export default function RoleTable({ data }: RoleTableProps) {
    const { deleteUser, processingId } = useUserAction();
    // const { only_trash } = filter;

    return (
        <TableContainer>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="pl-4">Nama</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((role) => (
                        <TableRow key={role.id}>
                            <TableCell className="pl-4 font-medium">
                                {roleIdentifier(role.name)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
