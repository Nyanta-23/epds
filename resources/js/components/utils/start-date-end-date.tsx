import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/utils/date-picker";
import dayjs from "dayjs";
import { useState } from "react";
import { Filter } from "@/types";
import { RefreshCcw } from "lucide-react";


interface StartDateEndDate {
  link: string;
  filter: Filter;
}

export default function StartDateEndDate({ link, filter }: StartDateEndDate) {


  const { only_trash, filter_list, is_followed, search } = filter;
  const { date_filter } = filter_list ?? {};

  const [startDate, setStartDate] = useState<Date | undefined>(
    date_filter?.start_date
      ? new Date(date_filter.start_date)
      : undefined
  );

  const [endDate, setEndDate] = useState<Date | undefined>(
    date_filter?.end_date
      ? new Date(date_filter.end_date)
      : undefined
  );


  const applyFilter = (start?: Date, end?: Date) => {
    router.get(
      route(link),
      {
        start_date: start ? dayjs(start).format("YYYY-MM-DD") : null,
        end_date: end ? dayjs(end).format("YYYY-MM-DD") : null,
        only_trash,
        is_followed,
        search
      },
      {
        preserveState: true,
        replace: true,

      }
    )
  }

  const resetFilter = () => {
    setStartDate(undefined)
    setEndDate(undefined)

    router.get(
      route("postpartum"),
      {
        start_date: null,
        end_date: null,
        only_trash,
        is_followed,
        search
      },
      {
        preserveState: true,
        replace: true,
      }
    )
  }

  return (
    <div className="flex items-center gap-2">
      <DatePicker
        placeholder="Dari Tanggal"
        value={startDate}
        onChange={(date) => {
          setStartDate(date)
          applyFilter(date, endDate)
        }}
      />

      <DatePicker
        placeholder="Sampai Tanggal"
        value={endDate}
        onChange={(date) => {
          setEndDate(date)
          applyFilter(startDate, date)
        }}
      />

      {(startDate || endDate) && (
        <Button
          className="cursor-pointer"
          type="button"
          onClick={resetFilter}
        >
          <RefreshCcw />
        </Button>
      )}
    </div>
  )
}
