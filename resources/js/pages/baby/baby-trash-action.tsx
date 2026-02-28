import { Button } from '@/components/ui/button';
import { Filter } from '@/types';
import { router } from '@inertiajs/react';
import { Archive, ArchiveRestore } from 'lucide-react';

interface BabyTrashActionProps {
    filter: Filter;
    link: string;
}

export default function BabyTrashAction({
    filter,
    link,
}: BabyTrashActionProps) {
    const { only_trash, search } = filter;

    return (
        <div className="mb-2 flex gap-1">
            <Button
                className={`h-9 cursor-pointer gap-1.5 rounded-lg px-3 text-xs ${!only_trash ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                onClick={() =>
                    router.get(
                        link,
                        {
                            only_trash: false,
                            search,
                        },
                        {
                            preserveState: true,
                            preserveScroll: true,
                            replace: true,
                        },
                    )
                }
            >
                <Archive className="size-3.5" />
                Aktif
            </Button>

            <Button
                className={`h-9 cursor-pointer gap-1.5 rounded-lg px-3 text-xs ${only_trash ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                onClick={() =>
                    router.get(
                        link,
                        {
                            only_trash: true,
                            search,
                        },
                        {
                            preserveState: true,
                            preserveScroll: true,
                            replace: true,
                        },
                    )
                }
            >
                <ArchiveRestore className="size-3.5" />
                Arsip
            </Button>
        </div>
    );
}
