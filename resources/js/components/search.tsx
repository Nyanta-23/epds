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
  const { select_filter } = filter_list ?? {};
  const { role } = select_filter ?? {};

  const [querySearch, setQuerySearch] = useState<string>(filter.search ?? "");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault(); // cegah reload halaman jika submit form
    setIsSearching(true);

    router.get(
      route(link),
      {
        search: querySearch,
        only_trash,
        role,
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
          placeholder="Search..."
          value={querySearch}
          onChange={(e) => setQuerySearch(e.target.value)}
        />
        <InputGroupAddon align="inline-end">
          {isSearching ? "Searching..." : `${total} results`}
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Button
            type="submit" // <--- tombol submit form
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
