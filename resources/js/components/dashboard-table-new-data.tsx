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
        <CardTitle>Latest Data</CardTitle>
        <CardDescription>Latest postpartum records.</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead>Date Filled</TableHead>
              <TableHead>Risk</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {latest_data.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.name}</TableCell>
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
