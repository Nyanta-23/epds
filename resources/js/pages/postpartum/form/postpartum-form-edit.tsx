import { PostpartumVisit } from "@/types/resource";
import { usePostpartumVisitAction } from "@/hooks/use-postpartum-visit-action";
import PostpartumFormInformation from "./postpartum-form-information";
import { PageProp } from "@/types";

interface PostpartumFormEditProps {
  postpartum: PostpartumVisit;
  page_prop: PageProp;
}

export default function PostpartumFormEdit({ postpartum, page_prop }: PostpartumFormEditProps) {

  // const { roles } = extra;

  const {
    data,
    errors,
    processing,
    handleInputChange,
    updatePostpartumVisit
  } = usePostpartumVisitAction(postpartum);

  return (

    <section className="px-6 py-6">
      <div className="mx-auto">
        <form>
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border">
              <div className="border-b px-6 py-4">
                <h3 className="text-lg font-medium">Edit a Postpartum</h3>
                <p className="mt-1 text-sm">Details about Postpartum Visit</p>
              </div>

              <div className="space-y-4 p-6">
                <PostpartumFormInformation data={data} enums={page_prop.enums} errors={errors} process={processing} handleInputChange={handleInputChange} action={() => updatePostpartumVisit(postpartum.id)} />
              </div>
            </div>


          </div>
        </form>
      </div>
    </section>

  );
}
