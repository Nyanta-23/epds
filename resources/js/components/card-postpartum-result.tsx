import { PostpartumVisit } from "@/types/resource";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface CardPostpartumResultProps {
  postpartum: PostpartumVisit
}

export default function CardPostpartumResult({postpartum}: CardPostpartumResultProps) {
  console.log(postpartum);
  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg">Result</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-3">

        <div>
          <p className="font-medium">Total Score</p>
          <p className="text-muted-foreground">{postpartum.result?.total_score?? '-'}</p>
        </div>

        <div>
          <p className="font-medium">Follow-Up Status</p>
          <Badge>{postpartum.result?.followup_status.label_id ?? '-'}</Badge>
        </div>

      </CardContent>
    </Card>
  )
}