import { router } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Filter } from "@/types";
import { findingValueFilterSelect } from "@/utils/helper";


interface SelectFilterProps<T> {
  title: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  options: any;
  link: string;
  filter: Filter;
}

export default function SelectFilter<T>({ title, direction = 'bottom', link, filter, options }: SelectFilterProps<T>) {

  const { data } = options;
  const { search, only_trash, filter_list } = filter;
  const { select_filter } = filter_list ?? {};


  const filtering = title.toLowerCase();


  // const test = findingValueFilterSelect();

  const selectFilterHandling = (id: string | null) => router.get(route(link), {
    search,
    only_trash,
    [filtering]: id
  }, {
    preserveState: true,
    preserveScroll: true,
    replace: true
  });


  return (
    <Select
      value={select_filter?.[filtering] ?? ''}
      onValueChange={(value) => {

        const handleValue = value === '__reset__' ? null :
          (value === select_filter?.[filtering] ? null : value);

        selectFilterHandling(handleValue);
      }
      }
    >
      <SelectTrigger className="flex gap-2 items-center h-8 w-auto min-w-[100px] px-3 cursor-pointer hover:bg-accent">
        <SelectValue className="w-fit" placeholder={title} />
      </SelectTrigger>
      <SelectContent side={direction}>
        <SelectItem className="cursor-pointer" value={"__reset__"}>
          All
        </SelectItem>

        {data.map((dta: any) => (
          <SelectItem className="cursor-pointer" key={dta.id}
            value={dta.id}
          >
            {dta.name}
          </SelectItem>
        ))}

      </SelectContent>
    </Select>

  );

}