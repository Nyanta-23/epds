import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, PageProp } from "@/types";
import { PostpartumVisitSingleData } from "@/types/data";
import { Head } from "@inertiajs/react";
import PostpartumDetail from "../postpartum-detail";
import { postpartum } from "@/routes";
import { Baby } from "@/types/resource";

interface BabyProp {
  data: Baby
}

interface PostpartumShowProps {
  baby: BabyProp,
  postpartum: PostpartumVisitSingleData;
  page_prop: PageProp
}

export default function PostpartumShow({postpartum, baby, page_prop}: PostpartumShowProps) {
  const title: string = 'List Hasil Deteksi Dini';
  const link: string = '/postpartum';

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title,
      href: link,
    },
    {
      title: `Detail Hasil Deteksi Dini`,
      href: `${link}/${postpartum.data.id}`
    }
  ];


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={title} />

      <section className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <PostpartumDetail baby={baby.data} postpartum={postpartum.data} page_prop={page_prop} />
      </section>

    </AppLayout>
  );
}