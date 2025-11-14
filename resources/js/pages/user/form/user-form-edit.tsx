import UserFormInformation from "./user-form-information";
import { Extra } from "@/types";
import { useUserAction } from "@/hooks/use-user-action";
import { User } from "@/types/resource";

interface UserFormEditProps {
  extra: Extra;
  user: User;
}

export default function UserFormEdit({ extra, user }: UserFormEditProps) {

  const { roles } = extra;

  const {
    data,
    errors,
    handleInputChange,
    updateUser,
    processing
  } = useUserAction(user);


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
                <UserFormInformation roles={roles.data} data={data} errors={errors} process={processing} handleInputChange={handleInputChange} action={() => updateUser(user.id)} withoutAuth={true} />
              </div>
            </div>


          </div>
        </form>
      </div>
    </section>

  );
}
