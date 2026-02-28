import { Filter } from '@/types';
import { router } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';

interface SearchProps {
    filter: Filter;
    total: number;
    link: string;
}

export default function Search({ total, filter, link }: SearchProps) {
    const { only_trash, filter_list, preset, risk } = filter;
    const { select_filter, date_filter, search } = filter_list ?? {};
    const { role } = select_filter ?? {};
    const { start_date, end_date } = date_filter ?? {};

    const [querySearch, setQuerySearch] = useState<string>(search ?? '');
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
                preset,
                risk,
                start_date,
                end_date,
            },
            {
                preserveState: true,
                replace: true,
                onFinish: () => setIsSearching(false),
            },
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
                    {isSearching ? 'Mencari' : `${total} hasil`}
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                    <Button
                        type="submit"
                        className="h-fit w-fit cursor-pointer rounded-none"
                        variant="ghost"
                    >
                        <SearchIcon />
                    </Button>
                </InputGroupAddon>
            </InputGroup>
        </form>
    );
}
