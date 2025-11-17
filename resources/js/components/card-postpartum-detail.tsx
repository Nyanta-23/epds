import { PostpartumVisit } from "@/types/resource";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface CardPostpartumDetailProps {
  postpartum: PostpartumVisit;
}

export default function CardPostpartumDetail({ postpartum }: CardPostpartumDetailProps) {

  console.log(postpartum);

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Postpartum Detail</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="font-medium">Visit Number</p>
            <p className="text-muted-foreground">{postpartum.visit_number}</p>
          </div>
          <div>
            <p className="font-medium">Date Filled</p>
            <p className="text-muted-foreground">{postpartum.date_filled}</p>
          </div>
          <div>
            <p className="font-medium">Patient Number</p>
            <p className="text-muted-foreground">{postpartum.mother.id}</p>
          </div>

          <div>
            <p className="font-medium">Name</p>
            <p className="text-muted-foreground">{postpartum.mother.name}</p>
          </div>

          <div>
            <p className="font-medium">Place, Date of Birth</p>
            <p className="text-muted-foreground">{`${postpartum.mother.birthplace}, ${postpartum.mother.date_of_birth}`}</p>
          </div>
          <div>
            <p className="font-medium">Job</p>
            <p className="text-muted-foreground">{postpartum.mother.job}</p>
          </div>

          <div>
            <p className="font-medium">Married Status</p>
            <p className="text-muted-foreground">{postpartum.mother.married_status}</p>
          </div>

          <div>
            <p className="font-medium">Highest Education</p>
            <p className="text-muted-foreground">{postpartum.mother.highest_education}</p>
          </div>
        </div>

        <Separator />

        <div className="flex justify-center">

          <div className="flex justify-start w-full">

            <div className="space-y-3">
              <div className="space-y-2">
                <p className="font-medium">Sleep Quality</p>
                <Badge>{postpartum.sleep_quality.label}</Badge>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Live With Partner</p>
                <Badge>{postpartum.live_with_partner ? "Yes" : "No"}</Badge>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Partner Support</p>
                <Badge>{postpartum.partner_support.label}</Badge>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Family Economy Status</p>
                <Badge>{postpartum.family_economy.label}</Badge>
              </div>
            </div>
          </div>

          <div>
            <Separator orientation="vertical" className="mx-4" />
          </div>

          <div className="flex justify-start w-full">
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="font-medium">Mental Health History</p>
                <Badge>{postpartum.psych_history ? "Yes" : "No"}</Badge>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Past Treatment</p>
                <Badge>{postpartum.psych_treatment ? "Yes" : "No"}</Badge>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Trauma History</p>
                <Badge>{postpartum.psych_trauma ? "Yes" : "No"}</Badge>
              </div>
            </div>
          </div>

        </div>


        <Separator />

        <div className="flex justify-center">
          <div className="flex justify-start w-full">

            <div className="space-y-3">
              <div className="space-y-2">
                <p className="font-medium">Parity</p>
                <Badge>{postpartum.parity_count}</Badge>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Pregnancy Complication History</p>
                <Badge>{postpartum.preg_comp_history ? "Yes" : "No"}</Badge>
              </div>

              <p className="font-medium">Last Delivery Complication</p>
              <Badge>{postpartum.last_comp ? "Yes" : "No"}</Badge>
              <div>
                {postpartum.last_comp && postpartum.last_comp_note && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {postpartum.last_comp_note}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Separator orientation="vertical" className="mx-4" />
          </div>

          <div className="flex justify-start w-full">
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="font-medium">Baby Healthy</p>
                <Badge>{postpartum.baby_healthy ? "Yes" : "No"}</Badge>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Baby Caregiver</p>
                <Badge>{postpartum.baby_caregiver ? "Yes" : "No"}</Badge>
              </div>

              <div className="space-y-2">
                <p className="font-medium">Feeding Type</p>
                <Badge>{postpartum.feed_type ? "Yes" : "No"}</Badge>
              </div>
            </div>
          </div>

        </div>


      </CardContent>
    </Card>
  );
}