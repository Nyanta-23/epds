import SelectFilter from "@/components/select-filter";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { Extra, Filter, Meta } from "@/types";
import { Link } from "@inertiajs/react";
import { History, PlusSquare } from "lucide-react";
import { Role } from "@/types/resource";

interface UserActionProps {
  filter: Filter;
  meta: Meta;
  role: Role[];
}

export default function UserAction({ filter, meta, role }: UserActionProps) {

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
            <SelectFilter title="Role" options={role} link={'user'} filter={filter} />
          </div>

          {/* <div> */}
          {/* Filter Dropdown Checklist */}
          {/* Filter Date like this link https://dribbble.com/shots/21464805-Filtering-a-data-table-by-Date-Range */}
          {/* </div> */}
        </div>
        <div>
          {!only_trash ? (
            <>
              <Link href={route('user.create')}>
                <Button className='cursor-pointer'>
                  <PlusSquare />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button className='cursor-pointer'>
                Backup
                <History />
              </Button>
            </>
          )}


        </div>
      </div>

    </section>
  )
}