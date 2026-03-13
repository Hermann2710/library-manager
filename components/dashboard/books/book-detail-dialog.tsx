"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Book, Calendar, User, Building2, Tags, Info, Globe } from "lucide-react";
import Image from "next/image";

export function BookDetailDialog({ work, availableItem, children }: any) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-150 overflow-y-auto max-h-[90vh] border-none shadow-2xl">
                <DialogHeader className="pb-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <Info className="h-5 w-5 text-primary" />
                        Fiche Technique
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    {/* Colonne Gauche : Couverture */}
                    <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-muted shadow-lg border border-muted-foreground/10">
                        {work.coverImage ? (
                            <Image
                                src={work.coverImage}
                                alt={work.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full opacity-20 bg-linear-to-b from-muted to-muted-foreground/20">
                                <Book className="h-16 w-16" />
                                <span className="text-[10px] font-black mt-2 tracking-widest">SANS IMAGE</span>
                            </div>
                        )}
                    </div>

                    {/* Colonne Droite : Métadonnées */}
                    <div className="flex flex-col gap-5">
                        <section>
                            <h3 className="text-2xl font-black leading-tight tracking-tight text-foreground">{work.title}</h3>
                            <div className="flex items-center gap-2 text-primary font-bold mt-2">
                                <User className="h-4 w-4" />
                                <span className="text-sm">{work.authors?.map((a: any) => a.name).join(", ")}</span>
                            </div>
                        </section>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant={availableItem ? "default" : "secondary"} className="rounded-md font-bold">
                                {availableItem ? "Disponible" : "Prêté"}
                            </Badge>
                            <Badge variant="outline" className="gap-1 rounded-md">
                                <Globe className="h-3 w-3" /> {work.language}
                            </Badge>
                        </div>

                        <div className="grid gap-4 py-4 border-y border-muted/60">
                            {/* Éditeur */}
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/5 rounded-lg text-primary">
                                    <Building2 className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60 leading-none mb-1">Éditeur</p>
                                    <p className="text-sm font-bold">{work.publisher?.name || "Inconnu"}</p>
                                </div>
                            </div>

                            {/* Catégorie */}
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/5 rounded-lg text-orange-600">
                                    <Info className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60 leading-none mb-1">Catégorie</p>
                                    <p className="text-sm font-bold">{work.category?.name || "Non classé"}</p>
                                </div>
                            </div>

                            {/* Genres */}
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-500/5 rounded-lg text-blue-600">
                                    <Tags className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60 leading-none mb-1">Genres</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {work.genres?.map((g: any) => (
                                            <span key={g._id} className="text-[10px] bg-muted px-2 py-0.5 rounded-full font-semibold border border-muted-foreground/10">
                                                {g.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-[0.2em]">Résumé</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-5 italic">
                                {work.description || "Aucun résumé n'a été fourni pour cet ouvrage."}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}