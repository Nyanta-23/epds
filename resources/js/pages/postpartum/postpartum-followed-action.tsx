import { Button } from "@/components/ui/button";
import { Filter } from "@/types";
import { router } from "@inertiajs/react";
import { Archive, ArchiveRestore, Clipboard, ClipboardPenLine } from "lucide-react";


interface PostpartumFollowedActionProps {
  filter: Filter;
  link: string;
}


export default function PostpartumFollowedAction({ filter, link }: PostpartumFollowedActionProps) {

  const { is_followed, search } = filter;

  return (
    <div className="flex shadow-sm gap-1">
      <Button
        className={`h-12 w-14 p-0 rounded-none rounded-t-md cursor-pointer ${!is_followed ? 'bg-muted hover:bg-muted text-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
        onClick={() => router.get(link, {
          is_followed: false,
          search
        }, {
          preserveState: true,
          preserveScroll: true,
          replace: true
        })}
      >
        <Clipboard style={{ width: 28, height: 28 }} />
      </Button>

      <Button
        className={`h-12 w-14 p-0 rounded-none rounded-t-md cursor-pointer ${is_followed ? 'bg-muted hover:bg-muted text-foreground' : 'bg-background text-muted-foreground hover:bg-muted'}`}
        onClick={() => router.get(link, {
          is_followed: true,
          search
        }, {
          preserveState: true,
          preserveScroll: true,
          replace: true
        })}
      >
        <ClipboardPenLine style={{ width: 28, height: 38 }} />
      </Button>
    </div>
  )
}