import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableContainer, TableEmpty, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Recapitulation } from "@/types/resource";
import { Link } from "@inertiajs/react";
import { Eye } from "lucide-react";


interface props {
  facilities: Recapitulation[];
}
export default function RecapitulationContent({ facilities }: props) {
  return (
    <TableContainer>
      <div className="overflow-x-auto">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4 whitespace-nowrap">
                No
              </TableHead>
              <TableHead className="whitespace-nowrap">
                Nama Fasilitas
              </TableHead>
              <TableHead className="whitespace-nowrap">
                Tipe Fasilitas
              </TableHead>
              <TableHead className="whitespace-nowrap">
                Domisili
              </TableHead>
              <TableHead className="sticky right-0 bg-primary/5 text-right whitespace-nowrap shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.05)]">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facilities[0].children.length === 0 ? (
              <TableEmpty colSpan={5} />
            ) : (
              facilities[0].children.map((facility, index) => (

                <TableRow key={facility.id}>
                  <TableCell className="pl-4 font-medium whitespace-nowrap">
                    {index + 1}
                  </TableCell>
                  <TableCell
                    className={`font-medium whitespace-nowrap ${facility?.name == null ? 'text-center' : ''}`}
                  >
                    {facility?.name ?? '-'}
                  </TableCell>
                  <TableCell
                    className={`font-medium whitespace-nowrap ${facility?.facility_type == null ? 'text-center' : ''}`}
                  >
                    {facility?.facility_type ?? '-'}
                  </TableCell>
                  <TableCell
                    className={`font-medium whitespace-nowrap ${facility?.address == null ? 'text-center' : ''}`}
                  >
                    {facility?.address ?? '-'}
                  </TableCell>

                  <TableCell className="sticky right-0 bg-background shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={
                          facility.id
                            ? route('recapitulation.show', facility.id)
                            : '#'
                        }
                      >
                        <Button
                          size="sm"
                          className="cursor-pointer"
                          disabled={!facility.id}
                        >
                          <Eye />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </TableContainer>
  )
}
