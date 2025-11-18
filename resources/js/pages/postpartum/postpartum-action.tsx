import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { Filter, Meta } from "@/types";
import { Link } from "@inertiajs/react";
import { History, PlusSquare } from "lucide-react";
import { Role } from "@/types/resource";
import SelectFilterRole from "@/components/utils/select-filter-role";

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
        <div className="flex items-center gap-5">
          <div>
            <Search total={total} link={'user'} filter={filter} />
          </div>
          <div>
            
          </div>

          {/* <div> */}
          {/* Filter Dropdown Checklist */}
          {/* Filter Date like this link https://dribbble.com/shots/21464805-Filtering-a-data-table-by-Date-Range */}
          {/* </div> */}
        </div>
      </div>

    </section>
  )
}