import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import roleIdentifier from '@/components/utils/role-identifier';
import { FormUser } from '@/types/form';
import { FacilityOption, Role } from '@/types/resource';
import { ChevronDown } from 'lucide-react';
import UserActionForm from './user-action-form';

type Errors = Partial<Record<keyof FormUser, string>>;

interface UserFormInformationProps {
    roles: Role[];
    facilities: FacilityOption[];
    data: FormUser;
    errors: Errors;
    process: boolean;
    handleInputChange: (
        field: keyof FormUser,
        value: string | number | null,
    ) => void;
    action: () => void;
    withoutAuth?: boolean;
}

export default function UserFormInformation({
    roles,
    facilities,
    data,
    errors,
    process,
    handleInputChange,
    action,
    withoutAuth,
}: UserFormInformationProps) {
    const identityErrorClassName = (field: keyof Errors) => {
        return errors[field] ? 'border-red-500 focus:ring-red-500' : '';
    };
    const isMidwife = roles?.some(
        (role) =>
            role.id.toString() === data.role_id?.toString() &&
            role.slug === 'midwife',
    );

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
                            <PasswordInput
                                label="Password"
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
                                error={errors.password}
                            />
                        </div>
                        <div>
                            <PasswordInput
                                label="Confirm Password"
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
                                error={
                                    errors.password_confirmation ||
                                    errors.password
                                }
                                showError={!!errors.password_confirmation}
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

            <div>
                <Label className="mb-2 block text-sm font-medium">
                    Fasilitas Kesehatan
                    {isMidwife && <span className="text-red-500"> *</span>}
                </Label>
                <Select
                    value={data.facility_id || 'none'}
                    required={isMidwife}
                    onValueChange={(value) =>
                        handleInputChange(
                            'facility_id',
                            value === 'none' ? '' : value,
                        )
                    }
                >
                    <SelectTrigger
                        className={`w-full cursor-pointer ${identityErrorClassName('facility_id')}`}
                    >
                        <SelectValue
                            placeholder={
                                isMidwife
                                    ? 'Pilih fasilitas penugasan'
                                    : 'Pilih fasilitas kesehatan (opsional)'
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {!isMidwife && (
                            <SelectItem value="none">
                                Tidak ditentukan
                            </SelectItem>
                        )}
                        {facilities.map((facility) => (
                            <SelectItem
                                className="cursor-pointer"
                                key={facility.id}
                                value={facility.id}
                            >
                                {facility.name}
                                {facility.facility_type
                                    ? ` — ${facility.facility_type}`
                                    : ''}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.facility_id && (
                    <p className="mt-1 text-sm text-destructive">
                        {errors.facility_id}
                    </p>
                )}
            </div>

            <div className="flex justify-end pt-4">
                <UserActionForm process={process} action={action} />
            </div>
        </div>
    );
}
