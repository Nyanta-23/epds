import { router } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Filter } from "@/types";

interface SelectFilterCanVisitProps {
  title?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  link: string;
  filter: Filter;
}

export default function SelectFilterCanVisit({
  title = "Can Visit",
  direction = "bottom",
  link,
  filter,
}: SelectFilterCanVisitProps) {

  const { search, filter_list } = filter;
  const { select_filter } = filter_list ?? {};
  const { is_verified, is_can_visit } = select_filter ?? {};

  const selectedIsCanVisit = is_can_visit ?? "";

  const selectFilterHandling = (value: string | null) => {
    router.get(route(link), {
      search,
      is_verified,
      is_can_visit: value
    }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  return (
    <Select
      value={
        selectedIsCanVisit === "true" ? "true" : (
          selectedIsCanVisit === "false" ? "false" : "")
      }
      onValueChange={(value) => {
        const handleValue = value === "all" ? null :
          (value === selectedIsCanVisit ? null : value);
        selectFilterHandling(handleValue);
      }}
    >
      <SelectTrigger className="flex gap-2 items-center h-8 w-auto min-w-[120px] px-3 cursor-pointer hover:bg-accent">
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent side={direction}>
        <SelectItem className="cursor-pointer" value="all">All</SelectItem>
        <SelectItem className="cursor-pointer" value="true">Yes</SelectItem>
        <SelectItem className="cursor-pointer" value="false">No</SelectItem>
      </SelectContent>
    </Select>
  );
}
