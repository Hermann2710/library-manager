"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    loading?: boolean
}

/**
 * DataTable Component:
 * A headless table wrapper powered by TanStack Table.
 * Provides a consistent look for all administrative lists in LibManager.ai.
 */
export function DataTable<TData, TValue>({
    columns,
    data,
    loading,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    /**
     * Skeleton Loading State:
     * Mimics the final table structure to reduce layout shift during data fetching.
     */
    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="rounded-[2rem] border border-border/40 p-1 bg-card/30">
                    <div className="h-12 w-full bg-muted/40 rounded-t-[2rem]" />
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex gap-4 p-4 border-t border-border/20">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-10 flex-1 rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* TABLE CONTAINER: Using high-radius rounding for a modern identity */}
            <div className="rounded-[2.5rem] border border-border/40 bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-border/20">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="h-14 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 px-6"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-primary/2 transition-colors border-border/10 group"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-6 py-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-40 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2 opacity-30">
                                        <Inbox className="h-10 w-10" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Aucun résultat trouvé</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINATION: Controls with custom styling */}
            <div className="flex items-center justify-between px-4">
                <div className="text-muted-foreground text-[10px] font-black uppercase tracking-widest bg-muted/20 px-4 py-2 rounded-full border border-border/20">
                    Page {table.getState().pagination.pageIndex + 1} <span className="mx-2 opacity-30">/</span> {table.getPageCount()}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl h-10 w-10 p-0 hover:bg-primary/10 hover:text-primary transition-all border border-border/20"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl h-10 w-10 p-0 hover:bg-primary/10 hover:text-primary transition-all border border-border/20"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}