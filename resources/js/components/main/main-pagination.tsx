import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Filter, Meta } from "@/types";
import { router } from "@inertiajs/react";

interface MainPaginationProps {
  meta: Meta;
  filter: Filter;
}


export default function MainPagination({ meta, filter }: MainPaginationProps) {

  const { from, to, total, current_page, last_page, path, per_page } = meta;

  const { only_trash } = filter;

  const siblingCount = 2;

  const numberPag = () => {

    const listNumber = [];

    let startPage = Math.max(1, current_page - siblingCount);
    let endPage = Math.min(last_page, current_page + siblingCount);

    if (current_page - siblingCount < 1) endPage = Math.min(last_page, 1 + siblingCount * 2);
    if (current_page + siblingCount > last_page) startPage = Math.max(1, last_page - siblingCount * 2);


    for (let i = startPage; i <= endPage; i++) {
      const isCurrentPage = i === current_page;

      listNumber.push(
        <Button
          key={i}
          disabled={isCurrentPage}
          onClick={() => router.get(path, {
            page: i,
            only_trash
          }, {
            preserveScroll: true,
            preserveState: true,
            replace: true
          }
          )}
          variant="outline"
          size="icon"
          className={`size-8 cursor-pointer`}
        >
          {i}
        </Button>
      );

    }
    return (
      <>
        {listNumber}
      </>
    );
  }


  const totalPages = Math.ceil(total / per_page);


  return (
    <section className="flex items-center justify-between px-2 mt-5">
      <div className="text-muted-foreground flex-1 text-sm">Showing {from ?? 0} - {to ?? 0} of {total} items</div>

      {/* <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rows per page</p>
        <Select>
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={"50"} />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem value='50'>
              50
            </SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      {
        (totalPages <= 1) ? (<></>) : (
          <>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {current_page} of {last_page}
            </div>

            <div className="flex items-center space-x-2">

              <Button
                variant="outline"
                size="icon"
                className={`size-8 cursor-pointer ${(current_page === 1) || (current_page <= siblingCount) ? '!hidden' : ''} lg:flex`}
                disabled={current_page === 1 || current_page <= siblingCount}
                onClick={() => router.get(
                  path,
                  { page: 1, only_trash },
                  { preserveState: true, preserveScroll: true, replace: true }
                )}
              >
                <span className="sr-only">Go to first page </span>
                <ChevronsLeft />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={`size-8 cursor-pointer ${current_page === 1 ? 'hidden' : ''}`}
                disabled={current_page === 1}
                onClick={() => router.get(
                  path,
                  { page: current_page - 1, only_trash },
                  { preserveState: true, preserveScroll: true, replace: true }
                )}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft />
              </Button>

              {numberPag()}

              <Button
                variant="outline"
                size="icon"
                className={`size-8 cursor-pointer ${current_page === last_page ? 'hidden' : ''}`}
                disabled={current_page === last_page}
                onClick={() => router.get(
                  path,
                  { page: current_page + 1, only_trash },
                  { preserveState: true, preserveScroll: true, replace: true }
                )}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className={`size-8 cursor-pointer lg:flex ${(current_page === last_page) || (current_page >= siblingCount) ? '!hidden' : ''}`}
                disabled={current_page === last_page || current_page >= siblingCount}
                onClick={() => router.get(
                  path,
                  { page: last_page, only_trash },
                  { preserveState: true, preserveScroll: true, replace: true }
                )}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight />
              </Button>
            </div>
          </>
        )
      }


    </section>
  );
}