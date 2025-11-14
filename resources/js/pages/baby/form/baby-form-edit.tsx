import { Extra, PageProp } from "@/types";
import { Baby } from "@/types/resource";
import { useBabyAction } from "@/hooks/use-baby-action";
import BabyFormInformation from "./baby-form-information";

interface BabyFormEditProps {
  baby: Baby;
  extra: Extra;
  page_prop: PageProp;
}

export default function BabyFormEdit({ extra, page_prop, baby }: BabyFormEditProps) {

  const { patients } = extra;

  const { enums } = page_prop;

  const {
    data,
    errors,
    handleInputChange,
    updateBaby,
    processing
  } = useBabyAction(baby);


  return (

    <section className="px-6 py-6">
      <div className="mx-auto">
        <form>
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border">
              <div className="border-b px-6 py-4">
                <h3 className="text-lg font-medium">Edit a User</h3>
                <p className="mt-1 text-sm">Details about User</p>
              </div>

              <div className="space-y-4 p-6">
                <BabyFormInformation data={data} enums={enums} patients={patients.data} errors={errors} process={processing} handleInputChange={handleInputChange} action={() => updateBaby(baby.id)} />
              </div>
            </div>


          </div>
        </form>
      </div>
    </section>

  );
}
