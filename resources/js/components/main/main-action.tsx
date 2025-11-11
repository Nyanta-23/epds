import { SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Button } from "../ui/button";

export default function MainAction() {
  return (
    <section className="grid auto-rows-min gap-4">

      <div className="me-4 flex justify-between">
        <div>
          <div>
            <InputGroup>
              <InputGroupInput placeholder="Search..." />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
          </div>
          {/* <div> */}
          {/* Filter Dropdown Checklist */}
          {/* Filter Date like this link https://dribbble.com/shots/21464805-Filtering-a-data-table-by-Date-Range */}
          {/* </div> */}
        </div>
        <div>
          <Button className='cursor-pointer'>Create</Button>
        </div>
      </div>

    </section>
  )
}