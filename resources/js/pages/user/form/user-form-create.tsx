import { useRegion } from '@/hooks/use-region';
import { useUserAction } from '@/hooks/use-user-action';
import { Extra } from '@/types';
import { FormUser } from '@/types/form';
import UserFormInformation from './user-form-information';

interface UserFormCreateProps {
    extra: Extra;
}

export default function UserFormCreate({ extra }: UserFormCreateProps) {
    const { roles } = extra;

    const { data, errors, handleInputChange, createUser, processing } =
        useUserAction();

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
            const province = provinces.find((r) => r.id == strValue)
            onProvinceChange(strValue);
            handleInputChange('province', province?.name ?? '');
            handleInputChange('regency_id', null);
            handleInputChange('district_id', null);
            handleInputChange('village_id', null);
        } else if (field === 'regency_id') {
            const regencies = cities.find((r) => r.id == strValue);
            onCityChange(strValue);
            handleInputChange('regency', regencies?.name ?? '');
            handleInputChange('district_id', null);
            handleInputChange('village_id', null);
        } else if (field === 'district_id') {
            const district = districts.find((r) => r.id == strValue);
            onDistrictChange(strValue);
            handleInputChange('district', district?.name ?? '');
            handleInputChange('village_id', null);
        } else {
            const village = villages.find((v) => v.id === strValue);
            handleInputChange('village_id', strValue);
            handleInputChange('village', village?.name ?? '');
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
                                    Create a User
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
                                    process={processing || loading}
                                    handleInputChange={onFieldChange}
                                    action={() => createUser()}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}
