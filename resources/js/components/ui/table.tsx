import * as React from "react"

import { cn } from "@/lib/utils"
import { SearchX } from "lucide-react"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

/* TableContainer — rounded card shell used by every page table */
function TableContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="table-container-card"
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border/60 shadow-sm",
        className,
      )}
      {...props}
    />
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b bg-primary/5 [&_tr]:border-primary/10", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b border-border/50 transition-colors hover:bg-primary/[0.03] data-[state=selected]:bg-primary/10",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-primary/80 h-10 px-2 text-left align-middle text-xs font-semibold tracking-wide whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

/* TableEmpty — empty-state row shown when data.length === 0 */
function TableEmpty({
  colSpan = 999,
  message = "Data tidak ditemukan",
}: {
  colSpan?: number;
  message?: string;
}) {
  return (
    <tr data-slot="table-empty">
      <td colSpan={colSpan} className="py-14 text-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <SearchX className="size-5 text-primary/60" />
          </span>
          <p className="text-sm font-medium">{message}</p>
          <p className="text-xs text-muted-foreground/60">
            Coba ubah kata kunci pencarian atau filter yang digunakan
          </p>
        </div>
      </td>
    </tr>
  )
}

export {
  Table,
  TableContainer,
  TableEmpty,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
