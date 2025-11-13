import Search from "@/components/search";
import { Filter, Meta } from "@/types";

import SelectFilterIsVerified from "@/components/utils/select-filter-verified";
import SelectFilterCanVisit from "@/components/utils/select-filter-can-visit";

interface UserActionProps {
  filter: Filter;
  meta: Meta;
}

export default function UserAction({ filter, meta }: UserActionProps) {

  const { total } = meta;

  return (
    <section className="grid auto-rows-min gap-4">

      <div className="me-4 flex justify-between">
        <div className="flex items-center gap-5">
          <div>
            <Search total={total} link={'patient'} filter={filter} />
          </div>
          <div>
            <SelectFilterIsVerified filter={filter} link={'patient'} />
          </div>
          <div>
            <SelectFilterCanVisit filter={filter} link={'patient'} />
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