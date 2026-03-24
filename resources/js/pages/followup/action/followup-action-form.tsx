import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Save } from "lucide-react";

interface FollowUpActionFormProps {
  action: () => void;
}

export default function FollowUpActionForm({ action }: FollowUpActionFormProps) {

  return (
    <DialogFooter>
      <Button
        type="button"
        className="inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium cursor-pointer"
        onClick={action}
      >
        <Save className="mr-2 h-4 w-4" /> Simpan
      </Button>
    </DialogFooter>
  );
}