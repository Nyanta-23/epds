import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

export default function CardPostpartumAnswer() {

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Answers</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[260px] pr-2">
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="p-3 rounded-lg border bg-muted/30">
                <p className="font-medium">Question {i + 1}</p>
                <p className="text-muted-foreground text-sm">Answer detail here...</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}