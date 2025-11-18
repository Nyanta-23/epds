import MainFormHeader from "@/components/main/main-form-header";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, PageProp } from "@/types";
import { Head } from "@inertiajs/react";
import { PostpartumVisitSingleData } from "@/types/data";
import PostpartumFormEdit from "../form/postpartum-form-edit";


interface PostpartumEditProps {
  postpartum: PostpartumVisitSingleData;
  page_prop: PageProp;
}

export default function PostpartumEdit({ postpartum, page_prop }: PostpartumEditProps) {

  const title: string = 'Postpartum';
  const link: string = '/Postpartum';

  const subtitle = `Edit ${title}`;
  const desc = `Edity your ${title} Visit`

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title,
      href: link,
    },
    {
      title: `Edit`,
      href: `${link}/${postpartum.data.id}/edit`
    }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={title} />

      <section className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <MainFormHeader subtitle={subtitle} desc={desc} />
        <PostpartumFormEdit postpartum={postpartum.data} page_prop={page_prop}/>
      </section>
    </AppLayout>
  );
}