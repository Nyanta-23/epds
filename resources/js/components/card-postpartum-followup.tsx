import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

export default function CardPostpartumFollowUp() {


  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg">Follow Up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">

        <div className="space-y-2">
          <p className="font-medium">Type</p>
          <Badge>Education</Badge>
        </div>

        <div className="space-y-2">
          <p className="font-medium">Notes</p>
          <p className="text-muted-foreground">
            Patient needs weekly mood monitoring.
          </p>
        </div>

        <div className="space-y-2">
          <p className="font-medium">Date Filled</p>
          <p className="text-muted-foreground">2025-11-16</p>
        </div>

        <Separator />

        <Button className="w-full">Add Follow Up</Button>

      </CardContent>
    </Card>
  )
}