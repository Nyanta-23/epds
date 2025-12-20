import { SearchIcon } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Filter } from "@/types";
import { Button } from "./ui/button";

interface SearchProps {
  filter: Filter;
  total: number;
  link: string;
}

export default function Search({ total, filter, link }: SearchProps) {
  const { only_trash, filter_list } = filter;
  const { select_filter, date_filter, search } = filter_list ?? {};
  const { role } = select_filter ?? {};
  const {start_date, end_date} = date_filter ?? {};

  const [querySearch, setQuerySearch] = useState<string>(search ?? "");
  const [isSearching, setIsSearching] = useState<boolean>(false);


  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSearching(true);

    router.get(
      route(link),
      {
        search: querySearch,
        only_trash,
        role,
        start_date,
        end_date,
      },
      {
        preserveState: true,
        replace: true,
        onFinish: () => setIsSearching(false),
      }
    );
  };

  return (
    <form onSubmit={handleSearch}>
      <InputGroup>
        <InputGroupInput
          placeholder="Cari pengguna..."
          value={querySearch}
          onChange={(e) => setQuerySearch(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          {isSearching ? "Mencari" : `${total} hasil`}
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Button
            type="submit"
            className="cursor-pointer w-fit h-fit rounded-none"
            variant="ghost"
          >
            <SearchIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}
