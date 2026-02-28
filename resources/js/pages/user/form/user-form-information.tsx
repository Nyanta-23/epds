import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import roleIdentifier from '@/components/utils/role-identifier';
import { FormUser } from '@/types/form';
import { Region, Role } from '@/types/resource';
import { ChevronDown, Loader2, MapPin } from 'lucide-react';
import UserActionForm from './user-action-form';

type Errors = Partial<Record<keyof FormUser, string>>;

interface UserFormInformationProps {
    roles: Role[];
    provinces: Region[];
    cities: Region[];
    districts: Region[];
    villages: Region[];
    data: FormUser;
    errors: Errors;
    process: boolean;
    loadingRegion?: boolean;
    handleInputChange: (
        field: keyof FormUser,
        value: string | number | null,
    ) => void;
    action: () => void;
    withoutAuth?: boolean;
}

export default function UserFormInformation({
    roles,
    provinces,
    cities,
    districts,
    villages,
    data,
    errors,
    process,
    loadingRegion = false,
    handleInputChange,
    action,
    withoutAuth,
}: UserFormInformationProps) {
    const identityErrorClassName = (field: keyof Errors) => {
        return errors[field] ? 'border-red-500 focus:ring-red-500' : '';
    };

    const selectedRole = roles?.find(
        (r) => r.id.toString() === data.role_id?.toString(),
    );
    const isMidwife =
        selectedRole?.name?.toLowerCase().includes('midwife') ||
        selectedRole?.name?.toLowerCase().includes('bidan');

    return (
        <div className="space-y-4 p-6">
            <div>
                <Label className="mb-2 block text-sm font-medium">
                    Nama <span className="text-red-500">*</span>
                </Label>
                <Input
                    type="text"
                    value={data.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={identityErrorClassName('name')}
                    placeholder="Enter Full Name"
                    required
                    maxLength={200}
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
            </div>

            {!withoutAuth && (
                <>
                    <div>
                        <Label className="mb-2 block text-sm font-medium">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(e) =>
                                handleInputChange('email', e.target.value)
                            }
                            className={identityErrorClassName('email')}
                            placeholder="Enter Email"
                            required
                            maxLength={200}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label className="mb-2 block text-sm font-medium">
                                Password <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    handleInputChange(
                                        'password',
                                        e.target.value,
                                    )
                                }
                                className={identityErrorClassName('password')}
                                placeholder="Enter password"
                                required
                                maxLength={200}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <div>
                            <Label className="mb-2 block text-sm font-medium">
                                Confirm Password{' '}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    handleInputChange(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                className={identityErrorClassName('password')}
                                placeholder="Confirm password"
                                required
                                maxLength={200}
                            />
                        </div>
                    </div>
                </>
            )}

            <div>
                <Label className="mb-2 block text-sm font-medium">
                    Peran <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                    <Select
                        value={data.role_id?.toString()}
                        onValueChange={(value) =>
                            handleInputChange('role_id', value)
                        }
                        required
                    >
                        <SelectTrigger
                            id="role-select"
                            className={`w-full cursor-pointer ${identityErrorClassName('role_id')}`}
                        >
                            <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles &&
                                roles.map((role) => (
                                    <SelectItem
                                        className="cursor-pointer"
                                        key={role.id}
                                        value={role.id.toString()}
                                    >
                                        {roleIdentifier(role.name)}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
                </div>
                {errors.role_id && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.role_id}
                    </p>
                )}
            </div>

            {isMidwife && (
                <div className="mt-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="mb-4 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold text-primary">
                            Wilayah Kerja
                        </h3>
                        {loadingRegion && (
                            <Loader2 className="ml-auto h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Provinsi */}
                        <div>
                            <Label className="mb-2 block text-xs font-medium text-muted-foreground">
                                Provinsi
                            </Label>
                            <Select
                                value={data.province_id?.toString() || ''}
                                onValueChange={(val) =>
                                    handleInputChange('province_id', val)
                                }
                                disabled={
                                    loadingRegion || provinces.length === 0
                                }
                            >
                                <SelectTrigger className="cursor-pointer bg-background">
                                    <SelectValue
                                        placeholder={
                                            provinces.length === 0
                                                ? 'Memuat provinsi...'
                                                : 'Pilih Provinsi'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {provinces.map((p) => (
                                        <SelectItem
                                            className="cursor-pointer"
                                            key={p.id}
                                            value={p.id.toString()}
                                        >
                                            {p.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Kota/Kabupaten */}
                        <div>
                            <Label className="mb-2 block text-xs font-medium text-muted-foreground">
                                Kota / Kabupaten
                            </Label>
                            <Select
                                value={data.regency_id?.toString() || ''}
                                onValueChange={(val) =>
                                    handleInputChange('regency_id', val)
                                }
                                disabled={!data.province_id || loadingRegion}
                            >
                                <SelectTrigger className="cursor-pointer bg-background">
                                    <SelectValue
                                        placeholder={
                                            !data.province_id
                                                ? 'Pilih provinsi dulu'
                                                : loadingRegion
                                                  ? 'Memuat...'
                                                  : 'Pilih Kota/Kab'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {cities.map((c) => (
                                        <SelectItem
                                            className="cursor-pointer"
                                            key={c.id}
                                            value={c.id.toString()}
                                        >
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Kecamatan */}
                        <div>
                            <Label className="mb-2 block text-xs font-medium text-muted-foreground">
                                Kecamatan
                            </Label>
                            <Select
                                value={data.district_id?.toString() || ''}
                                onValueChange={(val) =>
                                    handleInputChange('district_id', val)
                                }
                                disabled={!data.regency_id || loadingRegion}
                            >
                                <SelectTrigger className="cursor-pointer bg-background">
                                    <SelectValue
                                        placeholder={
                                            !data.regency_id
                                                ? 'Pilih kota dulu'
                                                : loadingRegion
                                                  ? 'Memuat...'
                                                  : 'Pilih Kecamatan'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {districts.map((d) => (
                                        <SelectItem
                                            className="cursor-pointer"
                                            key={d.id}
                                            value={d.id.toString()}
                                        >
                                            {d.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Desa / Kelurahan */}
                        <div>
                            <Label className="mb-2 block text-xs font-medium text-muted-foreground">
                                Desa / Kelurahan{' '}
                                <span className="text-destructive">*</span>
                            </Label>
                            <Select
                                value={data.village_id?.toString() || ''}
                                onValueChange={(val) =>
                                    handleInputChange('village_id', val)
                                }
                                disabled={!data.district_id || loadingRegion}
                            >
                                <SelectTrigger
                                    className={`cursor-pointer bg-background ${identityErrorClassName('village_id')}`}
                                >
                                    <SelectValue
                                        placeholder={
                                            !data.district_id
                                                ? 'Pilih kecamatan dulu'
                                                : loadingRegion
                                                  ? 'Memuat...'
                                                  : 'Pilih Desa'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {villages.map((v) => (
                                        <SelectItem
                                            className="cursor-pointer"
                                            key={v.id}
                                            value={v.id.toString()}
                                        >
                                            {v.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.village_id && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.village_id}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end pt-4">
                <UserActionForm process={process} action={action} />
            </div>
        </div>
    );
}
