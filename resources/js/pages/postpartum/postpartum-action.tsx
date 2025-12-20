import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { Filter, Meta } from "@/types";
import { Link } from "@inertiajs/react";
import { FileDown, History, PlusSquare } from "lucide-react";
import { Role } from "@/types/resource";
import SelectFilterRole from "@/components/utils/select-filter-role";
import { DatePicker } from "@/components/utils/date-picker";
import StartDateEndDate from "@/components/utils/start-date-end-date";

interface PostpartumActionProps {
  filter: Filter;
  meta: Meta;
}

export default function PostpartumAction({ filter, meta }: PostpartumActionProps) {

  const { only_trash, filter_list } = filter;

  const { total } = meta;

  return (
    <section className="grid auto-rows-min gap-4">

      <div className="me-4 flex justify-between">
        <div className="flex items-center gap-10">
          <div>
            <Search total={total} link={'postpartum'} filter={filter} />
          </div>

          <StartDateEndDate link={'postpartum'} filter={filter} />

          {/* <div> */}
          {/* Filter Dropdown Checklist */}
          {/* Filter Date like this link https://dribbble.com/shots/21464805-Filtering-a-data-table-by-Date-Range */}
          {/* </div> */}

        </div>

        <div className="">
          <Button asChild className="cursor-pointer">
            <a href={route("postpartum.export", {
              start_date: filter_list?.date_filter.start_date,
              end_date: filter_list?.date_filter.end_date,
            })}
            >
              <FileDown />
            </a>
          </Button>
        </div>

      </div>

    </section>
  )
}