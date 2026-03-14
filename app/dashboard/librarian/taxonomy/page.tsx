"use client"

import { CategoryManager } from "@/components/dashboard/categories/category-manager"
import { GenreManager } from "@/components/dashboard/ganres/genre-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardContainer } from "@/components/shared/dashboard-container"
import { Tags, Bookmark, Layers, Library } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * TaxonomyPage Component:
 * The architectural hub for library classification.
 * Allows administrators to toggle between "Categories" (Thematic) and "Genres" (Literary Style).
 */
export default function TaxonomyPage() {
    return (
        <DashboardContainer
            title="TAXONOMIE"
            subtitle="Organisation"
            description="Structurez le catalogue en gérant les catégories thématiques et les genres littéraires."
            actions={
                <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-border/40 shadow-sm">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                        Indexation active
                    </span>
                </div>
            }
        >
            <div className="space-y-8 animate-in fade-in duration-700">

                {/* NAVIGATION TABS: High-fidelity switch for taxonomy types */}
                <Tabs defaultValue="categories" className="w-full">
                    <div className="flex justify-start mb-8">
                        <TabsList className="inline-flex h-14 items-center justify-center rounded-[1.5rem] bg-muted/40 p-1.5 backdrop-blur-md border border-border/20 shadow-inner w-full max-w-lg">
                            <TabsTrigger
                                value="categories"
                                className={cn(
                                    "flex items-center gap-3 px-8 py-2.5 rounded-xl transition-all duration-300",
                                    "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-black/5",
                                    "font-black uppercase text-[10px] tracking-[0.2em] italic"
                                )}
                            >
                                <Bookmark className="h-3.5 w-3.5" />
                                Catégories
                            </TabsTrigger>
                            <TabsTrigger
                                value="genres"
                                className={cn(
                                    "flex items-center gap-3 px-8 py-2.5 rounded-xl transition-all duration-300",
                                    "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-black/5",
                                    "font-black uppercase text-[10px] tracking-[0.2em] italic"
                                )}
                            >
                                <Library className="h-3.5 w-3.5" />
                                Genres
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* CONTENT AREA: Large-radius containers with glassmorphism effects */}
                    <div className="relative">
                        <TabsContent
                            value="categories"
                            className="outline-none m-0 animate-in fade-in slide-in-from-left-4 duration-500"
                        >
                            <div className="bg-card/50 backdrop-blur-sm rounded-[2.5rem] border border-border/40 p-8 shadow-xl shadow-black/5">
                                <CategoryManager />
                            </div>
                        </TabsContent>

                        <TabsContent
                            value="genres"
                            className="outline-none m-0 animate-in fade-in slide-in-from-right-4 duration-500"
                        >
                            <div className="bg-card/50 backdrop-blur-sm rounded-[2.5rem] border border-border/40 p-8 shadow-xl shadow-black/5">
                                <GenreManager />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>

                {/* LOGISTICS HINT: Visual feedback for metadata strategy */}
                <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-[2rem] border border-dashed border-primary/20">
                    <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/10 text-primary">
                        <Tags className="h-5 w-5" />
                    </div>
                    <div className="space-y-0.5">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/80">Stratégie d'Indexation</h4>
                        <p className="text-[10px] text-muted-foreground italic font-medium leading-relaxed">
                            Les catégories définissent le "Sujet" (ex: Informatique), tandis que les genres définissent la "Forme" (ex: Roman, Essai).
                        </p>
                    </div>
                </div>
            </div>
        </DashboardContainer>
    )
}