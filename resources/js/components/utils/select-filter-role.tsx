import { router } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Filter } from "@/types";
import { Role } from "@/types/resource";

interface SelectFilterRoleProps {
  title?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  link: string;
  filter: Filter;
  roles: Role[];
}

export default function SelectFilterRole({
  title = "Role",
  direction = "bottom",
  link,
  filter,
  roles
}: SelectFilterRoleProps) {

  const { search, only_trash, filter_list } = filter;
  const { select_filter } = filter_list ?? {};
  const selectedRole = select_filter?.role ?? "";

  const handleFilter = (role: string | null) => {
    router.get(route(link), {
      search,
      only_trash,
      role: role,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  return (
    <Select
      value={selectedRole}
      onValueChange={(value) => {
        const handleValue =
          value === "all"
            ? null
            : value === selectedRole
            ? null
            : value;

        handleFilter(handleValue);
      }}
    >
      <SelectTrigger className="flex gap-2 items-center h-8 w-auto min-w-[120px] px-3 cursor-pointer hover:bg-accent">
        <SelectValue placeholder={title} />
      </SelectTrigger>

      <SelectContent side={direction}>
        <SelectItem className="cursor-pointer" value="all">All</SelectItem>
        {roles.map((role) => (
          <SelectItem className="cursor-pointer" key={role.id} value={role.slug}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
