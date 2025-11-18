
import { Extra, PageProp } from "@/types";
import BabyFormInformation from "./baby-form-information";
import { useBabyAction } from "@/hooks/use-baby-action";

interface BabyFormCreateProps {
  extra: Extra;
  page_prop: PageProp;
}

export default function BabyFormCreate({ extra, page_prop }: BabyFormCreateProps) {


  const { patients } = extra;

  const { enums } = page_prop;
  const {
    data,
    errors,
    handleInputChange,
    createBaby,
    processing
  } = useBabyAction();

  return (
    <section className="px-6 py-6">
      <div className="mx-auto">
        <form>
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border">
              <div className="border-b px-6 py-4">
                <h3 className="text-lg font-medium">Create a Baby</h3>
                <p className="mt-1 text-sm">Details about Baby</p>
              </div>

              <div className="space-y-4 p-6">
                <BabyFormInformation patients={patients.data} enums={enums} data={data} errors={errors} process={processing} handleInputChange={handleInputChange} action={() => createBaby()} />
              </div>
            </div>


          </div>
        </form>
      </div>
    </section>

  );
}
