
import { RoleData, UserData } from "@/types/data";
import RoleTable from "./role-table";

export interface RoleMainContentProps {
  role: RoleData;
}

export default function RoleMainContent({ role }: RoleMainContentProps) {

  // const { filter } = page_prop;
  const { meta, data } = role;


  // const { roles } = extra;


  return (
    <>
      {/* <UserAction roles={roles.data} filter={filter} meta={meta} /> */}

      <section className="grid auto-rows-min gap-4">
        <section className="w-full">

          {/* <UserTrashAction link={meta.path} filter={filter} /> */}

          {/* <UserTable data={data} filter={filter} /> */}

          {/* <MainPagination meta={meta} filter={filter} /> */}

          <RoleTable data={data}/>

        </section>
      </section>
    </>
  )
}