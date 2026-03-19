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

    const { data, errors, handleInputChange, updateUser, processing } =
        useUserAction(user);

    const {
        regions: { provinces, cities, districts, villages },
        handlers: { onProvinceChange, onCityChange, onDistrictChange },
        loading,
    } = useRegion()
    

    useEffect(() => {
        const initializeRegions = async () => {
            if (user.province_id) {
                await onProvinceChange(user.province_id);
            }
            if (user.regency_id) {
                await onCityChange(user.regency_id);
            }
            if (user.district_id) {
                await onDistrictChange(user.district_id);
            }
        };
        initializeRegions();
    }, []);
    
    useEffect(() => {
        const isMidwife = roles.data.some(
            (r) =>
                r.id.toString() === data.role_id?.toString() &&
                (r.name.toLowerCase().includes('midwife') ||
                    r.name.toLowerCase().includes('bidan')),
        );

        if (isMidwife && data.province_id) {
            const initializeRegionsForRoleChange = async () => {
                await onProvinceChange(data.province_id!);
                if (data.regency_id) {
                    await onCityChange(data.regency_id);
                }
                if (data.district_id) {
                    await onDistrictChange(data.district_id);
                }
            };
            initializeRegionsForRoleChange();
        }
    }, [data.role_id]);

    // Sync text field values with ID fields when regions are loaded or IDs change
    useEffect(() => {
        if (provinces.length > 0 && data.province_id) {
            const province = provinces.find(
                (p) => p.id.toString() === data.province_id?.toString(),
            );
            if (province) {
                handleInputChange('province', province.name);
            }
        }
    }, [data.province_id, provinces.length]);

    useEffect(() => {
        if (cities.length > 0 && data.regency_id) {
            const city = cities.find(
                (c) => c.id.toString() === data.regency_id?.toString(),
            );
            if (city) {
                handleInputChange('city_or_district', city.name);
            }
        }
    }, [data.regency_id, cities.length]);

    useEffect(() => {
        if (districts.length > 0 && data.district_id) {
            const district = districts.find(
                (d) => d.id.toString() === data.district_id?.toString(),
            );
            if (district) {
                handleInputChange('subdistrict', district.name);
            }
        }
    }, [data.district_id, districts.length]);

    useEffect(() => {
        if (villages.length > 0 && data.village_id) {
            const village = villages.find(
                (v) => v.id.toString() === data.village_id?.toString(),
            );
            if (village) {
                handleInputChange('village', village.name);
            }
        }
    }, [data.village_id, villages.length]);

    const onFieldChange = (
        field: keyof FormUser,
        value: string | number | null,
    ) => {
        handleInputChange(field, value);

        const strValue = value?.toString() ?? '';

        if (field === 'role_id') {
            // Role change - don't clear region data, let useEffect handle region initialization
            return;
        } else if (field === 'province_id') {
            const province = provinces.find((r) => r.id == strValue);
            if (province) {
                handleInputChange('province', province.name);
            }
            onProvinceChange(strValue);
            handleInputChange('regency_id', null);
            handleInputChange('district_id', null);
            handleInputChange('village_id', null);
        } else if (field === 'regency_id') {
            const regencies = cities.find((r) => r.id == strValue);
            if (regencies) {
                handleInputChange('regency', regencies.name);
            }
            onCityChange(strValue);
            handleInputChange('district_id', null);
            handleInputChange('village_id', null);
        } else if (field === 'district_id') {
            const district = districts.find((r) => r.id == strValue);
            if (district) {
                handleInputChange('district', district.name);
            }
            onDistrictChange(strValue);
            handleInputChange('village_id', null);
        } else if (field === 'village_id') {
            const village = villages.find((v) => v.id === strValue);
            if (village) {
                handleInputChange('village', village.name);
            }
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
                                    Edit pengguna.
                                </h3>
                                <p className="mt-1 text-sm">Data pengguna</p>
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
                                    loadingRegion={loading}
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
