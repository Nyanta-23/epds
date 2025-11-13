import UserTable from "./user-table";
import { Extra, PageProp } from "@/types";
import { UserData } from "@/types/data";
import MainPagination from "@/components/main/main-pagination";
import UserAction from "./user-action";
import UserTrashAction from "./user-trash-action";

export interface UserMainContentProps {
  user: UserData;
  extra: Extra;
  page_prop: PageProp;
}

export default function UserMainContent({ user, extra, page_prop }: UserMainContentProps) {

  const { filter } = page_prop;
  const { meta, data } = user;


  const { roles } = extra;
  

  return (
    <>
      <UserAction roles={roles.data} filter={filter} meta={meta} />

      <section className="grid auto-rows-min gap-4">
        <section className="w-full">

          <UserTrashAction link={meta.path} filter={filter} />

          <UserTable data={data} filter={filter} />

          <MainPagination meta={meta} filter={filter} />

        </section>
      </section>
    </>
  )
}