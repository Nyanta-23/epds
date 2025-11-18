import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormUser } from "@/types/form";
import { ChevronDown } from "lucide-react";
import UserActionForm from "./user-action-form";
import { Role } from "@/types/resource";

type Errors = Partial<Record<keyof FormUser, string>>;


interface UserFormInformationProps {
  roles: Role[];
  data: FormUser;
  errors: Errors;
  process: boolean;
  handleInputChange: (field: keyof FormUser, value: string | number | null) => void;
  action: () => void;
  withoutAuth?: boolean;
}

export default function UserFormInformation({ roles, data, errors, process, handleInputChange, action, withoutAuth }: UserFormInformationProps) {

  const identityErrorClassName = (field: keyof Errors) => {
    return errors[field] ? 'border-red-500 focus:ring-red-500' : '';
  }

  return (
    <div className="space-y-4 p-6">
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Name <span className="text-red-500">*</span>
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
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
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
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={identityErrorClassName('email')}
              placeholder="Enter Email"
              required
              maxLength={200}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </Label>
            <Input
              type="password"
              value={data.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={identityErrorClassName('password')}
              placeholder="Enter your password"
              required
              maxLength={200}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>
          <div>
            <Label className="mb-2 block text-sm font-medium">
              Password Confirmation <span className="text-red-500">*</span>
            </Label>
            <Input
              type="password"
              value={data.password_confirmation}
              onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
              className={identityErrorClassName('password')}
              placeholder="Confirm your password"
              required
              maxLength={200}
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>
        </>
      )}

      <div>
        <Label className="mb-2 block text-sm font-medium">
          Role <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Select value={data.role_id}
            onValueChange={(value) => handleInputChange('role_id', value)}
            required
          >
            <SelectTrigger id="role-select" className={`w-full cursor-pointer ${identityErrorClassName('role_id')}`}>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>

            <SelectContent>
              {roles && roles.map((data) => (
                <SelectItem className="cursor-pointer" key={data.id} value={data.id}>
                  {data.name}
                </SelectItem>
              ))}
            </SelectContent>

          </Select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />

        </div>
        {errors.role_id && <p className="mt-1 text-sm text-red-500">{errors.role_id}</p>}
      </div>

      <div className="flex justify-end">
        <UserActionForm process={process} action={action} />
      </div>
    </div>
  )
}