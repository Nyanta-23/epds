import { Button } from "@/components/ui/button";
import { Filter } from "@/types";
import { router } from "@inertiajs/react";
import { Archive, ArchiveRestore } from "lucide-react";


interface BabyTrashActionProps {
  filter: Filter;
  link: string;
}


export default function BabyTrashAction({ filter, link }: BabyTrashActionProps) {

  const { only_trash, search } = filter;

  return (
    <div className="flex shadow-sm gap-1">
      <Button
        className={`h-12 w-14 p-0 rounded-none rounded-t-md cursor-pointer ${!only_trash ? 'bg-muted hover:bg-muted text-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
        onClick={() => router.get(link, {
          only_trash: false,
          search
        }, {
          preserveState: true,
          preserveScroll: true,
          replace: true
        })}
      >
        <Archive style={{ width: 28, height: 28 }} />
      </Button>

      <Button
        className={`h-12 w-14 p-0 rounded-none rounded-t-md cursor-pointer ${only_trash ? 'bg-muted hover:bg-muted text-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
        onClick={() => router.get(link, {
          only_trash: true,
          search
        }, {
          preserveState: true,
          preserveScroll: true,
          replace: true
        })}
      >
        <ArchiveRestore style={{ width: 28, height: 38 }} />
      </Button>
    </div>
  )
}