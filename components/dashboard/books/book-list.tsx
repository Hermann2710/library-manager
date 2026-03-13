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

export default async function BookList({ query }: { query: string }) {
    await dbConnect();

    const filter = query ? { title: { $regex: query, $options: "i" } } : {};

    const worksData = await Work.find(filter)
        .populate('authors')
        .populate('publisher')
        .populate('category')
        .populate('genres')
        .lean();

    const itemsData = await Item.find({ status: "Available" }).lean();
    const works = JSON.parse(JSON.stringify(worksData));
    const items = JSON.parse(JSON.stringify(itemsData));

    if (works.length === 0) {
        return <div className="text-center py-20 text-muted-foreground">Aucun livre trouvé pour "{query}"</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {works.map((work: any) => {
                const availableItem = items.find((item: any) => item.work === work._id);

                return (
                    <Card key={work._id} className="group flex flex-col border-muted/50 shadow-none hover:border-primary/30 transition-all duration-300 bg-card overflow-hidden rounded-xl h-full">
                        <BookDetailDialog work={work} availableItem={availableItem}>
                            <div className="flex flex-col flex-1 cursor-pointer">
                                {/* Zone Image avec hauteur contrôlée : aspect-[4/3] pour élargir visuellement */}
                                <div className="relative aspect-4/5 w-full bg-muted/20 overflow-hidden border-b">
                                    {work.coverImage ? (
                                        <Image
                                            src={work.coverImage}
                                            alt={work.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full opacity-20">
                                            <Book className="h-10 w-10" />
                                        </div>
                                    )}
                                    <Badge
                                        className="absolute top-2 right-2 text-[10px] font-bold"
                                        variant={availableItem ? "default" : "secondary"}
                                    >
                                        {availableItem ? "Libre" : "Sorti"}
                                    </Badge>
                                </div>

                                <CardHeader className="px-4 pt-4 space-y-1">
                                    <CardTitle className="text-sm font-bold line-clamp-1 leading-tight">
                                        {work.title}
                                    </CardTitle>
                                    <div className="flex flex-col">
                                        <p className="text-[12px] text-primary/80 font-medium truncate">
                                            {work.authors?.map((a: any) => a.name).join(", ")}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-semibold truncate tracking-tight">
                                            {work.publisher?.name}
                                        </p>
                                    </div>
                                </CardHeader>
                            </div>
                        </BookDetailDialog>

                        <CardFooter className="p-4 pt-0 mt-auto">
                            {availableItem ? (
                                <ReserveButton itemId={availableItem._id.toString()} title={work.title} />
                            ) : (
                                <div className="w-full text-center py-1.5 rounded bg-muted/50 text-[10px] font-bold text-muted-foreground/40 uppercase">
                                    Indisponible
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}