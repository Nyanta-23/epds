import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, PageProp } from "@/types";
import { PostpartumVisitSingleData } from "@/types/data";
import { Head } from "@inertiajs/react";
import PostpartumDetail from "../postpartum-detail";
import { postpartum } from "@/routes";


interface PostpartumShowProps {
  postpartum: PostpartumVisitSingleData;
  page_prop: PageProp
}

export default function PostpartumShow({postpartum, page_prop}: PostpartumShowProps) {
  const title: string = 'Patient';
  const link: string = '/patient';

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title,
      href: link,
    },
    {
      title: `Show`,
      href: `${link}/${postpartum.data.id}`
    }
  ];


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={title} />

      <section className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <PostpartumDetail postpartum={postpartum.data} page_prop={page_prop} />
      </section>

    </AppLayout>
  );
}