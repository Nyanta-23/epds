import { ButtonConfirmation } from "@/components/button-confirmation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "@inertiajs/react";
import { Save } from "lucide-react";

interface UserActionFormProps {
  process: boolean;
  action: () => void;
}

export default function UserActionForm({ process, action }: UserActionFormProps) {

  return (
    <div className="flex items-center justify-start space-x-3 pt-6">
      {process ? (
        <div className="flex items-center gap-2">
          <Spinner /> Loading...
        </div>
      ) : (<>
        <Link href={route('user')}>
          <Button className="rounded-md border px-6 py-2 text-sm font-medium cursor-pointer bg-transparent text-foreground border-foreground hover:bg-accent">
            Cancel
          </Button>
        </Link>

        <ButtonConfirmation
          content={{
            title: 'Are you sure?',
            description: 'This will create and publish the user'
          }}
          onConfirm={action}
        >
          <Button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium cursor-pointer"
          >

            <Save className="mr-2 h-4 w-4" /> Save & Publish
          </Button>
        </ButtonConfirmation>
      </>)}
    </div>
  );
}