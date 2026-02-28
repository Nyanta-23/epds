import MainPagination from '@/components/main/main-pagination';
import PostpartumFilter from '@/components/postpartum-filter';
import { Extra, PageProp } from '@/types';
import { PostpartumVisitData } from '@/types/data';
import PostpartumAction from './postpartum-action';
import PostpartumFollowedAction from './postpartum-followed-action';
import PostpartumTable from './postpartum-table';

export interface PostpartumMainContentProps {
    postpartum: PostpartumVisitData;
    extra: Extra;
    page_prop: PageProp;
}

export default function PostpartumMainContent({
    postpartum,
    extra,
    page_prop,
}: PostpartumMainContentProps) {
    const { filter, enums } = page_prop;
    const { meta, data } = postpartum;

    return (
        <>
            {/* ── Filter bar ─────────────────────────────────────────────── */}
            <PostpartumFilter filter={filter} />

            <PostpartumAction filter={filter} meta={meta} />

            <section className="grid auto-rows-min gap-4">
                <section className="w-full">
                    <PostpartumFollowedAction
                        filter={filter}
                        link={'postpartum'}
                    />
                    <PostpartumTable data={data} enums={enums} />

                    <MainPagination meta={meta} filter={filter} />
                </section>
            </section>
        </>
    );
}
