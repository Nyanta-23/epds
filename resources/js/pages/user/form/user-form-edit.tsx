import { useUserAction } from '@/hooks/use-user-action';
import { User, UserManagementExtra } from '@/types/resource';
import UserFormInformation from './user-form-information';

interface UserFormEditProps {
    extra: UserManagementExtra;
    user: User;
}

export default function UserFormEdit({ extra, user }: UserFormEditProps) {
    const { roles, facilities } = extra;

    const { data, errors, handleInputChange, updateUser, processing } =
        useUserAction(user);

    return (
        <section className="px-6 py-6">
            <div className="mx-auto">
                <form>
                    <div className="space-y-6 lg:col-span-2">
                        <div className="rounded-lg border">
                            <div className="border-b px-6 py-4">
                                <h3 className="text-lg font-medium">
                                    Edit pengguna.
                                </h3>
                                <p className="mt-1 text-sm">Data pengguna</p>
                            </div>

                            <div className="space-y-4 p-6">
                                <UserFormInformation
                                    roles={roles.data}
                                    facilities={facilities}
                                    data={data}
                                    errors={errors}
                                    process={processing}
                                    handleInputChange={handleInputChange}
                                    action={() => updateUser(user.id)}
                                    withoutAuth={true}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}
