"use client"

import { CategoryManager } from "@/components/dashboard/categories/category-manager"
import { GenreManager } from "@/components/dashboard/ganres/genre-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardContainer } from "@/components/shared/dashboard-container"
import { Tags, Bookmark } from "lucide-react"

export default function TaxonomyPage() {
    return (
        <DashboardContainer
            title="TAXONOMIE"
            subtitle="Organisation"
            description="Structurez le catalogue en gérant les catégories thématiques et les genres littéraires."
            actions={
                <div className="bg-primary/10 p-2 rounded-xl border border-primary/20">
                    <Tags className="h-5 w-5 text-primary" />
                </div>
            }
        >
            <Tabs defaultValue="categories" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/50 p-1 h-12 rounded-xl">
                    <TabsTrigger
                        value="categories"
                        className="gap-2 font-black uppercase text-[10px] tracking-widest italic"
                    >
                        Catégories
                    </TabsTrigger>
                    <TabsTrigger
                        value="genres"
                        className="gap-2 font-black uppercase text-[10px] tracking-widest italic"
                    >
                        Genres
                    </TabsTrigger>
                </TabsList>

                <div className="mt-8">
                    <TabsContent value="categories" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-card rounded-[2rem] border p-6 shadow-sm">
                            <CategoryManager />
                        </div>
                    </TabsContent>

                    <TabsContent value="genres" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="bg-card rounded-[2rem] border p-6 shadow-sm">
                            <GenreManager />
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </DashboardContainer>
    )
}