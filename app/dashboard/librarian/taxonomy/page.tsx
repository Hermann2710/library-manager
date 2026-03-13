"use client"

import { CategoryManager } from "@/components/dashboard/categories/category-manager"
import { GenreManager } from "@/components/dashboard/ganres/genre-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TaxonomyPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight">Taxonomie</h1>
                <p className="text-muted-foreground">Organisez le catalogue par catégories thématiques et genres littéraires.</p>
            </div>

            <Tabs defaultValue="categories" className="w-full">
                <TabsList className="grid w-full max-w-100 grid-cols-2">
                    <TabsTrigger value="categories">Catégories</TabsTrigger>
                    <TabsTrigger value="genres">Genres</TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="mt-6">
                    <CategoryManager />
                </TabsContent>

                <TabsContent value="genres" className="mt-6">
                    <GenreManager />
                </TabsContent>
            </Tabs>
        </div>
    )
}