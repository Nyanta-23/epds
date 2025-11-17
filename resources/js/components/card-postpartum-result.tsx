import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function CardPostpartumResult() {

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg">Result</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-3">

        <div>
          <p className="font-medium">Total Score</p>
          <p className="text-muted-foreground">12</p>
        </div>

        <div>
          <p className="font-medium">Follow-Up Status</p>
          <Badge>Not Counseled</Badge>
        </div>

      </CardContent>
    </Card>
  )
}