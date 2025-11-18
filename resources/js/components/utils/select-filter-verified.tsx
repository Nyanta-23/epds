import { router } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Filter } from "@/types";

interface SelectFilterVerifiedProps {
  title?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  link: string;
  filter: Filter;
}

export default function SelectFilterVerified({
  title = "Verification",
  direction = "bottom",
  link,
  filter,
}: SelectFilterVerifiedProps) {

  const { search, filter_list } = filter;
  const { select_filter } = filter_list ?? {};
  const { is_verified, is_can_visit } = select_filter ?? {};

  const selectedVerified = is_verified;

  const selectFilterHandling = (value: string | null) => {
    router.get(route(link), {
      search,
      is_can_visit,
      is_verified: value,
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  return (
    <Select
      value={
        selectedVerified === "true" ? "true" :
          selectedVerified === "false" ? "false" :
            ""
      }
      onValueChange={(value) => {
        const handleValue = value === "all" ? null :
          (value === selectedVerified ? null : value);
        selectFilterHandling(handleValue);
      }}
    >
      <SelectTrigger className="flex gap-2 items-center h-8 w-auto min-w-[120px] px-3 cursor-pointer hover:bg-accent">
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent side={direction}>
        <SelectItem className="cursor-pointer" value="all">All</SelectItem>
        <SelectItem className="cursor-pointer" value="true">Verified</SelectItem>
        <SelectItem className="cursor-pointer" value="false">Unverified</SelectItem>
      </SelectContent>
    </Select>
  );
}
