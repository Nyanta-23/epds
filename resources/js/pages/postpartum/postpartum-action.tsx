import Search from '@/components/search';
import { Button } from '@/components/ui/button';
import { Filter, Meta } from '@/types';
import { FileDown } from 'lucide-react';

interface PostpartumActionProps {
    filter: Filter;
    meta: Meta;
}

export default function PostpartumAction({
    filter,
    meta,
}: PostpartumActionProps) {
    const { filter_list } = filter;
    const { total } = meta;

    return (
        <section className="grid auto-rows-min gap-4">
            <div className="me-4 flex justify-between">
                <div className="flex items-center gap-4">
                    <Search total={total} link={'postpartum'} filter={filter} />
                </div>

                <div>
                    <Button asChild className="cursor-pointer">
                        <a
                            href={route('postpartum.export', {
                                start_date:
                                    filter_list?.date_filter?.start_date,
                                end_date: filter_list?.date_filter?.end_date,
                            })}
                        >
                            <FileDown />
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
}
