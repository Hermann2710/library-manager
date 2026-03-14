import dbConnect from "@/lib/mongodb";
import { Work } from "@/lib/models/Work";
import { Item } from "@/lib/models/Item";
import "@/lib/models/Author";
import "@/lib/models/Publisher";
import "@/lib/models/Taxonomy";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReserveButton } from "@/components/dashboard/books/reserve-button";
import { BookDetailDialog } from "@/components/dashboard/books/book-detail-dialog";
import { Book } from "lucide-react";
import Image from "next/image";

/**
 * BookList Component.
 * A server-side component that fetches library works and their availability.
 * It features a responsive grid layout and handles 'Empty States' gracefully.
 */
export default async function BookList({ query }: { query: string }) {
    // Establishing a connection to MongoDB before any query execution
    await dbConnect();

    // Building a flexible search filter for titles (case-insensitive)
    const filter = query ? { title: { $regex: query, $options: "i" } } : {};

    /**
     * Data Fetching:
     * We populate multiple references to get a full view of the book (Authors, Category, etc.).
     * 'lean()' is used to improve performance by returning plain JS objects instead of Mongoose documents.
     */
    const worksData = await Work.find(filter)
        .populate('authors')
        .populate('publisher')
        .populate('category')
        .populate('genres')
        .lean();

    // Fetching available items to check real-time stock status
    const itemsData = await Item.find({ status: "Available" }).lean();

    // Formatting MongoDB objects to plain JSON to prevent Next.js serialization warnings
    const works = JSON.parse(JSON.stringify(worksData));
    const items = JSON.parse(JSON.stringify(itemsData));

    // Handling the case where no books match the user's search
    if (works.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-500">
                <div className="bg-muted/10 p-6 rounded-full mb-4">
                    <Book className="h-10 w-10 text-muted-foreground/20" />
                </div>
                <p className="text-sm font-bold text-muted-foreground">
                    Aucun livre trouvé pour "{query}"
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1 uppercase tracking-widest">
                    Vérifiez l'orthographe ou essayez un autre terme.
                </p>
            </div>
        );
    }

    return (
        /* Responsive Grid: Adapts from 1 column on mobile to 4 columns on large screens */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {works.map((work: any) => {
                // Checking if at least one copy of this work is ready for reservation
                const availableItem = items.find((item: any) => item.work === work._id);

                return (
                    <Card key={work._id} className="group flex flex-col border-muted/50 shadow-none hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 bg-card overflow-hidden rounded-2xl h-full">

                        {/* BookDetailDialog: Clicking the card triggers the detailed view modal */}
                        <BookDetailDialog work={work} availableItem={availableItem}>
                            <div className="flex flex-col flex-1 cursor-pointer">

                                {/* Cover Image Container:
                                    Using an aspect ratio (4/5) to maintain a consistent 'book cover' look.
                                */}
                                <div className="relative aspect-4/5 w-full bg-muted/20 overflow-hidden border-b border-border/40">
                                    {work.coverImage ? (
                                        <Image
                                            src={work.coverImage}
                                            alt={work.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full opacity-10">
                                            <Book className="h-16 w-16" />
                                        </div>
                                    )}

                                    {/* Availability Badge: Floats on top of the cover for quick identification */}
                                    <Badge
                                        className={`absolute top-3 right-3 text-[9px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-lg backdrop-blur-md border-none ${availableItem
                                            ? "bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/20"
                                            : "bg-zinc-500/80 text-white"
                                            }`}
                                    >
                                        {availableItem ? "Disponible" : "Indisponible"}
                                    </Badge>
                                </div>

                                <CardHeader className="px-4 pt-5 pb-2 space-y-2">
                                    <CardTitle className="text-[15px] font-black uppercase italic line-clamp-1 leading-none tracking-tight group-hover:text-primary transition-colors">
                                        {work.title}
                                    </CardTitle>

                                    <div className="flex flex-col gap-0.5">
                                        <p className="text-[11px] text-primary/80 font-bold truncate">
                                            {work.authors?.map((a: any) => a.name).join(", ")}
                                        </p>
                                        <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
                                            {work.publisher?.name || "Éditeur inconnu"}
                                        </p>
                                    </div>
                                </CardHeader>
                            </div>
                        </BookDetailDialog>

                        <CardFooter className="p-4 pt-2 mt-auto">
                            {/* Actions: Reservation logic depends on item availability */}
                            {availableItem ? (
                                <div className="w-full transform transition-transform active:scale-95">
                                    <ReserveButton itemId={availableItem._id.toString()} title={work.title} />
                                </div>
                            ) : (
                                <div className="w-full text-center py-2.5 rounded-xl bg-muted/30 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 border border-dashed border-border/60">
                                    En prêt
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}