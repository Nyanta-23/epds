import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface DashboardTableNewDataProps {
  latest_data: {
    number_patient: string;
    name: string;
    date_filled: string;
    risk: string;
  }[];
}

export default function DashboardTableNewData({ latest_data }: DashboardTableNewDataProps) {

  // console.log(latest_data);

  return (
    <Card className="flex flex-col gap-5">
      <CardHeader className="pb-0">
        <CardTitle>Data Terbaru</CardTitle>
        <CardDescription>Data terbaru dari pospartum</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nomor Pasien</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Tanggal Diisi</TableHead>
              <TableHead>Resiko</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {latest_data.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.number_patient}</TableCell>
                <TableCell >{item.name}</TableCell>
                <TableCell>{item.date_filled}</TableCell>
                <TableCell>{item.risk}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
