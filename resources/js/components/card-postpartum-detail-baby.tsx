import { PostpartumVisit } from "@/types/resource";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table";

interface CardPostpartumDetailBabyProps {
  postpartum: PostpartumVisit;
}

export default function CardPostpartumDetailBaby({ postpartum }: CardPostpartumDetailBabyProps) {

  console.log(postpartum.mother);

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Detail Baby</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <section>
          <Table>
            <TableHeader className='bg-accent'>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead className="text-center">Which Child</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Baby Condition</TableHead>
                <TableHead>Typeof Delivery</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {postpartum.mother.babies.} */}
              <TableRow>

              </TableRow>
            </TableBody>
          </Table>
        </section>
      </CardContent>
    </Card>
  );
}


function CardBaby() {

  return (
    <section>

    </section>
  );

}