import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface RegionOption {
    code: string;
    name: string;
}

interface FacilityOption {
    id: string;
    name: string;
    facility_type: string | null;
}

interface SelectLocationProps {
    value: {
        province: string;
        province_id?: string;
        city_or_district: string;
        city_or_district_id?: string;
        subdistrict: string;
        subdistrict_id?: string;
        village: string;
        village_id?: string;
        facility_id?: string;
    };
    onChange: (value: SelectLocationProps['value']) => void;
    errors?: Record<string, string | undefined>;
    identityErrorClassName?: (field: string) => string;
}

async function fetchOptions<T>(url: string): Promise<T[]> {
    const response = await axios.get<{ data: T[] }>(url);
    return response.data.data;
}

function getSelectValue(value: string | undefined): string {
    return value ? String(value) : '';
}

export default function SelectLocationApi({
    value,
    onChange,
    errors = {},
    identityErrorClassName = () => '',
}: SelectLocationProps) {
    const [provinces, setProvinces] = useState<RegionOption[]>([]);
    const [regencies, setRegencies] = useState<RegionOption[]>([]);
    const [districts, setDistricts] = useState<RegionOption[]>([]);
    const [villages, setVillages] = useState<RegionOption[]>([]);
    const [facilities, setFacilities] = useState<FacilityOption[]>([]);
    const [loading, setLoading] = useState({
        provinces: false,
        regencies: false,
        districts: false,
        villages: false,
        facilities: false,
    });
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        fetchOptions<RegionOption>('/api/v1/region/provinces')
            .then((options) => {
                if (active) {
                    setProvinces(options);
                    setLoadError(null);
                }
            })
            .catch(() => {
                if (active) {
                    setLoadError('Daftar provinsi gagal dimuat. Coba muat ulang halaman.');
                }
            })
            .finally(() => {
                if (active) {
                    setLoading((current) => ({ ...current, provinces: false }));
                }
            });

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (!value.province_id) {
            return;
        }

        let active = true;

        fetchOptions<RegionOption>(
            `/api/v1/region/regencies/${encodeURIComponent(value.province_id)}`,
        )
            .then((options) => {
                if (active) setRegencies(options);
            })
            .catch(() => {
                if (active) {
                    setLoadError('Daftar kabupaten/kota gagal dimuat.');
                }
            })
            .finally(() => {
                if (active) {
                    setLoading((current) => ({ ...current, regencies: false }));
                }
            });

        return () => {
            active = false;
        };
    }, [value.province_id]);

    useEffect(() => {
        if (!value.city_or_district_id) {
            return;
        }

        let active = true;

        Promise.all([
            fetchOptions<RegionOption>(
                `/api/v1/region/districts/${encodeURIComponent(value.city_or_district_id)}`,
            ),
            fetchOptions<FacilityOption>(
                `/api/v1/facilities?regency_id=${encodeURIComponent(value.city_or_district_id)}`,
            ),
        ])
            .then(([districtOptions, facilityOptions]) => {
                if (active) {
                    setDistricts(districtOptions);
                    setFacilities(facilityOptions);
                    setLoadError(null);
                }
            })
            .catch(() => {
                if (active) {
                    setLoadError('Daftar kecamatan atau fasilitas gagal dimuat.');
                }
            })
            .finally(() => {
                if (active) {
                    setLoading((current) => ({
                        ...current,
                        districts: false,
                        facilities: false,
                    }));
                }
            });

        return () => {
            active = false;
        };
    }, [value.city_or_district_id]);

    useEffect(() => {
        if (!value.subdistrict_id) {
            return;
        }

        let active = true;

        fetchOptions<RegionOption>(
            `/api/v1/region/villages/${encodeURIComponent(value.subdistrict_id)}`,
        )
            .then((options) => {
                if (active) setVillages(options);
            })
            .catch(() => {
                if (active) setLoadError('Daftar desa/kelurahan gagal dimuat.');
            })
            .finally(() => {
                if (active) {
                    setLoading((current) => ({ ...current, villages: false }));
                }
            });

        return () => {
            active = false;
        };
    }, [value.subdistrict_id]);

    function handleProvinceChange(id: string) {
        const province = provinces.find((option) => String(option.code) === id);
        setLoading((current) => ({ ...current, regencies: true }));
        onChange({
            province_id: id,
            province: province?.name ?? '',
            city_or_district_id: '',
            city_or_district: '',
            subdistrict_id: '',
            subdistrict: '',
            village_id: '',
            village: '',
            facility_id: '',
        });
    }

    function handleRegencyChange(id: string) {
        const regency = regencies.find((option) => String(option.code) === id);
        setLoading((current) => ({
            ...current,
            districts: true,
            facilities: true,
        }));
        onChange({
            ...value,
            city_or_district_id: id,
            city_or_district: regency?.name ?? '',
            subdistrict_id: '',
            subdistrict: '',
            village_id: '',
            village: '',
            facility_id: '',
        });
    }

    function handleDistrictChange(id: string) {
        const district = districts.find((option) => String(option.code) === id);
        setLoading((current) => ({ ...current, villages: true }));
        onChange({
            ...value,
            subdistrict_id: id,
            subdistrict: district?.name ?? '',
            village_id: '',
            village: '',
        });
    }

    function handleVillageChange(id: string) {
        const village = villages.find((option) => String(option.code) === id);
        onChange({
            ...value,
            village_id: id,
            village: village?.name ?? '',
        });
    }


    return (
        <div className="grid gap-4">
            <div>
                <Label className="mb-2 block text-sm font-medium">
                    Provinsi <span className="text-red-500">*</span>
                </Label>
                <Select
                    onValueChange={handleProvinceChange}
                    value={getSelectValue(value.province_id)}
                    disabled={loading.provinces}
                >
                    <SelectTrigger className={`${identityErrorClassName('province_id')} cursor-pointer`}>
                        <SelectValue placeholder="Pilih provinsi">{value.province || undefined}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {provinces.map((province) => (
                            <SelectItem key={province.code} value={String(province.code)}>
                                {province.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.province_id && <p className="mt-1 text-sm text-red-500">{errors.province_id}</p>}
            </div>

            <div>
                <Label className="mb-2 block text-sm font-medium">
                    Kabupaten / Kota <span className="text-red-500">*</span>
                </Label>
                <Select
                    onValueChange={handleRegencyChange}
                    value={getSelectValue(value.city_or_district_id)}
                    disabled={!value.province_id || loading.regencies}
                >
                    <SelectTrigger className={`${identityErrorClassName('city_or_district_id')} cursor-pointer`}>
                        <SelectValue placeholder="Pilih kabupaten / kota">{value.city_or_district || undefined}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {regencies.map((regency) => (
                            <SelectItem key={regency.code} value={String(regency.code)}>
                                {regency.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.city_or_district_id && <p className="mt-1 text-sm text-red-500">{errors.city_or_district_id}</p>}
            </div>

            <div>
                <Label className="mb-2 block text-sm font-medium">
                    Kecamatan <span className="text-red-500">*</span>
                </Label>
                <Select
                    onValueChange={handleDistrictChange}
                    value={getSelectValue(value.subdistrict_id)}
                    disabled={!value.city_or_district_id || loading.districts}
                >
                    <SelectTrigger className={`${identityErrorClassName('subdistrict_id')} cursor-pointer`}>
                        <SelectValue placeholder="Pilih kecamatan">{value.subdistrict || undefined}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {districts.map((district) => (
                            <SelectItem key={district.code} value={String(district.code)}>
                                {district.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.subdistrict_id && <p className="mt-1 text-sm text-red-500">{errors.subdistrict_id}</p>}
            </div>

            <div>
                <Label className="mb-2 block text-sm font-medium">
                    Desa / Kelurahan <span className="text-red-500">*</span>
                </Label>
                <Select
                    onValueChange={handleVillageChange}
                    value={getSelectValue(value.village_id)}
                    disabled={!value.subdistrict_id || loading.villages}
                >
                    <SelectTrigger className={`${identityErrorClassName('village_id')} cursor-pointer`}>
                        <SelectValue placeholder="Pilih desa / kelurahan">{value.village || undefined}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {villages.map((village) => (
                            <SelectItem key={village.code} value={String(village.code)}>
                                {village.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.village_id && <p className="mt-1 text-sm text-red-500">{errors.village_id}</p>}
            </div>

            <div>
                <Label className="mb-2 block text-sm font-medium">
                    Fasilitas Kesehatan <span className="text-red-500">*</span>
                </Label>
                <Select
                    onValueChange={(facilityId) =>
                        onChange({ ...value, facility_id: facilityId })
                    }
                    value={value.facility_id || ''}
                    disabled={!value.city_or_district_id || loading.facilities}
                >
                    <SelectTrigger className={`${identityErrorClassName('facility_id')} cursor-pointer`}>
                        <SelectValue placeholder="Pilih fasilitas kesehatan" />
                    </SelectTrigger>
                    <SelectContent>
                        {facilities.map((facility) => (
                            <SelectItem key={facility.id} value={facility.id}>
                                {facility.name}
                                {facility.facility_type ? ` (${facility.facility_type})` : ''}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.facility_id && <p className="mt-1 text-sm text-red-500">{errors.facility_id}</p>}
            </div>

            {loadError && <p role="alert" className="text-sm text-red-500">{loadError}</p>}
        </div>
    );
}
