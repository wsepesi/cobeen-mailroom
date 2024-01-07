import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "./ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { DashboardLogged } from "@/lib/types"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TablePackage = Omit<DashboardLogged, "packageId">

export const columns: ColumnDef<TablePackage>[] = [
  {
    accessorKey: "name",
    header: "Student Name",
  },
  {
    accessorKey: "email",
    header: "Student Email",
  },
  {
    accessorKey: "studentId",
    header: "Student ID",
  },
  {
    accessorKey: "provider",
    header: "Package Provider",
  },
  {
    accessorKey: "ingestedTime",
    header: ({ column }) => {
        return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="justify-start flex flex-row items-center"
            >
              Delivery Time
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
    },
    cell: ({ row }) => {
        const date = row.getValue("ingestedTime") as string
        return new Date(date).toLocaleString()
    }
  },
  {
    accessorKey: "retrievedTime",
    header: "Pickup Time",
  },
]
