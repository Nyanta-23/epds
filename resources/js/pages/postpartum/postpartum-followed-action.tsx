import { Button } from '@/components/ui/button';
import { Filter } from '@/types';
import { router } from '@inertiajs/react';
import { Clipboard, ClipboardPenLine } from 'lucide-react';

interface PostpartumFollowedActionProps {
    filter: Filter;
    link: string;
}

export default function PostpartumFollowedAction({
    filter,
    link,
}: PostpartumFollowedActionProps) {
    const { is_followed, search, preset, risk, filter_list } = filter;

    const { date_filter } = filter_list ?? {};
    const { start_date, end_date } = date_filter ?? {};

    // Carry all active filter params when toggling the tab
    const sharedParams = { search, preset, risk, start_date, end_date };

    return (
        <div className="flex gap-1 shadow-sm">
            <Button
                className={`h-12 w-14 cursor-pointer rounded-none rounded-t-md p-0 ${!is_followed ? 'bg-muted text-foreground hover:bg-muted' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                onClick={() =>
                    router.get(
                        link,
                        {
                            ...sharedParams,
                            is_followed: false,
                        },
                        {
                            preserveState: true,
                            preserveScroll: true,
                            replace: true,
                        },
                    )
                }
            >
                <Clipboard style={{ width: 28, height: 28 }} />
            </Button>

            <Button
                className={`h-12 w-14 cursor-pointer rounded-none rounded-t-md p-0 ${is_followed ? 'bg-muted text-foreground hover:bg-muted' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                onClick={() =>
                    router.get(
                        link,
                        {
                            ...sharedParams,
                            is_followed: true,
                        },
                        {
                            preserveState: true,
                            preserveScroll: true,
                            replace: true,
                        },
                    )
                }
            >
                <ClipboardPenLine style={{ width: 28, height: 38 }} />
            </Button>
        </div>
    );
}
