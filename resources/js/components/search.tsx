import { SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { Filter } from "@/types";

interface SearchProps {
  filter: Filter;
  total: number;
  link: string;
}

export default function Search({ total, filter, link }: SearchProps) {
  const { only_trash, search, filter_list } = filter;
  const { select_filter, checkbox_filter } = filter_list ?? {};
  const { role } = select_filter ?? {};

  const [querySearch, setQuerySearch] = useState<string>(search ?? "");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {

    const delayDebounce = setTimeout(() => {
      if (querySearch !== "") {
        setIsSearching(true);
        router.get(
          route(link),
          {
            search: querySearch,
            only_trash,
            role
          },
          {
            preserveState: true,
            replace: true,
            onFinish: () => {
              setIsSearching(false);
            }
          }
        )
      } else {
        router.get(
          route(link),
          {
            search: "",
            only_trash,
            role
          },
          {
            preserveState: true,
            replace: true
          }
        );

      }

    }, 500);

    return () => clearTimeout(delayDebounce);

  }, [querySearch]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuerySearch(e.target.value);
  }

  return (
    <InputGroup>
      <InputGroupInput placeholder="Search..." value={querySearch} onChange={handleSearch} />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      {querySearch.length > 0 && (
        <InputGroupAddon align="inline-end">
          {isSearching ? "Searching..." : `${total} results`}
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}