import { useRegion } from '@/hooks/use-region';
import { useUserAction } from '@/hooks/use-user-action';
import { Extra } from '@/types';
import { FormUser } from '@/types/form';
import { User } from '@/types/resource';
import { useEffect } from 'react';
import UserFormInformation from './user-form-information';

interface UserFormEditProps {
    extra: Extra;
    user: User;
}

export default function UserFormEdit({ extra, user }: UserFormEditProps) {
    const { roles } = extra;

    useEffect(() => {
        onProvinceChange(user.province_id);
        onCityChange(user.regency_id);
        onDistrictChange(user.district_id);
    }, []);

    const { data, errors, handleInputChange, updateUser, processing } =
        useUserAction(user);

    const {
        regions: { provinces, cities, districts, villages },
        handlers: { onProvinceChange, onCityChange, onDistrictChange },
        loading,
    } = useRegion();

    const onFieldChange = (
        field: keyof FormUser,
        value: string | number | null,
    ) => {
        handleInputChange(field, value);

        const strValue = value?.toString() ?? '';

        if (field === 'province_id') {
            onProvinceChange(strValue);
            handleInputChange('regency_id', null);
            handleInputChange('district_id', null);
            handleInputChange('village_id', null);
        } else if (field === 'regency_id') {
            onCityChange(strValue);
            handleInputChange('district_id', null);
            handleInputChange('village_id', null);
        } else if (field === 'district_id') {
            onDistrictChange(strValue);
            handleInputChange('village_id', null);
        }
    };

    return (
        <section className="px-6 py-6">
            <div className="mx-auto">
                <form>
                    <div className="space-y-6 lg:col-span-2">
                        <div className="rounded-lg border">
                            <div className="border-b px-6 py-4">
                                <h3 className="text-lg font-medium">
                                    Edit a User
                                </h3>
                                <p className="mt-1 text-sm">
                                    Details about User
                                </p>
                            </div>

                            <div className="space-y-4 p-6">
                                <UserFormInformation
                                    provinces={provinces}
                                    cities={cities}
                                    districts={districts}
                                    villages={villages}
                                    roles={roles.data}
                                    data={data}
                                    errors={errors}
                                    process={processing}
                                    handleInputChange={onFieldChange}
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
